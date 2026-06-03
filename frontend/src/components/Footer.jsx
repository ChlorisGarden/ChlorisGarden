import { Link } from 'react-router-dom'
import { TEXT } from '../constants/text'
import { LogoBrandLight } from './Logo'

function SocialLinks() {
  // Isi href dengan link media sosial tim — saat ini placeholder kosong
  const socials = [
    {
      label: 'Instagram',
      href: 'instagram.com/sbjibo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },

    {
      label: 'LinkedIn',
      href: 'linkedin.com/in/naherr',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },

    {
      label: 'GitHub',
      href: 'github.com/juliusbourbon',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.49 2.87 8.3 6.84 9.65.5.09.68-.22.68-.49v-1.71c-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.11-1.48-1.11-1.48-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0112 7.4c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.73 0 3.91-2.35 4.77-4.58 5.02.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.24 10.24 0 0022 12.24C22 6.58 17.52 2 12 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-3 mt-4">
      {socials.map(({ label, href, icon }) => (
        <a target="_blank" rel="noopener noreferrer" key={label} href={href} aria-label={label} className="text-gray-500 hover:text-white transition-colors">
          {icon}
        </a>
      ))}
    </div>
  )  
}

export default function Footer() {
  const { footer } = TEXT.landing

  return (
    <footer className="bg-gray-900 text-gray-400 py-14 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[3.4fr_1fr_1fr] gap-20">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LogoBrandLight iconSize="w-8 h-8" textSize="text-xl" />
          </div>
          <p className="text-sm leading-relaxed max-w-xs">{footer.brandDesc}</p>
          <SocialLinks />
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-semibold mb-4">{footer.products}</h4>
          <ul className="flex flex-col gap-2">
            {footer.productLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">{footer.company}</h4>
          <ul className="flex flex-col gap-2">
            {footer.companyLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600">
        <span>{footer.copyright}</span>
        <span className="text-center">{footer.builtFor}</span>
      </div>
    </footer>
  )
}