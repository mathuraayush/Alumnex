import { configureStore } from '@reduxjs/toolkit'
import companiesReducer from '../features/companiesSlice'
import threadsReducer from '../features/threadsSlice'
import filtersReducer from '../features/filtersSlice'
import statsReducer from '../features/statsSlice'

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
    threads: threadsReducer,
    filters: filtersReducer,
    stats: statsReducer
  }
})
