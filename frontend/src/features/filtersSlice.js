import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  query: '',
  company: [],
  role: [],
  year: [],
  difficulty: [],
  page: 1,
  perPage: 10
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action) { state.query = action.payload },
    setCompany(state, action) { state.company = action.payload },
    setRole(state, action) { state.role = action.payload },
    setYear(state, action) { state.year = action.payload },
    setDifficulty(state, action) { state.difficulty = action.payload },
    setPage(state, action) { state.page = action.payload },
    resetFilters() { return initialState }
  }
})

export const { setQuery, setCompany, setRole, setYear, setDifficulty, setPage, resetFilters } = filtersSlice.actions

export default filtersSlice.reducer
