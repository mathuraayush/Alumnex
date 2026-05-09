import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import api from '../services/api'
import ThreadCard from '../components/ThreadCard'
import Skeleton from '../components/Skeleton'

export default function CompanyDetail(){
  const { slug } = useParams()
  const [company, setCompany] = useState(null)
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getCompanyBySlug(slug).then(res => {
      if (!mounted) return
      setCompany(res.data.company || res.data)
      // try to fetch threads for company
      api.getThreads({ company: slug, perPage: 10 }).then(r => { if (mounted) setThreads(r.data.threads || r.data) })
    }).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [slug])

  return (
    <MainLayout>
      {loading ? <Skeleton className="h-8" /> : (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{company?.name}</h1>
          <p className="text-muted">{company?.description}</p>
          <div className="space-y-2">
            {threads.length === 0 ? <div className="text-sm text-muted">No threads</div> : threads.map(t => <ThreadCard key={t._id || t.id} thread={t} />)}
          </div>
        </div>
      )}
    </MainLayout>
  )
}
