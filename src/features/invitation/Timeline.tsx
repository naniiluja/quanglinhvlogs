import { Reveal } from '@/components/effects/Reveal'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

export function Timeline() {
  return (
    <section aria-labelledby="timeline-title" className="section-screen">
      <SectionHeading id="timeline-title" eyebrow="Lịch trình" title="Lịch trình ngày cưới" />
      <ol className="relative mx-auto mt-8 max-w-72 border-l border-bronze/50">
        {WEDDING.timeline.map((item, index) => (
          <li key={item.time} className="relative mb-8 ml-6 last:mb-0">
            <Reveal inView delay={index * 0.1}>
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full border-2 border-bronze bg-cream"
              />
              <p className="font-serif text-2xl font-semibold text-bronze-deep">{item.time}</p>
              <p className="text-ink">{item.title}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <NextSectionButton />
    </section>
  )
}
