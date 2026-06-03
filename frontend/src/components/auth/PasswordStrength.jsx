// Komponen 4 kriteria password

import { checkPasswordRules } from './passwordUtils'
import { TEXT } from '../../constants/text'

const rules = TEXT.auth.register.passwordRules

function IconCheck({ passed }) {
  return passed ? (
    // Ceklis lingkaran hijau
    <svg className="w-4 h-4 text-[#2a7a53] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    // Lingkaran abu kosong
    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export default function PasswordStrength({ password }) {
  const checks = checkPasswordRules(password)

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {rules.map((rule) => (
        <div key={rule.key} className="flex items-center gap-2">
          <IconCheck passed={checks[rule.key]} />
          <span className={`text-xs transition-colors ${checks[rule.key] ? 'text-[#2a7a53]' : 'text-gray-400'}`}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  )
}
