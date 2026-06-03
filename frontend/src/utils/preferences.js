const PREFERENCES_KEY = 'user_preferences'

const defaultPreferences = {
    language: 'en',
    theme: 'system',
    saveHistory: true,
    showConfidenceScore: true,
}

export const getPreferences = () => {
    try {
        const stored = localStorage.getItem(PREFERENCES_KEY)
        return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences
    } catch {
        return defaultPreferences
    }
}

export const setPreferences = (newPreferences) => {
    const current = getPreferences()
    const updated = { ...current, ...newPreferences }
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
    return updated
}

export const resetPreferences = () => {
    localStorage.removeItem(PREFERENCES_KEY)
    return defaultPreferences
}