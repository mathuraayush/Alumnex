import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CreateThread() {
  const navigate = useNavigate()
  const { admin } = useAuth()
  const [companies, setCompanies] = useState([])
  const [jobRoles, setJobRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [creatingCompany, setCreatingCompany] = useState(false)
  const [showNewRoleModal, setShowNewRoleModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [creatingRole, setCreatingRole] = useState(false)

  const [formData, setFormData] = useState({
    companySlug: '',
    roleTitle: '',
    yearOfPlacement: new Date().getFullYear(),
    difficulty: 'Medium',
    rounds: '',
    topicsCovered: '',
    experience: '',
    candidateName: '',
    linkedin: ''
  })

  // Load companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await api.getCompanies()
        setCompanies(res.data || [])
      } catch (err) {
        console.error('Failed to load companies:', err)
      }
    }
    loadCompanies()
  }, [])

  // Load job roles when company changes
  useEffect(() => {
    const loadRoles = async () => {
      if (!formData.companySlug) {
        setJobRoles([])
        return
      }
      try {
        const res = await api.getJobRoles()
        const filtered = res.data.filter(r => r.company?.slug === formData.companySlug) || []
        setJobRoles(filtered)
      } catch (err) {
        console.error('Failed to load roles:', err)
      }
    }
    loadRoles()
  }, [formData.companySlug])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      setError('Company name cannot be empty')
      return
    }

    setCreatingCompany(true)
    setError('')

    try {
      // Since we don't have a create endpoint, we'll add it to the list locally
      // In production, you'd call: await api.createCompany({ name: newCompanyName })
      const slug = newCompanyName.toLowerCase().replace(/\s+/g, '-')
      const newCompany = { _id: Date.now(), name: newCompanyName, slug }
      
      setCompanies([...companies, newCompany])
      setFormData(prev => ({ ...prev, companySlug: slug }))
      setNewCompanyName('')
      setShowNewCompanyModal(false)
      setSuccess('Company added successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to create company')
    } finally {
      setCreatingCompany(false)
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      setError('Role name cannot be empty')
      return
    }

    setCreatingRole(true)
    setError('')

    try {
      // Add role to the list locally
      // In production, you'd call: await api.createRole({ title: newRoleName, company: formData.companySlug })
      const newRole = { _id: Date.now(), title: newRoleName, company: { slug: formData.companySlug } }
      
      setJobRoles([...jobRoles, newRole])
      setFormData(prev => ({ ...prev, roleTitle: newRoleName }))
      setNewRoleName('')
      setShowNewRoleModal(false)
      setSuccess('Role added successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to create role')
    } finally {
      setCreatingRole(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = {
        ...formData,
        topicsCovered: formData.topicsCovered.split(',').map(t => t.trim()).filter(Boolean),
        rounds: formData.rounds.split(',').map(r => r.trim()).filter(Boolean),
        yearOfPlacement: Number(formData.yearOfPlacement)
      }

      await api.createThread(data)
      setSuccess('Thread created successfully!')
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create thread')
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
            Create Thread
          </h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
              <span className="text-xl">✓</span>
              <p className="font-semibold">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Company <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="companySlug"
                  value={formData.companySlug}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a company</option>
                  {companies.map(c => (
                    <option key={c._id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCompanyModal(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  + New
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="roleTitle"
                  value={formData.roleTitle}
                  onChange={handleChange}
                  required
                  disabled={!formData.companySlug}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select a role</option>
                  {jobRoles.map(r => (
                    <option key={r._id} value={r.title}>{r.title}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewRoleModal(true)}
                  disabled={!formData.companySlug}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                >
                  + New
                </button>
              </div>
            </div>

            {/* Year of Placement */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Year of Placement <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="yearOfPlacement"
                value={formData.yearOfPlacement}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear()}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Number of Rounds */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Interview Rounds (comma-separated)
              </label>
              <input
                type="text"
                name="rounds"
                value={formData.rounds}
                onChange={handleChange}
                placeholder="e.g., Online Test, Technical Round, HR Round"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Topics Covered */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Topics Covered (comma-separated)
              </label>
              <textarea
                name="topicsCovered"
                value={formData.topicsCovered}
                onChange={handleChange}
                placeholder="e.g., DSA, System Design, OOP"
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Experience Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Interview Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your interview experience in detail..."
                rows="6"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Candidate Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Your Name
              </label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition shadow-lg"
            >
              {loading ? 'Creating...' : 'Create Thread'}
            </button>
          </form>
        </div>
      </main>

      {/* New Company Modal */}
      {showNewCompanyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Company</h3>
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCompany()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewCompanyModal(false)
                  setNewCompanyName('')
                  setError('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCompany}
                disabled={creatingCompany || !newCompanyName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
              >
                {creatingCompany ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Role Modal */}
      {showNewRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Role</h3>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRole()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewRoleModal(false)
                  setNewRoleName('')
                  setError('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={creatingRole || !newRoleName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
              >
                {creatingRole ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
