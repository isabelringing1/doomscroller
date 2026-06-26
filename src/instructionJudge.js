import { createListenerMiddleware } from '@reduxjs/toolkit'
import { instructionMatchers } from './instructionMatchers.js'

export const instructionListener = createListenerMiddleware()

export function setupInstructionJudge({ playerAction, instructionCompleted }) {
  instructionListener.startListening({
    actionCreator: playerAction,
    effect: (action, api) => {
      const session = api.getState().game.instructionSession
      if (!session?.visible || session.status !== 'pending') return

      const matcher = instructionMatchers[session.instructionId]
      if (!matcher?.(action.payload, session.instruction, { state: api.getState() })) return

      api.dispatch(instructionCompleted())
    },
  })
}
