import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { TEXT } from '../../constants/text'
import PasswordInput from './PasswordInput'
import PasswordStrength from './PasswordStrength'
import { allRulesPassed } from './passwordUtils'

const T = TEXT.auth.register

function IconUser() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

export default function RegisterForm() {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validasi frontend sebelum hit API
    if (form.name.trim().length < 3) {
      setError(T.nameTooShort)
      return
    }
    if (!allRulesPassed(form.password)) {
      setError('Password does not meet all requirements.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError(T.confirmMismatch)
      return
    }

    setLoading(true)
    try {
      // TODO: saat email verification sudah siap dari backend,
      // uncomment baris di bawah dan tambahkan UI "cek email kamu"
      // sebelum navigate ke dashboard

      await register(form.name.trim(), form.email, form.password)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{T.heading}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.fullNameLabel}</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 pointer-events-none"><IconUser /></span>
            <input
              name="name"
              type="text"
              placeholder={T.fullNamePlaceholder}
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a7a53]/30 focus:border-[#2a7a53] transition-colors"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password + kriteria */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.passwordLabel}</label>
          <PasswordInput
            name="password"
            placeholder={T.passwordPlaceholder}
            value={form.password}
            onChange={handleChange}
          />
          {/* Kriteria password — muncul saat user mulai mengetik */}
          {form.password.length > 0 && (
            <PasswordStrength password={form.password} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.confirmPasswordLabel}</label>
          <PasswordInput
            name="confirmPassword"
            placeholder={T.confirmPasswordPlaceholder}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {/* Inline mismatch warning */}
          {form.confirmPassword.length > 0 && form.password !== form.confirmPassword && (
            <p className="text-xs text-red-500 mt-0.5">{T.confirmMismatch}</p>
          )}
        </div>

        {/* Error umum */}
        {error && (
          <p className="text-red-500 text-xs text-center bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2a7a53] hover:bg-[#235f40] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors mt-1"
        >
          {loading ? T.submittingBtn : T.submitBtn}
        </button>


        {/* Terms of Service */}
        <p className="text-center text-xs text-gray-500">
          {T.termsPrefix}{' '}
          <Link to="/terms" className="text-blue-500 hover:text-blue-600 transition-colors">
            {T.termsLink}
          </Link>
          .
        </p>
      </form>
    </div>
  )
}