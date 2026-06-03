import { TEXT } from '../../constants/text'

const { howItWorks: T } = TEXT

export default function StepsGridSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {T.steps.map((step) => (
          <div
            key={step.num}
            className="bg-white rounded-2xl border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 text-sm font-semibold flex-shrink-0">
                {step.num}
              </div>
              <h2 className="font-bold text-gray-800 text-lg">{step.title}</h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}