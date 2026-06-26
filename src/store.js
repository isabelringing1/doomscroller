import { configureStore, createSlice } from '@reduxjs/toolkit'
import { instructionListener, setupInstructionJudge } from './instructionJudge.js'

const feedSlice = createSlice({
  name: 'feed',
  initialState: { currentIndex: 0 },
  reducers: {
    next: (s) => { s.currentIndex += 1 },
    prev: (s) => { s.currentIndex -= 1 },
    setIndex: (s, { payload }) => { s.currentIndex = payload },
  },
})

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    score: 0,
    instructionSession: null,
  },
  reducers: {
    playerAction: () => {},
    instructionPageActive: (s, { payload: { pageIndex, instruction } }) => {
      s.instructionSession = {
        pageIndex,
        instructionId: instruction.type.id,
        instruction,
        visible: false,
        status: 'pending',
      }
    },
    instructionVisible: (s, { payload: { pageIndex } }) => {
      if (s.instructionSession?.pageIndex !== pageIndex) return
      s.instructionSession.visible = true
    },
    instructionCompleted: (s) => {
      if (s.instructionSession?.status !== 'pending') return
      s.instructionSession.status = 'completed'
      s.score += 1
    },
  },
})

export const { next, prev, setIndex } = feedSlice.actions
export const {
  playerAction,
  instructionPageActive,
  instructionVisible,
  instructionCompleted,
} = gameSlice.actions

setupInstructionJudge({ playerAction, instructionCompleted })

export const store = configureStore({
  reducer: {
    feed: feedSlice.reducer,
    game: gameSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(instructionListener.middleware),
})
