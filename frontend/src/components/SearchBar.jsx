import React, { useState, useEffect } from 'react'
import useDebounce from '../hooks/useDebounce'

export default function SearchBar({ onSearch, placeholder = "Search experiences, companies, roles..." }) {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 350)

  useEffect(() => {
    onSearch(debounced)
  }, [debounced, onSearch])

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
