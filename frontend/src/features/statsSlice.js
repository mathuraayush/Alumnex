import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchCompanyStats = createAsyncThunk('stats/company', async (_, { rejectWithValue }) => {
  try {
    const res = await api.getCompanyStats()
    return res.data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchDifficultyStats = createAsyncThunk('stats/difficulty', async (_, { rejectWithValue }) => {
  try {
    const res = await api.getDifficultyStats()
    return res.data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchYearStats = createAsyncThunk('stats/year', async (_, { rejectWithValue }) => {
  try {
    const res = await api.getYearStats()
    return res.data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    company: { data: [], status: 'idle', error: null },
    difficulty: { data: [], status: 'idle', error: null },
    year: { data: [], status: 'idle', error: null }
  },
  reducers: {},
  extraReducers: (builder) => {
    // Company Stats
    builder
      .addCase(fetchCompanyStats.pending, (state) => { state.company.status = 'loading'; state.company.error = null })
      .addCase(fetchCompanyStats.fulfilled, (state, action) => {
        state.company.status = 'succeeded'
        state.company.data = action.payload || []
      })
      .addCase(fetchCompanyStats.rejected, (state, action) => {
        state.company.status = 'failed'
        state.company.error = action.payload
      })

    // Difficulty Stats
    builder
      .addCase(fetchDifficultyStats.pending, (state) => { state.difficulty.status = 'loading'; state.difficulty.error = null })
      .addCase(fetchDifficultyStats.fulfilled, (state, action) => {
        state.difficulty.status = 'succeeded'
        state.difficulty.data = action.payload || []
      })
      .addCase(fetchDifficultyStats.rejected, (state, action) => {
        state.difficulty.status = 'failed'
        state.difficulty.error = action.payload
      })

    // Year Stats
    builder
      .addCase(fetchYearStats.pending, (state) => { state.year.status = 'loading'; state.year.error = null })
      .addCase(fetchYearStats.fulfilled, (state, action) => {
        state.year.status = 'succeeded'
        state.year.data = action.payload || []
      })
      .addCase(fetchYearStats.rejected, (state, action) => {
        state.year.status = 'failed'
        state.year.error = action.payload
      })
  }
})

export default statsSlice.reducer
