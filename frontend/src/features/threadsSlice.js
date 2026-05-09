import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchThreads = createAsyncThunk('threads/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await api.getThreads(params)
    return res.data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchThreadById = createAsyncThunk('threads/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.getThread(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    list: [],
    current: null,
    total: 0,
    page: 1,
    totalPages: 1,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload.results || []
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.totalPages = action.payload.totalPages || 1
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to fetch threads'
        state.list = []
      })
      .addCase(fetchThreadById.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchThreadById.fulfilled, (state, action) => { state.status = 'succeeded'; state.current = action.payload })
      .addCase(fetchThreadById.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export default threadsSlice.reducer
