import { useState } from 'react'
import { TEXT } from '../../constants/text'
import api from '../../api/axios'

const T = TEXT.auth.forgotPassword

function IconEmail() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function IconMailSent() {
  return (
    <svg className="w-12 h-12 text-[#2a7a53] mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
      <path d="M16 12l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
    } catch {
      // Sengaja tidak tampilkan error — backend selalu 200 OK
      // untuk mencegah account enumeration attack
    } finally {
      setLoading(false)
      // Selalu tampilkan success state apapun hasilnya
      setSubmitted(true)
    }
  }

  // State setelah submit — tampilkan pesan sukses
  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 w-full max-w-md mx-auto text-center">
        <IconMailSent />
        <h2 className="text-xl font-bold text-gray-800 mb-3">Check Your Email</h2>
        <p className="text-gray-500 text-sm leading-relaxed">{T.successNote}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{T.heading}</h1>
        <p className="text-gray-500 text-sm">{T.subheading}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.emailLabel}</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 pointer-events-none"><IconEmail /></span>
            <input
              type="email"
              placeholder={T.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a7a53]/30 focus:border-[#2a7a53] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2a7a53] hover:bg-[#235f40] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors mt-1"
        >
          {loading ? T.submittingBtn : T.submitBtn}
        </button>
      </form>
    </div>
  )
}
