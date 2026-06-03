import { useState, useMemo } from 'react'
import DiseaseCard from './DiseaseCard'
import { TEXT } from '../../constants/text'

const T = TEXT.encyclopedia
const PAGE_SIZE = 10

export default function DiseaseListSection({ diseases = [], basePath = '/encyclopedia' }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('az')
  const [page, setPage] = useState(1)

  // Filter + sort — client-side karena data sedikit
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const result = diseases.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      d.scientificName?.toLowerCase().includes(q)
    )
    result.sort((a, b) =>
      sort === 'az'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    return result
  }, [diseases, search, sort])

  // Reset ke page 1 saat filter/sort berubah
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleSort = (val) => {
    setSort(val)
    setPage(1)
  }

  return (
    <section className="max-w-4xl mx-auto px-6 pb-20">
      {/* Search bar */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder={T.searchPlaceholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a7a53]/30 focus:border-[#2a7a53] transition-colors bg-white"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
        <span className="font-medium">{T.sortLabel}</span>
        {[{ val: 'az', label: T.sortAZ }, { val: 'za', label: T.sortZA }].map(({ val, label }) => (
          <label key={val} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="sort"
              value={val}
              checked={sort === val}
              onChange={() => handleSort(val)}
              className="accent-[#2a7a53]"
            />
            {label}
          </label>
        ))}
      </div>

      {paginated.length === 0 ? (
        <p className="text-center text-gray-400 py-16 text-sm">{T.empty}</p>
      ) : (
         <div className="flex flex-col gap-4">
          {paginated.map((disease) => (
           <DiseaseCard key={disease.slug} disease={disease} basePath={basePath} />
          ))}
         </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                page === i + 1
                  ? 'bg-[#2a7a53] text-white border-[#2a7a53]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  )
}
