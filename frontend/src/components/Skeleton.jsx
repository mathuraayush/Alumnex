import React from 'react'

export default function Skeleton({ className = 'h-4 w-full' }) {
  return <div className={`bg-gray-100 animate-pulse rounded ${className}`} />
}
