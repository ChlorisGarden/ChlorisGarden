import { createContext, useContext, useState } from 'react'
import { getPreferences, setPreferences } from '../utils/preferences'

const PreferencesContext = createContext(null)

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPrefs] = useState(getPreferences)

  const updatePreferences = (newPrefs) => {
    const updated = setPreferences(newPrefs)
    setPrefs(updated)
  }

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePreferences = () => useContext(PreferencesContext)