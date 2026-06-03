// Reusable password input dengan toggle show/hide
import { useState } from 'react'

function IconLock() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  )
}

function IconEyeOpen() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function PasswordInput({ name, placeholder, value, onChange, className = '' }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 pointer-events-none">
        <IconLock />
      </span>
      <input
        name={name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={`w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a7a53]/30 focus:border-[#2a7a53] transition-colors ${className}`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <IconEyeOpen /> : <IconEyeOff />}
      </button>
    </div>
  )
}