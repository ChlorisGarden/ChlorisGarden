import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { TEXT } from '../../constants/text'
import PasswordInput from './PasswordInput'

const T = TEXT.auth.login

function IconEmail() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

export default function LoginForm() {
  const { login } = useAuth()
  const location = useLocation()
  const successMessage = location.state?.message || ''
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form.email, form.password)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 w-full max-w-md mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2a7a53] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {TEXT.navbar.auth.backToHome}
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{T.heading}</h1>
        <p className="text-gray-500 text-sm">{T.subheading}</p>
      </div>

      {successMessage && (
        <p className="text-[#2a7a53] text-xs text-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-2">
          {successMessage}
        </p>
      )}
    
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.emailLabel}</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 pointer-events-none"><IconEmail /></span>
            <input
              name="email"
              type="email"
              placeholder={T.emailPlaceholder}
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a7a53]/30 focus:border-[#2a7a53] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.passwordLabel}</label>
          <PasswordInput
            name="password"
            placeholder={T.passwordPlaceholder}
            value={form.password}
            onChange={handleChange}
          />
          
          <Link
            to="/forgot-password"
            className="text-xs text-blue-500 hover:text-blue-600 transition-colors self-start mt-0.5"
          >
            {T.forgotPassword}
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2a7a53] hover:bg-[#235f40] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors mt-1"
        >
          {loading ? T.submittingBtn : T.submitBtn}
        </button>

        <p className="text-center text-sm text-gray-500">
          {T.noAccount}{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
            {T.registerLink}
          </Link>
        </p>
      </form>
    </div>
  )
}
