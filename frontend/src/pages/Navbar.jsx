export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm font-sans z-50 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-[#2a7a53] p-1.5 rounded-md">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19V6m0 0l-3 3m3-3l3 3M6.5 12c-1.5-1.5-3-1.5-3-1.5s0 1.5 1.5 3c1.2.6 2.5.6 3.5.3M17.5 12c1.5-1.5 3-1.5 3-1.5s0 1.5-1.5 3c-1.2.6-2.5.6-3.5.3"
            />
          </svg>
        </div>
        <span className="text-[#2a7a53] font-bold text-xl tracking-tight">
          Tanam Pangan
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-500">
        <a href="#" className="hover:text-[#2a7a53] transition-colors">Dashboard</a>
        <a href="#" className="hover:text-[#2a7a53] transition-colors">Scan</a>
        <a href="#" className="hover:text-[#2a7a53] transition-colors">Scan History</a>
        <a href="#" className="hover:text-[#2a7a53] transition-colors">Disease Encyclopedia</a>
        <a href="#" className="hover:text-[#2a7a53] transition-colors">About Us</a>
      </div>

      {/* Profile */}
      <div className="flex items-center cursor-pointer">
        <img
          src=""
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
      </div>
    </nav>
  );
};