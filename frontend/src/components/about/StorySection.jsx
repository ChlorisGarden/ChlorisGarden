import { TEXT } from '../../constants/text'
import mainActivity from '../../assets/mainActivity.png'

const { about: T } = TEXT

export default function StorySection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{T.story.heading}</h2>
          <div className="flex flex-col gap-4 text-justify">
            {T.story.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-700">{p}</p>
            ))}
          </div>
        </div>
        <img src={mainActivity} alt="Foto Kegiatan Utama" className="rounded-2xl h-full aspect-[3.85/4] flex items-center justify-center text-gray-400 text-sm object-contain"/>

      </div>
    </section>
  )
}