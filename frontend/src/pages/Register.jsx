import NavbarAuth from '../components/navbar/NavbarAuth'
import RegisterForm from '../components/auth/RegisterForm'

function BackgroundBlobs() {
  return (
    <>
      <div
        className="absolute bottom-0 left-0 w-[45%] h-[45%] rounded-tr-[60%] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #4ade80 0%, #34d399 100%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-tl-[60%] pointer-events-none"
        style={{ background: 'linear-gradient(225deg, #d9f99d 0%, #a3e635 100%)' }}
      />
    </>
  )
}

export default function Register() {
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden flex flex-col">
      <NavbarAuth />
      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <RegisterForm />
      </div>
      <BackgroundBlobs />
    </div>
  )
}
