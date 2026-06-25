import { configureStore, createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
  name: 'feed',
  initialState: { currentIndex: 0 },
  reducers: {
    next: (s) => { s.currentIndex += 1 },
    prev: (s) => { s.currentIndex -= 1 },
  },
})

export const { next, prev } = feedSlice.actions

export const store = configureStore({
  reducer: { feed: feedSlice.reducer },
})
