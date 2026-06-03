import { Link } from 'react-router-dom'
import { TEXT } from '../constants/text'

export default function CtaSection() {
  const { cta } = TEXT.landing

  return (
    <section className="py-18 px-6 bg-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{cta.heading}</h2>
        <p className="text-gray-500 mb-8">{cta.desc}</p>
        <Link
          to="/register"
          className="inline-block bg-[#2a7a53] hover:bg-[#235f40] text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          {cta.btn}
        </Link>
        <p className="text-gray-400 text-sm mt-4">{cta.note}</p>
      </div>
    </section>
  )
}
