import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TEXT } from '../../constants/text'
import { LogoBrand } from '../Logo'

export default function NavbarPublic() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { public: nav } = TEXT.navbar

  const navLinks = [
    { label: nav.home, to: '/' },
    { label: nav.encyclopedia, to: '/encyclopedia' },
    { label: nav.howItWorks, to: '/how-it-works' },
    { label: nav.about, to: '/about' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="group transition-transform hover:scale-[1.02]">
          <LogoBrand iconSize="w-9 h-9" textSize="text-xl" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-500">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`hover:text-[#2a7a53] transition-colors ${location.pathname === to ? 'text-[#2a7a53] font-semibold' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/register" className="text-[15px] font-medium text-gray-600 hover:text-[#2a7a53] transition-colors px-3 py-1.5">
            {nav.signUp}
          </Link>
          <Link to="/login" className="text-[15px] font-medium text-white bg-[#2a7a53] hover:bg-[#235f40] transition-colors px-5 py-2 rounded-full">
            {nav.signIn}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to} className="text-gray-600 hover:text-[#2a7a53] font-medium" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <hr className="border-gray-100" />
          <Link to="/register" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>{nav.signUp}</Link>
          <Link to="/login" className="text-white bg-[#2a7a53] text-center py-2 rounded-full font-medium" onClick={() => setMenuOpen(false)}>{nav.signIn}</Link>
        </div>
      )}
    </nav>
  )
}
