import { Reveal } from '@/components/effects/Reveal'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

export function InvitationMessage() {
  return (
    <section aria-labelledby="invitation-title" className="section-screen">
      <SectionHeading id="invitation-title" eyebrow="Lời ngỏ" title="Thư mời" />
      <div className="mx-auto mt-8 max-w-2xl space-y-4 text-center">
        {WEDDING.invitationLines.map((line, index) => (
          <Reveal key={line} inView delay={index * 0.15}>
            <p className="font-serif text-xl leading-relaxed text-ink italic md:text-2xl">{line}</p>
          </Reveal>
        ))}
      </div>
      <NextSectionButton />
    </section>
  )
}
