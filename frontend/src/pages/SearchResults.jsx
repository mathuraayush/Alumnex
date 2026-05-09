import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import api from '../services/api'
import ThreadCard from '../components/ThreadCard'
import CompanyCard from '../components/CompanyCard'
import { useState } from 'react'
import Skeleton from '../components/Skeleton'
import Pagination from '../components/Pagination'

export default function SearchResults(){
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const page = parseInt(params.get('page') || '1', 10)
  const [results, setResults] = useState({ companies: [], threads: [], meta: { totalPages: 1 } })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.search(q, { page }).then(res => {
      setResults({ companies: res.data.companies || [], threads: res.data.threads || [], meta: res.data.meta || { totalPages: 1 } })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [q, page])

  function goPage(p) {
    params.set('page', p)
    setParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold">Search results for “{q}”</h1>
      {loading ? <Skeleton className="h-8" /> : (
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold">Threads</h3>
            {results.threads.length === 0 ? <div className="text-muted">No threads found</div> : results.threads.map(t => <ThreadCard key={t._id || t.id} thread={t} />)}
            <Pagination page={page} totalPages={results.meta.totalPages || 1} onChange={goPage} />
          </div>
          <aside className="space-y-4">
            <h3 className="font-semibold">Companies</h3>
            {results.companies.length === 0 ? <div className="text-muted">No companies</div> : results.companies.map(c => <CompanyCard key={c._id || c.id} company={c} />)}
          </aside>
        </div>
      )}
    </MainLayout>
  )
}
