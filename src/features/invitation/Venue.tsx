import { MapPin, Navigation } from 'lucide-react'
import { Reveal } from '@/components/effects/Reveal'
import { buttonVariants } from '@/components/ui/button'
import type { SideInfo } from '@/config/wedding'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { formatShortDate, toDateParts } from '@/lib/datetime'
import { buildDirectionsUrl, buildEmbedUrl, buildMapsUrl } from '@/lib/maps'
import { eventsFor, type GuestSide } from '@/lib/sides'
import { cn } from '@/lib/utils'

// Mỗi địa điểm một trang để bản đồ đủ lớn mà vẫn vừa một màn (khách cả hai bên có hai trang).
function VenuePage({ event, labelled }: { event: SideInfo; labelled: boolean }) {
  const { venue } = event
  const titleId = `venue-title-${event.side}`
  return (
    <section aria-labelledby={titleId} className="section-screen">
      <SectionHeading
        id={titleId}
        eyebrow={labelled ? `Địa điểm · ${event.hostLabel}` : 'Địa điểm'}
        title={venue.name}
      />

      <Reveal inView className="mx-auto mt-4 w-full max-w-xl text-center short:mt-2">
        <p className="flex items-start justify-center gap-1.5 text-sm text-ink">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-bronze-deep" />
          {venue.fullAddress}
        </p>
        <p className="text-xs text-sage-deep">({venue.fullOldAddress})</p>
        <p className="mt-1 text-sm text-sage-deep">
          {event.party.title} lúc {toDateParts(event.party.startsAt).time} ·{' '}
          {formatShortDate(event.party.startsAt)}
        </p>

        {/* Bản đồ chỉ để xem: tắt thao tác trong iframe để cuộn trang và lăn chuột không bị bản
            đồ giữ lại; bấm vào thì mở Google Maps đầy đủ. */}
        <a
          href={buildMapsUrl(venue.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Mở bản đồ ${venue.name} trên Google Maps`}
          className="mt-3 block overflow-hidden rounded-2xl border border-bronze/60 bg-cream/70 p-1 short:mt-2"
        >
          <iframe
            src={buildEmbedUrl(venue.mapsQuery)}
            title={`Bản đồ đường đến ${venue.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
            className="pointer-events-none h-[36svh] w-full rounded-xl border-0 short:h-[30svh] md:h-[42svh]"
          />
        </a>

        <a
          href={buildDirectionsUrl(venue.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), 'mt-3 h-11 rounded-full px-6 short:mt-2')}
        >
          <Navigation aria-hidden="true" />
          Chỉ đường tới {venue.name.toLowerCase()}
        </a>
      </Reveal>
      <NextSectionButton />
    </section>
  )
}

export function Venue({ side }: { side: GuestSide }) {
  const events = eventsFor(side)
  return events.map((event) => (
    <VenuePage key={event.side} event={event} labelled={events.length > 1} />
  ))
}
