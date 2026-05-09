import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function BulkUpload() {
  const navigate = useNavigate()
  const { admin } = useAuth()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      setFileName(file.name)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select a file')
      return
    }

    const file = fileInputRef.current.files[0]
    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.bulkUploadThreads(formData)
      setResult(response.data)
      setFileName('')
      fileInputRef.current.value = ''
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please check your file format.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            📤 Bulk Upload Threads
          </h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 CSV Format Guide</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 text-sm text-gray-700 space-y-4">
              <div>
                <p className="font-bold text-blue-900 mb-2">✓ Required Columns:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Company Name</strong> - Auto-creates if doesn't exist</li>
                  <li>• <strong>Role Offered</strong> - Auto-creates if doesn't exist</li>
                  <li>• <strong>Placement Year</strong> - Numeric year (e.g., 2024)</li>
                  <li>• <strong>Difficulty Level</strong> - Easy, Medium, or Hard</li>
                  <li>• <strong>Interview Experience</strong> - Full description</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-blue-900 mb-2">◇ Optional Columns:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Interview Rounds</strong> - Separated by | (e.g., "Online|Technical|HR")</li>
                  <li>• <strong>Key Topics Covered</strong> - Separated by | (e.g., "DSA|Design")</li>
                  <li>• <strong>Your Name</strong> - Candidate name</li>
                  <li>• <strong>LinkedIn Profile</strong> - LinkedIn URL</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-lg flex gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold">Upload Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <p className="text-blue-600 font-bold group-hover:text-blue-700">
                  Click to select CSV file
                </p>
                <p className="text-gray-500 text-sm">or drag and drop it here</p>
              </div>
              {fileName && (
                <div className="mt-4">
                  <p className="text-green-600 font-semibold flex items-center justify-center gap-2">
                    <span>✓</span> {fileName}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !fileName}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition shadow-lg"
            >
              {loading ? 'Uploading...' : 'Upload Threads'}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-8">
              <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                <span>✓</span> Upload Completed
              </h3>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center bg-white rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-600">{result.inserted}</p>
                  <p className="text-sm text-green-700 font-medium">Inserted</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4">
                  <p className="text-3xl font-bold text-yellow-600">{result.failed}</p>
                  <p className="text-sm text-yellow-700 font-medium">Failed</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4">
                  <p className="text-3xl font-bold text-gray-600">{result.totalRows}</p>
                  <p className="text-sm text-gray-700 font-medium">Total Rows</p>
                </div>
              </div>

              {/* Errors */}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-6 mb-6">
                  <h4 className="font-bold text-red-900 mb-3 text-sm">❌ {result.errors.length} Rows Failed:</h4>
                  <div className="bg-white rounded border border-red-200 max-h-40 overflow-y-auto">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="px-4 py-3 border-b border-red-100 text-sm text-red-700 last:border-b-0">
                        <p><strong>Row {idx + 1}:</strong> {err.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/admin/dashboard')}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 font-bold transition"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
