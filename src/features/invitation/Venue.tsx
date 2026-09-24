import { MapPin, Navigation } from 'lucide-react'
import { Reveal } from '@/components/effects/Reveal'
import { buttonVariants } from '@/components/ui/button'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { buildMapsUrl } from '@/lib/maps'
import { cn } from '@/lib/utils'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

export function Venue() {
  return (
    <section aria-labelledby="venue-title" className="section-screen">
      <SectionHeading
        id="venue-title"
        eyebrow="Địa điểm"
        title="Địa điểm tổ chức"
        description="Bấm vào địa điểm để mở chỉ đường trên Google Maps."
      />

      <div className="mt-8 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {WEDDING.venues.map((venue, index) => {
          const mapsUrl = buildMapsUrl(venue.name, venue.address)
          return (
            <Reveal key={venue.title} inView delay={index * 0.15}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl border border-border bg-cream/70 px-6 py-6 text-center transition-colors hover:border-bronze focus-visible:border-bronze"
              >
                <p className="font-serif text-xl font-semibold text-bronze-deep uppercase">
                  {venue.title}
                </p>
                <p className="mt-2 font-serif text-2xl font-medium text-ink">{venue.name}</p>
                <p className="mt-2 flex items-start justify-center gap-1.5 text-ink">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-bronze-deep" />
                  {venue.address}
                </p>
                <p className="mt-2 text-sm text-sage-deep">Thời gian: {venue.timeRange}</p>
                <p className="text-sm text-sage-deep">{venue.note}</p>
                <span
                  aria-hidden="true"
                  className={cn(buttonVariants(), 'mt-4 h-11 rounded-full px-6')}
                >
                  <Navigation />
                  Chỉ đường
                </span>
              </a>
            </Reveal>
          )
        })}
      </div>
      <NextSectionButton />
    </section>
  )
}
