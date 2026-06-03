import NavbarPublic from '../components/navbar/NavbarPublic'
import Footer from '../components/Footer'
import CtaSection from '../components/CtaSection'
import StepsGridSection from '../components/howItWorks/StepsGridSection'
import { TEXT } from '../constants/text'

const { howItWorks: T } = TEXT

export default function HowItWorks() {
  return (
    <div className="font-sans text-gray-800">
        <NavbarPublic />

        {/* Hero section */}
        <section className="pt-28 pb-5 px-6 bg-gray-50 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {T.heading}
            </h1>
            <p className="text-gray-500 leading-relaxed">
              {T.subheading}
            </p>
          </div>
        </section>

        <StepsGridSection />
        <CtaSection />
        <Footer />
    </div>
  )
}
