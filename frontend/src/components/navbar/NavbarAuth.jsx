import { Link, useLocation } from 'react-router-dom'
import { LogoBrand } from '../Logo'

// mode="dynamic" → di /login tampil "Sign Up", di /register tampil "Sign In"
// mode="both"    → Sign Up + Sign In bersamaan (ToS page)
// mode="remembered" → "Already remembered? Sign In →" (ForgotPassword & ResetPassword)
export default function NavbarAuth({ mode = 'dynamic' }) {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo — kembali ke landing page */}
        <Link to="/">
          <LogoBrand iconSize="w-9 h-9" textSize="text-xl" />
        </Link>

        {mode === 'both' && (
          // Mode ToS — kedua tombol muncul bersamaan
          <div className="flex items-center gap-3">
            <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-[#2a7a53] transition-colors">
              Sign Up
            </Link>
            <Link to="/login" className="text-sm font-semibold text-white bg-[#2a7a53] hover:bg-[#235f40] px-5 py-2 rounded-full transition-colors">
              Sign In
            </Link>
          </div>
        )}
        
        {mode === 'remembered' && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Already remembered?</span>
            <Link to="/login" className="font-semibold text-gray-800 hover:text-[#2a7a53] transition-colors">
              Sign In →
            </Link>
          </div>
        )}

        {mode === 'dynamic' && (
          // Dinamis: di /login tampil "Sign Up", di /register tampil "Sign In" 
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
            <Link
              to={isLogin ? '/register' : '/login'}
              className="font-semibold text-gray-800 hover:text-[#2a7a53] transition-colors flex items-center gap-1"
            >
              {isLogin ? 'Sign Up →' : 'Sign In →'}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
