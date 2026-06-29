import { createListenerMiddleware } from '@reduxjs/toolkit'
import { instructionMatchers } from './instructionMatchers.js'

export const instructionListener = createListenerMiddleware()

const FEEDBACK_MS = 200

function getActiveVisible(session) {
  return session.instructions
    .map((instruction, i) => ({ instruction, i, state: session.states[i] }))
    .filter(({ state }) => state.status === 'pending' && state.visible)
}

function getActiveJudgeable(session) {
  return getActiveVisible(session).filter(({ instruction }) => !instruction.type.unjudgeable)
}

function onlyUnjudgeableVisible(session) {
  const active = getActiveVisible(session)
  return active.length > 0 && active.every(({ instruction }) => instruction.type.unjudgeable)
}

export function setupInstructionJudge({
  playerAction,
  instructionSucceeded,
  instructionCompleted,
  instructionFailed,
  clearInstructionFeedback,
  damageHealth,
  setIndex,
}) {
  instructionListener.startListening({
    actionCreator: playerAction,
    effect: (action, api) => {
      const { health, instructionSession: session } = api.getState().game
      if (health <= 0) return
      if (session?.status === 'completed') return

      if (session?.states?.some((state) => state.feedback)) return

      if (session) {
        const judgeable = getActiveJudgeable(session)

        const fail = (instructionIndices) => {
          api.dispatch(instructionFailed({ instructionIndices }))
          setTimeout(() => {
            api.dispatch(damageHealth())
            api.dispatch(clearInstructionFeedback())
            if (action.payload.pendingIndex !== undefined) {
              api.dispatch(setIndex(action.payload.pendingIndex))
            }
          }, FEEDBACK_MS)
        }

        if (judgeable.length === 0) {
          if (onlyUnjudgeableVisible(session)) {
            fail(getActiveVisible(session).map(({ i }) => i))
          }
          return
        }

        const match = judgeable.find(({ instruction }) => {
          const matcher = instructionMatchers[instruction.type.id]
          return matcher?.(action.payload, instruction, { state: api.getState() })
        })

        if (match) {
          const { i } = match
          api.dispatch(instructionSucceeded({ instructionIndex: i }))
          setTimeout(() => {
            if (api.getState().game.instructionSession?.states[i]?.feedback === 'success') {
              api.dispatch(instructionCompleted({ instructionIndex: i }))
            }
          }, FEEDBACK_MS)
          return
        }

        fail(judgeable.map(({ i }) => i))
        return
      }

      api.dispatch(damageHealth())
    },
  })
}
