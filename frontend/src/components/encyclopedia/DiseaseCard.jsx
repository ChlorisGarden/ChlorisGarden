import { Link } from 'react-router-dom'
import { TEXT } from '../../constants/text'

const T = TEXT.encyclopedia

// Badge severity — warna sesuai level
function SeverityBadge({ severity }) {
  const styles = {
    high:   'text-red-500', 
    medium: 'text-yellow-500',
    low:    'text-emerald-700',
  }

  const normalizedSeverity = severity?.toLowerCase() || ''; 
  const label = T?.severity?.[normalizedSeverity] ?? severity; 

  return (
    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${styles[normalizedSeverity] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {label}
    </span>
  )
}

// path bisa /encyclopedia/:slug (public) atau /encyclopedia-app/:slug (user)
export default function DiseaseCard({ disease, basePath = '/encyclopedia' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
      {/* Gambar penyakit */}
      <div className="md:w-50 md:shrink-0 h-40 md:h-auto bg-gray-100 overflow-hidden">
        {disease.imageUrl ? (
          <img
            src={disease.imageUrl}
            alt={disease.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No image
          </div>
        )}
      </div>
      
      {/* Konten */}
      <div className="flex-1 p-6 flex flex-col justify-between gap-3">
        <div>
          {/* Nama + badge severity */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h2 className="font-bold text-[#2a7a53] text-lg leading-tight">{disease.name}</h2>
              <p className="text-gray-400 text-xs italic mt-0.5">{disease.scientificName}</p>
            </div>
            {disease.severity && <SeverityBadge severity={disease.severity} />}
          </div>

          {/* Deskripsi singkat */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mt-2">
            {disease.description}
          </p>

        </div>

        <div className="flex items-center justify-end">
          <Link
            to={`${basePath}/${disease.slug}`}
            className="text-sm text-[#2a7a53] hover:underline font-medium"
          >
            {T.clickDetail}
          </Link>
        </div>
      </div>     
    </div>
  )
}
