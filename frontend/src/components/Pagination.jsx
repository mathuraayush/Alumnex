import React from 'react'

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange = () => {} }) {
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i == 1 || i == totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 border border-gray-300 rounded-md disable:opacity-50 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum, idx) => (
          pageNum === '...' ? (
            <span key={idx} className="px-2">...</span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                pageNum === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700"
        aria-label="Next page"
      >
        Next →
      </button>

      <span className="text-sm text-gray-600 ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  )
}
