import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchThreadById } from '../features/threadsSlice'
import Skeleton from '../components/Skeleton'

export default function ThreadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { current, status, error } = useSelector(s => s.threads)

  useEffect(() => {
    dispatch(fetchThreadById(id))
  }, [dispatch, id])

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    }
    return colors[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-6" />
          <Skeleton className="h-40" />
        </div>
      </MainLayout>
    )
  }

  if (error || !current) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The experience you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 font-medium mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        <article className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {current.company?.name || 'Unknown Company'}
            </h1>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(current.difficulty)}`}>
              {current.difficulty || 'Medium'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">{current.jobRole?.title || 'Position'}</span>
            </div>
            <span>•</span>
            <div>{current.yearOfPlacement || 'Year not specified'}</div>
            {current.rounds && (
              <>
                <span>•</span>
                <div>{current.rounds} rounds</div>
              </>
            )}
            <span>•</span>
            <time>{formatDate(current.createdAt)}</time>
          </div>

          {current.candidateName && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
              <span className="font-medium">Experience shared by:</span> {current.candidateName}
              {current.linkedin && (
                <a
                  href={current.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}

          <hr className="my-6" />

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {current.experience || 'No experience description provided.'}
            </div>
          </div>

          {current.topicsCovered && Array.isArray(current.topicsCovered) && current.topicsCovered.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {current.topicsCovered.map((topic, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {typeof topic === 'string' ? topic.trim() : topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </MainLayout>
  )
}
