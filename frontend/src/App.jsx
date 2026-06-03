import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useEffect } from 'react'
import PrivateRoute from './components/PrivateRoute'

// Public pages
import LandingPage from './pages/LandingPage'
import HowItWorks from './pages/HowItWorks'
import AboutUs from './pages/AboutUs'
import TermsOfService from './pages/TermsOfService'
import EncyclopediaPublic from './pages/EncyclopediaPublic'
import EncyclopediaPublicDetail from './pages/EncyclopediaPublicDetail'

// Auth pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Protected pages
import Dashboard from './pages/Dashboard'
import ScanPage from './pages/ScanPage'
import ScanResult from './pages/ScanResult'
import ScanHistory from './pages/ScanHistory'
import EncyclopediaUser from './pages/EncyclopediaUser'
import EncyclopediaUserDetail from './pages/EncyclopediaUserDetail'
import UserProfile from './pages/UserProfile'
import AppLayout from './components/layout/AppLayout'
import { PreferencesProvider, usePreferences } from './context/PreferencesContext'

// Component untuk mengelola tema (dark/light) secara global
function ThemeManager({ children }) {
  const { preferences } = usePreferences()

  useEffect(() => {
    const root = window.document.documentElement

    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => root.classList.toggle('dark', e.matches)
      
      root.classList.toggle('dark', mediaQuery.matches) // Atur tema awal
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      root.classList.toggle('dark', preferences.theme === 'dark')
    }
  }, [preferences.theme])

  return children
}

// PublicOnlyRoute — redirect ke /dashboard kalau sudah login
function PublicOnlyRoute({ children }) {
  const { user, isLoadingAuth } = useAuth()

  if (isLoadingAuth) return null // Tunggu verifikasi token selesai
  if (user) return <Navigate to="/dashboard" replace /> // sudah login → langsung ke dashboard

  return children
}

// AppRoutes dipisah dari App supaya bisa akses useAuth()
function AppRoutes() {
  return(
    <Routes>
      {/* ── Public routes ── */}
      <Route 
        path="/"
        element={
          <PublicOnlyRoute>
            <LandingPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/encyclopedia" element={<EncyclopediaPublic />} />
      <Route path="/encyclopedia/:slug" element={<EncyclopediaPublicDetail />} />

      {/* ── Auth routes (hanya bisa diakses kalau belum login) ── */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        }
      />

      {/* /reset-password?token=xxx — token dibaca via useSearchParams di dalam page */}
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* ── Protected routes ── */}
      <Route element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/scan/result/:id" element={<ScanResult />} />
        <Route path="/history" element={<ScanHistory />} />
        <Route path="/history/:id" element={<ScanResult />} />
        <Route path="/encyclopedia-app" element={<EncyclopediaUser />} />
        <Route path="/encyclopedia-app/:slug" element={<EncyclopediaUserDetail />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* ── Fallback — semua route tidak dikenal ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
          <ThemeManager>
            <AppRoutes />
          </ThemeManager>
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}