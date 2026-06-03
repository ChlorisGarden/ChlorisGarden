import { useState, useEffect } from 'react'
import NavbarPublic from '../components/navbar/NavbarPublic'
import Footer from '../components/Footer'
import DiseaseListSection from '../components/encyclopedia/DiseaseListSection'
import api from '../api/axios'
import { TEXT } from '../constants/text'

const T = TEXT.encyclopedia

export default function EncyclopediaPublic() {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const res = await api.get('/api/diseases')
        setDiseases(res.data.data)
      } catch {
        setError('Failed to load diseases. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchDiseases()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarPublic />

      {/* Hero heading */}
      <section className="pt-28 pb-10 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">{T.heading}</h1>
        <p className="text-gray-500 text-sm">{T.subheading}</p>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#2a7a53] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-center text-red-500 text-sm py-16">{error}</p>
      )}

      {/* List */}
      {!loading && !error && (
        <DiseaseListSection diseases={diseases} basePath="/encyclopedia" />
      )}

      <Footer />
    </div>
  )
}