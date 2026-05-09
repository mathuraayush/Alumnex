import React from 'react'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className="fixed right-4 bottom-4 bg-red-600 text-white px-4 py-2 rounded shadow">{message}</div>
  )
}
