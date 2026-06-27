import { configureStore, createSlice } from '@reduxjs/toolkit'
import { instructionListener, setupInstructionJudge } from './instructionJudge.js'

const feedSlice = createSlice({
  name: 'feed',
  initialState: { currentIndex: 0, isScrollingDown: false },
  reducers: {
    next: (s) => { s.currentIndex += 1 },
    prev: (s) => { s.currentIndex -= 1 },
    setIndex: (s, { payload }) => { s.currentIndex = payload },
    setScrollingDown: (s, { payload }) => { s.isScrollingDown = payload },
  },
})

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    score: 0,
    health: 1,
    instructionSession: null,
    pageEngagement: {},
    instructionFailureOverlay: null,
  },
  reducers: {
    playerAction: () => {},
    togglePageEngagement: (s, { payload: { pageIndex, name } }) => {
      if (name !== 'like' && name !== 'save') return
      const field = name === 'like' ? 'liked' : 'saved'
      if (!s.pageEngagement[pageIndex]) {
        s.pageEngagement[pageIndex] = { liked: false, saved: false }
      }
      s.pageEngagement[pageIndex][field] = !s.pageEngagement[pageIndex][field]
    },
    damageHealth: (s) => {
      s.health -= 1
    },
    instructionPageActive: (s, { payload: { pageIndex, instructions } }) => {
      s.instructionSession = {
        pageIndex,
        instructions,
        instructionIndex: 0,
        instructionId: instructions[0].type.id,
        instruction: instructions[0],
        visible: false,
        status: 'pending',
        feedback: null,
      }
    },
    instructionVisible: (s, { payload: { pageIndex } }) => {
      if (s.instructionSession?.pageIndex !== pageIndex) return
      s.instructionSession.visible = true
    },
    instructionSucceeded: (s) => {
      if (s.instructionSession?.status !== 'pending') return
      s.score += 1
      if (s.instructionSession.instructionId !== 'scroll_down') {
        s.instructionSession.feedback = 'success'
      }
    },
    instructionFailed: (s) => {
      if (s.instructionSession?.status !== 'pending' || !s.instructionSession.visible) return
      s.instructionFailureOverlay = {
        pageIndex: s.instructionSession.pageIndex,
        displayText: s.instructionSession.instruction.type.display_text,
      }
    },
    clearInstructionFeedback: (s) => {
      if (s.instructionSession) s.instructionSession.feedback = null
      s.instructionFailureOverlay = null
    },
    instructionCompleted: (s) => {
      if (s.instructionSession?.status !== 'pending') return
      s.instructionSession.feedback = null

      const { instructions, instructionIndex } = s.instructionSession
      const nextIndex = instructionIndex + 1

      if (instructions.length > 1 && nextIndex < instructions.length) {
        s.instructionSession.instructionIndex = nextIndex
        s.instructionSession.instruction = instructions[nextIndex]
        s.instructionSession.instructionId = instructions[nextIndex].type.id
        s.instructionSession.visible = false
        return
      }

      s.instructionSession.status = 'completed'
      s.instructionSession.visible = false
    },
  },
})

export const { next, prev, setIndex, setScrollingDown } = feedSlice.actions
export const {
  playerAction,
  damageHealth,
  togglePageEngagement,
  instructionPageActive,
  instructionVisible,
  instructionSucceeded,
  instructionFailed,
  clearInstructionFeedback,
  instructionCompleted,
} = gameSlice.actions

setupInstructionJudge({
  playerAction,
  instructionSucceeded,
  instructionCompleted,
  instructionFailed,
  clearInstructionFeedback,
  damageHealth,
  setIndex,
})

export const store = configureStore({
  reducer: {
    feed: feedSlice.reducer,
    game: gameSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(instructionListener.middleware),
})
