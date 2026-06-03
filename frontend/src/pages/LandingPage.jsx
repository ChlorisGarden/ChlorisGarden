import NavbarPublic from '../components/navbar/NavbarPublic'
import Footer from '../components/Footer'
import HeroSection from '../components/landing/HeroSection'
import DifferentSection from '../components/landing/DifferentSection'
import StepsSection from '../components/landing/StepsSection'
import CtaSection from '../components/CtaSection'

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-800">
      <NavbarPublic />
      <HeroSection />
      <DifferentSection />
      <StepsSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
