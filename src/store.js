import { configureStore, createSlice } from '@reduxjs/toolkit'
import { instructionListener, setupInstructionJudge } from './instructionJudge.js'
import { isInstructionBlocked } from './Util.js'
import { MIN_PAGE_INDEX } from './pageMeta.js'

const clampPageIndex = (index) => Math.max(MIN_PAGE_INDEX, index)

const feedSlice = createSlice({
  name: 'feed',
  initialState: { currentIndex: 0, scrollDirection: null, titleDismissed: false, feedGeneration: 0 },
  reducers: {
    next: (s) => { s.currentIndex = clampPageIndex(s.currentIndex + 1) },
    prev: (s) => { s.currentIndex = clampPageIndex(s.currentIndex - 1) },
    setIndex: (s, { payload }) => { s.currentIndex = clampPageIndex(payload) },
    setScrollDirection: (s, { payload }) => { s.scrollDirection = payload },
    dismissTitle: (s) => { s.titleDismissed = true },
    resetFeed: (s) => {
      s.currentIndex = 0
      s.scrollDirection = null
      s.titleDismissed = false
      s.feedGeneration += 1
    },
  },
})

function allJudgeableCompleted(session) {
  return session.instructions.every(
    (instruction, i) =>
      instruction.type.unjudgeable || session.states[i].status === 'completed',
  )
}

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    score: 0,
    health: 1,
    gameStarted: false,
    zenMode: false,
    gameStartedAt: null,
    gameDurationMs: null,
    instructionSession: null,
    pageEngagement: {},
    speedUpHeld: false,
    commentsOpen: false,
    commentsTopBlueText: null,
    commentsScrolling: false,
    shareOpen: false,
  },
  reducers: {
    playerAction: () => {},
    setSpeedUpHeld: (s, { payload }) => { s.speedUpHeld = payload },
    setCommentsScrolling: (s, { payload }) => { s.commentsScrolling = payload },
    openComments: (s, { payload }) => {
      s.shareOpen = false
      s.commentsOpen = true
      const topBlueText = typeof payload === 'string' ? payload : payload?.topBlueText
      if (topBlueText !== undefined) {
        s.commentsTopBlueText = topBlueText || null
      }
    },
    closeComments: (s) => {
      s.commentsOpen = false
      s.commentsScrolling = false
    },
    openShare: (s) => {
      s.commentsOpen = false
      s.commentsScrolling = false
      s.shareOpen = true
    },
    closeShare: (s) => {
      s.shareOpen = false
    },
    startGame: (s, { payload }) => {
      s.gameStarted = true
      s.zenMode = payload?.zenMode ?? false
    },
    beginGameplay: (s) => {
      s.gameStartedAt = Date.now()
      s.gameDurationMs = null
    },
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
      if (s.health <= 0 && s.gameStartedAt != null && s.gameDurationMs == null) {
        s.gameDurationMs = Date.now() - s.gameStartedAt
      }
    },
    instructionPageActive: (s, { payload: { pageIndex, instructions } }) => {
      s.instructionSession = {
        pageIndex,
        instructions,
        status: 'pending',
        states: instructions.map((instruction) => ({
          status: 'pending',
          visible: false,
          feedback: null,
        })),
      }
    },
    instructionVisible: (s, { payload: { pageIndex, instructionIndex } }) => {
      const session = s.instructionSession
      if (session?.pageIndex !== pageIndex) return
      if (isInstructionBlocked(session, instructionIndex)) return
      const state = session.states[instructionIndex]
      if (state.visible) return
      state.visible = true
    },
    instructionSucceeded: (s, { payload: { instructionIndex } }) => {
      const session = s.instructionSession
      if (!session || session.status !== 'pending') return
      const state = session.states[instructionIndex]
      if (!state || state.status !== 'pending') return
      s.score += 1
      state.feedback = 'success'
    },
    instructionFailed: (s, { payload: { instructionIndices } }) => {
      const session = s.instructionSession
      if (!session || session.status !== 'pending') return
      for (const index of instructionIndices) {
        session.states[index].feedback = 'failure'
      }
    },
    clearInstructionFeedback: (s) => {
      s.instructionSession?.states.forEach((state) => {
        state.feedback = null
      })
    },
    instructionCompleted: (s, { payload: { instructionIndex } }) => {
      const session = s.instructionSession
      if (!session || session.status !== 'pending') return
      const state = session.states[instructionIndex]
      if (!state || state.status !== 'pending') return
      state.feedback = null
      state.status = 'completed'
      if (allJudgeableCompleted(session)) {
        session.status = 'completed'
      }
    },
    startOver: (s) => {
      s.score = 0
      s.health = 1
      s.gameStarted = false
      s.zenMode = false
      s.gameStartedAt = null
      s.gameDurationMs = null
      s.instructionSession = null
      s.pageEngagement = {}
      s.speedUpHeld = false
      s.commentsOpen = false
      s.commentsTopBlueText = null
      s.commentsScrolling = false
      s.shareOpen = false
    },
  },
})

export const { next, prev, setIndex, setScrollDirection, dismissTitle, resetFeed } = feedSlice.actions
export const {
  playerAction,
  setSpeedUpHeld,
  setCommentsScrolling,
  openComments,
  closeComments,
  openShare,
  closeShare,
  startGame,
  beginGameplay,
  startOver,
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
  instructionVisible,
  instructionSucceeded,
  instructionCompleted,
  instructionFailed,
  clearInstructionFeedback,
  damageHealth,
  setIndex,
  closeShare,
})

export const store = configureStore({
  reducer: {
    feed: feedSlice.reducer,
    game: gameSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(instructionListener.middleware),
})
