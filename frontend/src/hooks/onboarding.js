import { useRef, useState } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { hasCompletedOnboarding, completeOnboarding } from '../utils/onboarding'
import { getPreferences } from '../utils/preferences' 

export const useOnboarding = ({ setIsExpanded, setIsMobileOpen } = {}) => {
  const [showWelcome, setShowWelcome] = useState(!hasCompletedOnboarding())
  const driverRef = useRef(null)

  const startSidebarTour = () => {
    const preferences = getPreferences()
    const isId = preferences.language === 'id'

    const isMobile = window.innerWidth < 768

    if (isMobile && setIsMobileOpen) {
        setIsMobileOpen(true)
    } else if (setIsExpanded) {
        setIsExpanded(true)
    }

    const popoverSide = isMobile ? 'bottom' : 'right'
    const popoverAlign = isMobile ? 'center' : 'start'

    driverRef.current = driver({
      animate: true,
      showProgress: true,
      progressText: '{{current}} / {{total}}',
      nextBtnText: isId ? 'Lanjut →' : 'Next →',
      prevBtnText: isId ? '← Kembali' : '← Back',
      doneBtnText: isId ? 'Mulai!' : 'Start!',
      onDestroyStarted: () => {
        completeOnboarding()
        driverRef.current?.destroy()
        
        if (isMobile && setIsMobileOpen) {
            setIsMobileOpen(false)
        }
      },
      steps: [
        {
          element: '#sidebar-nav',
          popover: {
            title: isId ? 'Menu navigasi' : 'Navigation Menu',
            description: isId 
              ? 'Gunakan menu ini untuk berpindah antar halaman. Kamu juga bisa pakai shortcut keyboard yang tertera.' 
              : 'Use this menu to navigate between pages. You can also use the displayed keyboard shortcuts.',
            side: popoverSide,
            align: popoverAlign,
          },
        },
        {
          element: '#dashboard',
          popover: {
            title: 'Dashboard',
            description: isId 
              ? 'Menampilkan ringkasan informasi penting seperti jumlah klasifikasi, penyakit terbanyak, dan grafik aktivitas.'
              : 'Displays a summary of important information such as classification count, top diseases, and activity graphs.',
            side: popoverSide,
            align: popoverAlign,
          },
        },
        {
          element: '#scan',
          popover: {
            title: isId ? 'Pindai' : 'Scan',
            description: isId 
              ? 'Halaman utama untuk melakukan klasifikasi penyakit tanaman dengan mengunggah foto daun tanaman.'
              : 'The main page for plant disease classification by uploading a photo of a plant leaf.',
            side: popoverSide,
            align: popoverAlign,
          },
        },
        {
          element: '#history',
          popover: {
            title: isId ? 'Riwayat' : 'History',
            description: isId 
              ? 'Menampilkan daftar hasil klasifikasi sebelumnya beserta detailnya.'
              : 'Displays a list of previous classification results along with their details.',
            side: popoverSide,
            align: popoverAlign,
          },
        },
        {
          element: '#encyclopedia',
          popover: {
            title: isId ? 'Ensiklopedia' : 'Encyclopedia',
            description: isId 
              ? 'Kumpulan informasi tentang berbagai penyakit tanaman yang umum terjadi.'
              : 'A collection of information about various common plant diseases.',
            side: popoverSide,
            align: popoverAlign,
          },
        },
        {
          element: '#account',
          popover: {
            title: isId ? 'Akun & Pengaturan' : 'Account & Settings',
            description: isId 
              ? 'Kelola informasi akun, preferensi aplikasi, dan pengaturan lainnya.'
              : 'Manage account information, app preferences, and other settings.',
            side: popoverSide,
            align: popoverAlign,
          },
        }
      ],
    })

    setTimeout(() => driverRef.current?.drive(), 400)
  }

  const finishWelcome = () => {
    setShowWelcome(false)
    startSidebarTour()
  }

  return { showWelcome, finishWelcome }
}