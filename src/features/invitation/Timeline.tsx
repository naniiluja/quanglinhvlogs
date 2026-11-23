import { Reveal } from '@/components/effects/Reveal'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { formatShortDate, toDateParts } from '@/lib/datetime'
import { eventsFor, type GuestSide } from '@/lib/sides'

// Lịch trình suy ra từ giờ lễ và giờ tiệc của từng bên, không khai báo lặp trong config.
export function Timeline({ side }: { side: GuestSide }) {
  const items = eventsFor(side).flatMap((event) => [
    { at: event.ceremony.startsAt, title: event.ceremony.title, place: event.venue.name },
    { at: event.party.startsAt, title: event.party.title, place: event.venue.name },
  ])
  const showDate = side === 'both'

  return (
    <section aria-labelledby="timeline-title" className="section-screen">
      <SectionHeading id="timeline-title" eyebrow="Lịch trình" title="Lịch trình ngày cưới" />
      <ol className="relative mx-auto mt-6 max-w-72 border-l border-bronze/50">
        {items.map((item, index) => (
          <li key={item.at} className="relative mb-6 ml-6 last:mb-0 short:mb-4">
            <Reveal inView delay={index * 0.1}>
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full border-2 border-bronze bg-cream"
              />
              <p className="font-serif text-2xl font-semibold text-bronze-deep">
                {toDateParts(item.at).time}
                {showDate && (
                  <span className="ml-2 text-base font-medium text-sage-deep">
                    {formatShortDate(item.at)}
                  </span>
                )}
              </p>
              <p className="text-ink">{item.title}</p>
              <p className="text-sm text-sage-deep">{item.place}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <NextSectionButton />
    </section>
  )
}
