import { Reveal } from '@/components/effects/Reveal'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

export function Family() {
  const [groomSide, brideSide] = WEDDING.families
  return (
    <section aria-labelledby="family-title" className="section-screen">
      <SectionHeading id="family-title" eyebrow="Hai họ" title="Thông tin lễ cưới" />

      <div className="mx-auto mt-8 grid w-full max-w-2xl grid-cols-2 gap-4 text-center md:gap-12">
        {WEDDING.families.map((family, index) => (
          <Reveal key={family.side} inView delay={index * 0.15}>
            <p className="font-serif text-lg font-semibold text-bronze-deep uppercase">
              {family.side}
            </p>
            <p className="mt-2 text-ink">{family.father}</p>
            <p className="text-ink">{family.mother}</p>
            <p className="mt-2 text-sm text-sage-deep">{family.address}</p>
          </Reveal>
        ))}
      </div>

      <Reveal inView delay={0.3} className="mt-10 text-center">
        <p className="font-serif text-sm tracking-[0.25em] text-sage-deep uppercase">
          Trân trọng báo tin lễ thành hôn của con chúng tôi
        </p>
        <p className="mt-4 font-script text-5xl text-mauve">{WEDDING.groom.name}</p>
        <p className="text-sm tracking-[0.2em] text-sage-deep uppercase">{groomSide.childLabel}</p>
        <p className="my-2 font-serif text-3xl font-semibold text-bronze-deep italic">&amp;</p>
        <p className="font-script text-5xl text-mauve">{WEDDING.bride.name}</p>
        <p className="text-sm tracking-[0.2em] text-sage-deep uppercase">{brideSide.childLabel}</p>
      </Reveal>
      <NextSectionButton />
    </section>
  )
}
