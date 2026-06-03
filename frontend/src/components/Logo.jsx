import favicon from '../assets/favicon.png';
export function LogoIcon({ className = 'w-9 h-9' }) {
  return (
    <div className={`rounded-xl flex items-center justify-center ${className}`}>
      <img src={favicon} alt="Logo" />
    </div>
  )
}

export function LogoBrand({ iconSize, textSize = 'text-xl' }) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon className={iconSize} />
      <span className={`text-[#000000] font-bold tracking-tight ${textSize}`}>
        Chloris Garden
      </span>
    </div>
  )
}

export function LogoBrandLight({ iconSize, textSize = 'text-lg' }) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon className={iconSize} />
      <span className={`text-white font-bold tracking-tight ${textSize}`}>
        Chloris Garden
      </span>
    </div>
  )
}
