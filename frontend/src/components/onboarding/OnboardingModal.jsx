import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoIcon } from '../Logo'
import { TEXT } from '../../constants/text'
import { completeOnboarding } from '../../utils/onboarding'

const { onboarding: { steps } } = TEXT

function StepIcon({ type }) {
  const base = 'w-[120px] h-[120px] rounded-2xl flex items-center justify-center mx-auto mb-6'

  if (type === 'logo') {
    return (
      <div className={base}>
        <LogoIcon className="" />
      </div>
    )
  }

  if (type === 'photo') {
    return (
      <div className={base}>
        <svg xmlns="http://www.w3.org/2000/svg" width="" height="" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scan-line-icon lucide-scan-line"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></svg>
      </div>
    )
  }

  if (type === 'ai') {
    return (
      <div className={base}>
        <svg xmlns="http://www.w3.org/2000/svg" width="" height="" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-astroid-icon lucide-astroid"><path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203"/></svg>
      </div>
    )
  }

  if (type === 'result') {
    return (
      <div className={base}>
        <svg xmlns="http://www.w3.org/2000/svg" width="" height="" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-check-icon lucide-search-check"><path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
    )
  }

  return null
}

function DotIndicators({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current ? 'w-3 h-3 bg-gray-600' : 'w-3 h-3 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default function OnboardingModal({ onFinish  }) {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  const finish = () => {
    if (onFinish) {
      onFinish()
    } else {
      completeOnboarding() 
      navigate('/dashboard', { replace: true })
    }
  }

  const handleNext = () => {
    if (isLast) {
      finish()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handlePrev = () => setCurrentStep((s) => s - 1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-10 py-10 relative">
        <button
          onClick={finish}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close onboarding"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <StepIcon type={step.icon} />

        <h2 className="text-xl font-bold text-gray-800 text-center mb-3">{step.title}</h2>
        <p className="text-gray-500 text-sm text-center leading-relaxed whitespace-pre-line mb-6">
          {step.desc}
        </p>

        <button
          onClick={handleNext}
          className="w-full bg-[#2a7a53] hover:bg-[#235f40] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {step.nextBtn}
        </button>

        <div className="mt-3 text-center h-6">
          {currentStep === 0 && (
            <button
              onClick={finish}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {step.skipBtn}
            </button>
          )}
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {step.prevBtn}
            </button>
          )}
        </div>

        <DotIndicators current={currentStep} total={steps.length} />
      </div>
    </div>
  )
}
