import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NavbarPublic from '../components/navbar/NavbarPublic'
import Footer from '../components/Footer'
import CtaSection from '../components/CtaSection'
import AboutHeroSection from '../components/about/HeroSection'
import StorySection from '../components/about/StorySection'
import TeamSection from '../components/about/TeamSection'

export default function AboutUs() {
  const location = useLocation()

  // Scroll ke section #team jika navigasi dari footer "Capstone Team"
  useEffect(() => {
    if (location.hash === '#team') {
      const el = document.getElementById('team')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    <div className="font-sans text-gray-800">
      <NavbarPublic />
      <AboutHeroSection />
      <StorySection />
      <TeamSection />
      <CtaSection />
      <Footer />
    </div>
  )
}