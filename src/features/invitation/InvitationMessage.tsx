import { BlurFade } from '@/components/ui/blur-fade'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'

export function InvitationMessage() {
  return (
    <section aria-labelledby="invitation-title" className="px-4 py-16">
      <SectionHeading id="invitation-title" eyebrow="Lời ngỏ" title="Thư mời" />
      <div className="mt-8 space-y-4 text-center">
        {WEDDING.invitationLines.map((line, index) => (
          <BlurFade key={line} inView delay={index * 0.15}>
            <p className="font-serif text-xl leading-relaxed text-ink italic">{line}</p>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}
