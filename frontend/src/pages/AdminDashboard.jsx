import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext'
import { fetchCompanyStats, fetchDifficultyStats, fetchYearStats } from '../features/statsSlice'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { admin, logout } = useAuth()
  const { company, difficulty, year } = useSelector(s => s.stats)

  useEffect(() => {
    dispatch(fetchCompanyStats())
    dispatch(fetchDifficultyStats())
    dispatch(fetchYearStats())
  }, [dispatch])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              📊 Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Welcome, {admin?.email || 'Admin'}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate('/admin/thread/create')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium shadow transition"
            >
              ➕ Create Thread
            </button>
            <button
              onClick={() => navigate('/admin/bulk-upload')}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-medium shadow transition"
            >
              📤 Bulk Upload
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-medium shadow transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Threads */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition p-8 border-l-4 border-blue-500">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Threads</p>
            <p className="text-4xl font-bold text-blue-600 mt-3">
              {company.data.reduce((sum, c) => sum + c.totalThreads, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Across all companies</p>
          </div>

          {/* Total Companies */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition p-8 border-l-4 border-purple-500">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Companies</p>
            <p className="text-4xl font-bold text-purple-600 mt-3">{company.data.length}</p>
            <p className="text-sm text-gray-500 mt-2">With interview experiences</p>
          </div>

          {/* Difficulty Levels */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition p-8 border-l-4 border-green-500">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Difficulty Levels</p>
            <p className="text-4xl font-bold text-green-600 mt-3">{difficulty.data.length}</p>
            <p className="text-sm text-gray-500 mt-2">Easy, Medium, Hard</p>
          </div>
        </div>

        {/* Company Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🏢</span>
            <h2 className="text-2xl font-bold text-gray-900">Company Statistics</h2>
          </div>
          {company.status === 'loading' ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="inline-block animate-spin text-2xl mb-2">⚙️</div>
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : company.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {company.data.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition p-6 border-l-4 border-blue-500"
                >
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Company</p>
                  <p className="text-3xl font-bold text-blue-600 mt-3">{stat.company}</p>
                  <p className="text-sm text-gray-500 mt-3">
                    <span className="font-bold text-gray-700">{stat.totalThreads}</span> experiences
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
              No company data available
            </div>
          )}
        </div>

        {/* Difficulty Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⚡</span>
            <h2 className="text-2xl font-bold text-gray-900">Difficulty Distribution</h2>
          </div>
          {difficulty.status === 'loading' ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="inline-block animate-spin text-2xl mb-2">⚙️</div>
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : difficulty.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficulty.data.map((stat, idx) => {
                const colors = {
                  'Easy': { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600', icon: '✓' },
                  'Medium': { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-600', icon: '◆' },
                  'Hard': { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600', icon: '✕' }
                }
                const color = colors[stat.difficulty] || { border: 'border-gray-500', bg: 'bg-gray-50', text: 'text-gray-600', icon: '•' }
                
                return (
                  <div key={idx} className={`${color.bg} rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition p-6 border-l-4 ${color.border}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Difficulty</p>
                        <p className={`text-3xl font-bold ${color.text} mt-3`}>{stat.difficulty}</p>
                        <p className="text-sm text-gray-600 mt-3">
                          <span className="font-bold">{stat.count}</span> experiences
                        </p>
                      </div>
                      <span className={`text-5xl ${color.text} opacity-20`}>{color.icon}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
              No difficulty data available
            </div>
          )}
        </div>

        {/* Year Stats */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">📅</span>
            <h2 className="text-2xl font-bold text-gray-900">Year-wise Statistics</h2>
          </div>
          {year.status === 'loading' ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="inline-block animate-spin text-2xl mb-2">⚙️</div>
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : year.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {year.data.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition p-6 border-l-4 border-purple-500"
                >
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Year</p>
                  <p className="text-3xl font-bold text-purple-600 mt-3">{stat.year}</p>
                  <p className="text-sm text-gray-500 mt-3">
                    <span className="font-bold text-gray-700">{stat.total}</span> experiences
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
              No year data available
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
