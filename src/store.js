import { configureStore, createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
  name: 'feed',
  initialState: { currentIndex: 0 },
  reducers: {
    next: (s) => { s.currentIndex += 1 },
    prev: (s) => { s.currentIndex -= 1 },
    setIndex: (s, { payload }) => { s.currentIndex = payload },
  },
})

export const { next, prev, setIndex } = feedSlice.actions

export const store = configureStore({
  reducer: { feed: feedSlice.reducer },
})
