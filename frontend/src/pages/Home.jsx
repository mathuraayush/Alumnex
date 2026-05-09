import React, { useEffect, useState, useCallback } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchThreads } from '../features/threadsSlice'
import { fetchCompanies } from '../features/companiesSlice'
import ThreadCard from '../components/ThreadCard'
import FiltersPanel from '../components/FiltersPanel'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import Skeleton from '../components/Skeleton'

export default function Home() {
  const dispatch = useDispatch()
  const { list, status, error, page, totalPages, total } = useSelector(s => s.threads)
  const { list: companies } = useSelector(s => s.companies)
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    company: '',
    role: '',
    year: '',
    difficulty: '',
    search: ''
  })

  // Fetch companies only once on mount
  useEffect(() => {
    dispatch(fetchCompanies())
  }, [])

  // Fetch threads when filters change
  useEffect(() => {
    dispatch(fetchThreads(filters))
  }, [filters])

  const handleSearch = useCallback((query) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }))
  }, [])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  )

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">Interview Experiences</h1>
          <p className="text-blue-100">Learn from {} shared experiences</p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FiltersPanel 
              companies={companies} 
              onFilterChange={handleFilterChange}
              selectedFilters={filters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {status === 'loading' ? 'Loading...' : `${total} results found`}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Thread List */}
            {status === 'loading' ? (
              <LoadingSkeleton />
            ) : list.length > 0 ? (
              <div className="space-y-4">
                {list.map((thread) => (
                  <ThreadCard key={thread._id} thread={thread} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No experiences found</p>
                <p className="text-gray-400">Try adjusting your filters or search</p>
              </div>
            )}

            {/* Pagination */}
            {list.length > 0 && totalPages > 1 && (
              <div className="mt-8">
                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
