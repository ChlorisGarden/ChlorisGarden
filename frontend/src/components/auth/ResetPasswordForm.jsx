import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { TEXT } from '../../constants/text'
import api from '../../api/axios'
import PasswordInput from './PasswordInput'
import PasswordStrength from './PasswordStrength'
import { allRulesPassed } from './passwordUtils'

const T = TEXT.auth.resetPassword

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Jika tidak ada token di URL — tampilkan error
  if (!token) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 w-full max-w-md mx-auto text-center">
        <p className="text-red-500 text-sm">{T.tokenInvalid}</p>
      </div>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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
      await api.post('/auth/reset-password', {
        token,
        newPassword: form.password,
        confirmNewPassword: form.confirmPassword,
      })
      // Reset berhasil — arahkan ke login dengan state pesan sukses
      navigate('/login', { state: { message: T.successMessage } })
    } catch (err) {
      // Token expired atau tidak valid
      setError(err.response?.data?.message || T.tokenInvalid)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{T.heading}</h1>
        <p className="text-gray-500 text-sm">{T.subheading}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Password baru + kriteria */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.passwordLabel}</label>
          <PasswordInput
            name="password"
            placeholder={T.passwordPlaceholder}
            value={form.password}
            onChange={handleChange}
          />
          {form.password.length > 0 && (
            <PasswordStrength password={form.password} />
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{T.confirmPasswordLabel}</label>
          <PasswordInput
            name="confirmPassword"
            placeholder={T.confirmPasswordPlaceholder}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {form.confirmPassword.length > 0 && form.password !== form.confirmPassword && (
            <p className="text-xs text-red-500 mt-0.5">{T.confirmMismatch}</p>
          )}
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
      </form>
    </div>
  )
}