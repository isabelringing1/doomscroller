import { createListenerMiddleware } from '@reduxjs/toolkit'
import { instructionMatchers } from './instructionMatchers.js'

export const instructionListener = createListenerMiddleware()

const FEEDBACK_MS = 200

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
      const { health, instructionSession: session, instructionFailureOverlay } = api.getState().game
      if (health <= 0 || instructionFailureOverlay) return

      const isListening = session?.visible && session.status === 'pending'

      if (isListening) {
        const matcher = instructionMatchers[session.instructionId]
        if (matcher?.(action.payload, session.instruction, { state: api.getState() })) {
          const isScrollDown =
            session.instructionId === 'scroll_down'
            && action.payload.type === 'scroll'
            && action.payload.direction === 'down'
          api.dispatch(instructionSucceeded())
          if (isScrollDown) {
            api.dispatch(instructionCompleted())
            return
          }
          setTimeout(() => {
            if (api.getState().game.instructionSession?.feedback === 'success') {
              api.dispatch(instructionCompleted())
            }
          }, FEEDBACK_MS)
          return
        }
        api.dispatch(instructionFailed())
        setTimeout(() => {
          api.dispatch(damageHealth())
          api.dispatch(clearInstructionFeedback())
          if (action.payload.pendingIndex !== undefined) {
            api.dispatch(setIndex(action.payload.pendingIndex))
          }
        }, FEEDBACK_MS)
        return
      }

      api.dispatch(damageHealth())
    },
  })
}
