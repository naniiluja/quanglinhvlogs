import { MapPin, Navigation } from 'lucide-react'
import { Reveal } from '@/components/effects/Reveal'
import { buttonVariants } from '@/components/ui/button'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { formatShortDate, toDateParts } from '@/lib/datetime'
import { buildMapsUrl } from '@/lib/maps'
import { eventsFor, type GuestSide } from '@/lib/sides'
import { cn } from '@/lib/utils'

export function Venue({ side }: { side: GuestSide }) {
  return (
    <section aria-labelledby="venue-title" className="section-screen">
      <SectionHeading id="venue-title" eyebrow="Địa điểm" title="Địa điểm tổ chức" />

      <div className="mt-4 space-y-3 md:flex md:justify-center md:gap-6 md:space-y-0 md:*:flex-1 md:*:max-w-md">
        {eventsFor(side).map((event, index) => (
          <Reveal key={event.side} inView delay={index * 0.15}>
            <a
              href={buildMapsUrl(event.venue.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full rounded-2xl border border-border bg-cream/70 px-5 py-3 text-center transition-colors hover:border-bronze focus-visible:border-bronze"
            >
              <p className="font-serif text-xl font-semibold text-bronze-deep uppercase">
                {event.venue.name}
              </p>
              <p className="mt-1 flex items-start justify-center gap-1.5 text-sm text-ink">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-bronze-deep" />
                {event.venue.fullAddress}
              </p>
              <p className="text-xs text-sage-deep">({event.venue.fullOldAddress})</p>
              <p className="mt-1 text-sm text-sage-deep">
                {event.party.title} lúc {toDateParts(event.party.startsAt).time} ·{' '}
                {formatShortDate(event.party.startsAt)}
              </p>
              <span
                aria-hidden="true"
                className={cn(buttonVariants(), 'mt-2 h-11 rounded-full px-6 short:h-9')}
              >
                <Navigation />
                Chỉ đường
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      <NextSectionButton />
    </section>
  )
}
