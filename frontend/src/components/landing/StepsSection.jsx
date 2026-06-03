import { TEXT } from '../../constants/text'

export default function StepsSection() {
  const { steps } = TEXT.landing

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-12 items-start">
          {/* Steps list */}
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{steps.heading}</h2>
            <p className="text-[#2a7a53] font-semibold text-sm uppercase tracking-widest mb-10">
              {steps.sub}
            </p>
            <div className="flex flex-col gap-8">
              {steps.items.map((step) => (
                <div key={step.num} className="flex items-center gap-5">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#2a7a53] text-white font-bold flex items-center justify-center text-sm md:text-base">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
