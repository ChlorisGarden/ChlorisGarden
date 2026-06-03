import { TEXT } from '../../constants/text'
import aubg from '../../assets/au-bg_section1.png'

const { about: T } = TEXT

export default function AboutHeroSection() {
  return (
    <section className="relative min-h-screen md:min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
      <img
        src={aubg}
        alt="Background sawah"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80 blur-xs"
      />
      <div className="absolute inset-0 bg-[#235f40]/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-5 pt-20">
        <span className="text-white/80 text-xs font-semibold tracking-[0.2em] uppercase border border-white/30 px-4 py-1.5 rounded-full">
          {T.hero.badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          {T.hero.heading}
        </h1>
        <p className="text-white/85 text-base leading-relaxed max-w-2xl">
          {T.hero.body}
        </p>
      </div>
    </section>
  )
}