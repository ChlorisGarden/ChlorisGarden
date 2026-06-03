import { Link } from 'react-router-dom'
import { TEXT } from '../../constants/text'
import bgImage from '../../assets/lp-bg_section1.png'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-16">
      <img
        src={bgImage}
        alt="Background sawah"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80 blur-xs"
      />
      <div className="absolute inset-0 bg-[#235f40]/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {TEXT.landing.hero.headline1}
          <br />
          <span className="text-green-300">{TEXT.landing.hero.headline2}</span>
        </h1>

        <p className="text-white/90 text-base md:text-lg font-semibold">{TEXT.landing.hero.subheadline}</p>
        <p className="text-white/80 text-sm md:text-base max-w-xl">{TEXT.landing.hero.body}</p>
        <p className="text-white/70 font-semibold italic">{TEXT.landing.hero.tagline}</p>

        <div className="flex items-center gap-3 mt-2 md:flex-wrap justify-center">
          <Link
            to="/login"
            className="flex items-center gap-2 bg-[#2a7a53] hover:bg-[#235f40] text-white font-semibold text-sm md:text-base px-6 py-2 md:py-3 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="M11 8v3l2 2" strokeLinecap="round" />
            </svg>
            {TEXT.landing.hero.btnTryNow}
          </Link>
          <Link
            to="/how-it-works"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/40 text-white font-semibold text-sm md:text-base px-6 py-2 md:py-3 rounded-full backdrop-blur-sm transition-colors"
          >
            {TEXT.landing.hero.btnHowItWorks}
          </Link>
        </div>
      </div>
    </section>
  )
}
