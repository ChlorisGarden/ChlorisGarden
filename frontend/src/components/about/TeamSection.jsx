import { TEXT } from '../../constants/text'

const { about: T } = TEXT

function MemberSocials({ instagram, linkedin, github }) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <a target='_blank' href={instagram} aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      </a>
      <a target='_blank' href={linkedin} aria-label="LinkedIn" className="text-gray-400 hover:text-blue-500 transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
      <a target='_blank' href={github} aria-label="GitHub" className="text-gray-400 hover:text-black transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.49 2.87 8.3 6.84 9.65.5.09.68-.22.68-.49v-1.71c-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.11-1.48-1.11-1.48-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0112 7.4c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.73 0 3.91-2.35 4.77-4.58 5.02.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.24 10.24 0 0022 12.24C22 6.58 17.52 2 12 2z" />
        </svg>
      </a>
    </div>
  )
}

export default function TeamSection() {
  return (
    <section id="team" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{T.team.heading}</h2>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">{T.team.subheading}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {T.team.members.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl overflow-hidden border border-gray-100">

              <img src={member?.photo || `https://ui-avatars.com/api/?name=${member?.name || 'User'}&background=fff&color=000&size=150`} alt="Foto Tim" className="w-full aspect-4/4 object-cover" />

              <div className="p-4">
                <p className="font-bold text-gray-800">{member.name}</p>
                <p className="text-[#2a7a53] font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed italic">"{member.bio}"</p>
                <div className="flex justify-center mt-4 w-full">
                  <MemberSocials
                    instagram={member.instagram}
                    linkedin={member.linkedin}
                    github={member.github}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}