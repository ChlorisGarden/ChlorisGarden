import NavbarAuth from '../components/navbar/NavbarAuth'
import { TEXT } from '../constants/text'

const { terms: T } = TEXT

function BackgroundBlobs() {
  return (
    <>
      <div
        className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-tr-[60%] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #4ade80 0%, #34d399 100%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[35%] h-[35%] rounded-tl-[60%] pointer-events-none"
        style={{ background: 'linear-gradient(225deg, #d9f99d 0%, #a3e635 100%)' }}
      />
    </>
  )
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden flex flex-col">
      <NavbarAuth mode="both" />

      <div className="flex-1 flex items-center justify-center px-4 py-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-10 py-10 w-full max-w-2xl">
          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">{T.heading}</h1>
          <p className="text-gray-400 text-sm text-center mb-8">{T.effectiveDate}</p>

          {/* Sections */}
          <ol className="flex flex-col gap-6 list-decimal list-inside">
            {T.sections.map((section, i) => (
              <li key={i} className="text-gray-700">
                <span className="font-semibold">{section.title}</span>

                {section.type === 'paragraph' && (
                  <p className="text-gray-500 text-sm leading-relaxed mt-1 ml-4">
                    {section.content}
                  </p>
                )}

                {section.type === 'list' && (
                  <ul className="mt-1 ml-4 flex flex-col gap-1">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-500 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <BackgroundBlobs />
    </div>
  )
}