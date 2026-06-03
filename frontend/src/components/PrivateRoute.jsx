import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
    const { user, isLoadingAuth } = useAuth()

    // Masih verifikasi token ke server — jangan render apapun dulu
    if (isLoadingAuth) return null
    if (!user) return <Navigate to="/login" replace />
    
    return children
}