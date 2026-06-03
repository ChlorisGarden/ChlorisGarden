import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { hasCompletedOnboarding } from '../utils/onboarding'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoadingAuth(false)
        return
      }
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setIsLoadingAuth(false)
      }
    }
    verifySession()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    navigate(hasCompletedOnboarding() ? '/dashboard' : '/onboarding')
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    navigate('/onboarding')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoadingAuth, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)