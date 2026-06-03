const ONBOARDING_KEY = 'hasOnboarded'

export const hasCompletedOnboarding = () => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true'
}

export const completeOnboarding = () => {
  localStorage.setItem(ONBOARDING_KEY, 'true')
}

export const resetOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY)
}