import { createListenerMiddleware } from '@reduxjs/toolkit'
import { instructionMatchers } from './instructionMatchers.js'

export const instructionListener = createListenerMiddleware()

const FEEDBACK_MS = 200

function getActiveJudgeable(session) {
  return session.instructions
    .map((instruction, i) => ({ instruction, i, state: session.states[i] }))
    .filter(
      ({ instruction, state }) =>
        state.status === 'pending'
        && state.visible
        && !instruction.type.unjudgeable,
    )
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

        if (judgeable.length === 0) return

        const match = judgeable.find(({ instruction }) => {
          const matcher = instructionMatchers[instruction.type.id]
          return matcher?.(action.payload, instruction, { state: api.getState() })
        })

        if (match) {
          const { instruction, i } = match
          const isScrollDown =
            instruction.type.id === 'scroll_down'
            && action.payload.type === 'scroll'
            && action.payload.direction === 'down'
          api.dispatch(instructionSucceeded({ instructionIndex: i }))
          if (isScrollDown) {
            api.dispatch(instructionCompleted({ instructionIndex: i }))
            return
          }
          setTimeout(() => {
            if (api.getState().game.instructionSession?.states[i]?.feedback === 'success') {
              api.dispatch(instructionCompleted({ instructionIndex: i }))
            }
          }, FEEDBACK_MS)
          return
        }

        const fail = () => {
          api.dispatch(instructionFailed({ instructionIndices: judgeable.map(({ i }) => i) }))
          setTimeout(() => {
            api.dispatch(damageHealth())
            api.dispatch(clearInstructionFeedback())
            if (action.payload.pendingIndex !== undefined) {
              api.dispatch(setIndex(action.payload.pendingIndex))
            }
          }, FEEDBACK_MS)
        }
        fail()
        return
      }

      api.dispatch(damageHealth())
    },
  })
}
