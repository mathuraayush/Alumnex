import React from 'react'
import { Link } from 'react-router-dom'

export default function CompanyCard({ company }) {
  return (
    <article className="card p-4 flex gap-4 items-start">
      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xl font-bold">{company.name?.[0] || 'C'}</div>
      <div className="flex-1">
        <Link to={`/company/${company.slug}`} className="font-semibold hover:underline">{company.name}</Link>
        <div className="text-sm text-muted mt-1">{company.shortDescription || company.description || ''}</div>
      </div>
      <div className="text-sm text-muted">{company.totalThreads || 0} threads</div>
    </article>
  )
}
