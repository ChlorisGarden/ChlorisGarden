import { TEXT } from '../../constants/text'
import { LeafyGreen, Timer, FileChartColumn, GraduationCap }from 'lucide-react'

const CARD_ICONS = [<Timer size={48}/>, <LeafyGreen size={48} />, <FileChartColumn size={48} />]

export default function DifferentSection() {
  const { different } = TEXT.landing

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {different.heading1}{' '}
          <span className="text-[#2a7a53]">{different.brand}</span>{' '}
          {different.heading2}
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-2">{different.desc1}</p>
        <p className="text-gray-500 mb-12">{different.desc2}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {different.cards.map((card, i) => (
            <div
              key={card.title}
              className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center gap-4 text-center border border-gray-100"
            >
              <div className="p-3 rounded-xl">
                {CARD_ICONS[i]}
              </div>
              <h3 className="font-bold text-lg text-gray-800">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-3">
            <span className="text-4xl"><GraduationCap size={36} /></span>
            <h3 className="text-xl font-bold text-gray-800">{different.academic.title}</h3>
          </div>
          <p className="text-gray-600 text-sm md:text-base mb-2">{different.academic.desc1}</p>
          <p className="text-gray-500 text-sm md:text-base">{different.academic.desc2}</p>
        </div>
      </div>
    </section>
  )
}
