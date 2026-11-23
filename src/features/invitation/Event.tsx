import { Reveal } from '@/components/effects/Reveal'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { toDateParts } from '@/lib/datetime'
import { eventsFor, type GuestSide } from '@/lib/sides'

export function Event({ side }: { side: GuestSide }) {
  return (
    <section aria-labelledby="event-title" className="section-screen">
      <SectionHeading id="event-title" eyebrow="Hôn lễ" title="Trân trọng kính mời" />

      <div className="mt-6 space-y-4 short:mt-4 short:space-y-3 md:flex md:justify-center md:gap-6 md:space-y-0 md:*:flex-1 md:*:max-w-md">
        {eventsFor(side).map((event, index) => {
          const date = toDateParts(event.ceremony.startsAt)
          return (
            <Reveal
              key={event.side}
              inView
              delay={index * 0.15}
              className="rounded-2xl border border-border bg-cream/70 px-6 py-4 text-center short:py-3"
            >
              <p className="font-serif text-xl font-semibold text-bronze-deep uppercase">
                {event.ceremony.title}
              </p>
              <p className="font-serif text-3xl font-semibold text-ink">{date.time}</p>
              <div className="mt-1 flex items-center justify-center gap-4 font-serif text-ink">
                <span className="w-24 border-y border-bronze/50 py-1 text-sm uppercase">
                  {date.weekday}
                </span>
                <span className="text-4xl font-semibold text-mauve">{date.day}</span>
                <span className="w-24 border-y border-bronze/50 py-1 text-sm uppercase">
                  Tháng {date.month}
                </span>
              </div>
              <p className="font-serif text-xl font-medium text-ink">{date.year}</p>
              <p className="text-sm text-sage-deep italic">({event.ceremony.lunarNote})</p>
              <p className="mt-1 text-xs tracking-[0.15em] text-sage-deep uppercase">
                Hôn lễ cử hành tại {event.venue.name.toLowerCase()}
              </p>
            </Reveal>
          )
        })}
      </div>
      <NextSectionButton />
    </section>
  )
}
