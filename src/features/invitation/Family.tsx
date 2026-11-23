import { Fragment } from 'react'
import { Reveal } from '@/components/effects/Reveal'
import { WEDDING } from '@/config/wedding'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { announcementFor, familiesFor, type GuestSide } from '@/lib/sides'

export function Family({ side }: { side: GuestSide }) {
  const families = familiesFor(side)
  return (
    <section aria-labelledby="family-title" className="section-screen">
      <SectionHeading id="family-title" eyebrow="Hai họ" title="Thông tin lễ cưới" />

      <div className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-2 gap-4 text-center short:mt-4 md:gap-12">
        {families.map((family, index) => (
          <Reveal key={family.side} inView delay={index * 0.15}>
            <p className="font-serif text-lg font-semibold text-bronze-deep uppercase">
              {family.hostLabel}
            </p>
            <p className="mt-2 text-ink short:mt-1">{family.father}</p>
            <p className="text-ink">{family.mother}</p>
            <p className="mt-2 text-sm text-sage-deep short:mt-1">{family.address}</p>
            <p className="text-xs text-sage-deep">({family.oldAddress})</p>
          </Reveal>
        ))}
      </div>

      <Reveal inView delay={0.3} className="mt-6 text-center short:mt-3">
        <p className="mb-2 font-serif text-sm tracking-[0.15em] text-sage-deep uppercase short:mb-1">
          {announcementFor(side)}
        </p>
        {families.map((family, index) => (
          <Fragment key={family.side}>
            {index > 0 && (
              <p className="my-1 font-serif text-3xl font-semibold text-bronze-deep italic short:my-0">
                &amp;
              </p>
            )}
            <p className="font-script text-5xl text-mauve">{WEDDING[family.side].fullName}</p>
            <p className="text-sm tracking-[0.2em] text-sage-deep uppercase">{family.childLabel}</p>
          </Fragment>
        ))}
      </Reveal>
      <NextSectionButton />
    </section>
  )
}
