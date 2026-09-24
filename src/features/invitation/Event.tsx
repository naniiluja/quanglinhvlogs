import { Reveal } from '@/components/effects/Reveal'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { toDateParts } from '@/lib/datetime'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

export function Event() {
  return (
    <section aria-labelledby="event-title" className="section-screen">
      <SectionHeading id="event-title" eyebrow="Hôn lễ" title="Trân trọng kính mời" />

      <div className="mt-8 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {WEDDING.ceremonies.map((ceremony, index) => {
          const date = toDateParts(ceremony.startsAt)
          return (
            <Reveal
              key={ceremony.title}
              inView
              delay={index * 0.15}
              className="rounded-2xl border border-border bg-cream/70 px-6 py-6 text-center"
            >
              <p className="font-serif text-xl font-semibold text-bronze-deep uppercase">
                {ceremony.title}
              </p>
              <p className="mt-1 font-serif text-4xl font-semibold text-ink">{date.time}</p>
              <div className="mt-3 flex items-center justify-center gap-4 font-serif text-ink">
                <span className="w-24 border-y border-bronze/50 py-1 text-sm uppercase">
                  {date.weekday}
                </span>
                <span className="text-5xl font-semibold text-mauve">{date.day}</span>
                <span className="w-24 border-y border-bronze/50 py-1 text-sm uppercase">
                  Tháng {date.month}
                </span>
              </div>
              <p className="mt-2 font-serif text-2xl font-medium text-ink">{date.year}</p>
              <p className="mt-2 text-sm text-sage-deep italic">({ceremony.lunarNote})</p>
            </Reveal>
          )
        })}
      </div>
      <NextSectionButton />
    </section>
  )
}
