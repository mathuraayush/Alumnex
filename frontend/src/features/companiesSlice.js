import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchCompanies = createAsyncThunk('companies/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.getCompanies()
    return res.data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const companiesSlice = createSlice({
  name: 'companies',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to fetch companies'
        state.list = []
      })
  }
})

export default companiesSlice.reducer
