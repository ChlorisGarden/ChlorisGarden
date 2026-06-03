import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import NavbarPublic from '../components/navbar/NavbarPublic'
import Footer from '../components/Footer'
import api from '../api/axios'
import { TEXT } from '../constants/text'

const T = TEXT.encyclopedia

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

function InfoCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex shrink-0">{icon}</span>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function TextContent({ text }) {
  if (!text || text.length === 0) return <p className="text-gray-500">-</p>;

  if (Array.isArray(text)) {
    return (
      <ul className="flex flex-col gap-1.5">
        {text.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-500 leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const lines = text.split('\n').filter(Boolean)
  if (lines.length <= 1) {
    return <p className="text-gray-500 leading-relaxed">{text}</p>
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-500 text-sm leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
          {line.replace(/^[-•]\s*/, '')}
        </li>
      ))}
    </ul>
  )
}

export default function EncyclopediaPublicDetail() {
  const { slug } = useParams()
  const [disease, setDisease] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const res = await api.get(`/api/diseases/${slug}`)
        setDisease(res.data.data)
      } catch {
        setError('Disease not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchDisease()
  }, [slug])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarPublic />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#2a7a53] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-red-500 text-sm py-16">{error}</p>
        )}

        {!loading && !error && disease && (
          <>
            <Link
              to="/encyclopedia"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#2a7a53] transition-colors mb-6"
            >
              {T.backBtn}
            </Link>

            <h1 className="text-3xl font-bold text-[#2a7a53] mb-2">{disease.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              {disease.severity && <SeverityBadge severity={disease.severity} />}
              <span className="text-gray-400 text-sm italic">{disease.scientificName}</span>
            </div>

            {disease.imageUrl && (
              <div className="w-full h-72 rounded-2xl overflow-hidden mb-8 bg-gray-100">
                <img
                  src={disease.imageUrl || "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={disease.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InfoCard icon={<svg className="w-6 h-6 text-[#1E6436]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title={T.detailSections.overview}>
                <TextContent text={disease.description} />
              </InfoCard>

              <InfoCard icon={<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} title={T.detailSections.symptoms}>
                <TextContent text={disease.symptoms} />
              </InfoCard>

              <InfoCard icon={<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} title={T.detailSections.prevention}>
                <TextContent text={disease.preventiveMeasures} />
              </InfoCard>

              <InfoCard icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} title={T.detailSections.causes}>
                <TextContent text={disease.rootCauses} />
              </InfoCard>

              <InfoCard icon={<svg className="w-6 h-6 text-[#1E6436]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} title={T.detailSections.treatment}>
                <TextContent text={disease.treatment} />
              </InfoCard>

              <InfoCard icon={<svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>} title={T.detailSections.source}>
                <TextContent text={disease.source || T.generalSource} />
              </InfoCard>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}