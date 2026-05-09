import React, { useState, useEffect } from 'react'

export default function FiltersPanel({ companies = [], onFilterChange, selectedFilters = {} }) {
  const [roles, setRoles] = useState([])
  const [expanded, setExpanded] = useState({
    company: true,
    role: true,
    year: true,
    difficulty: true
  })

  // Extract unique roles from companies
  useEffect(() => {
    const uniqueRoles = new Set()
    companies.forEach(company => {
      if (company.roles && Array.isArray(company.roles)) {
        company.roles.forEach(role => uniqueRoles.add(role.title))
      }
    })
    setRoles(Array.from(uniqueRoles).sort())
  }, [companies])

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)
  const difficulties = ['easy', 'medium', 'hard']

  const handleFilterClick = (filterType, value) => {
    onFilterChange({
      [filterType]: selectedFilters[filterType] === value ? '' : value
    })
  }

  const FilterSection = ({ title, type, options }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <button
        onClick={() => setExpanded(prev => ({ ...prev, [type]: !prev[type] }))}
        className="w-full flex items-center justify-between mb-3 hover:opacity-75 transition"
      >
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="text-gray-400">{expanded[type] ? '▼' : '▶'}</span>
      </button>
      {expanded[type] && (
        <div className="space-y-2">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleFilterClick(type, option.value || option)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                selectedFilters[type] === (option.value || option)
                  ? 'bg-blue-100 text-blue-900 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {option.label || option}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <aside className="space-y-1">
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        {selectedFilters.company || selectedFilters.role || selectedFilters.year || selectedFilters.difficulty ? (
          <button
            onClick={() => onFilterChange({ company: '', role: '', year: '', difficulty: '' })}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Clear All
          </button>
        ) : null}
      </div>

      <FilterSection
        title="Company"
        type="company"
        options={companies.map(c => ({ label: c.name, value: c.slug }))}
      />

      <FilterSection
        title="Difficulty"
        type="difficulty"
        options={difficulties.map(d => ({ label: d.charAt(0).toUpperCase() + d.slice(1), value: d }))}
      />

      <FilterSection
        title="Year"
        type="year"
        options={years}
      />

      {roles.length > 0 && (
        <FilterSection
          title="Role"
          type="role"
          options={roles}
        />
      )}
    </aside>
  )
}
