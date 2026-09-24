import { BlurFade } from '@/components/ui/blur-fade'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'

export function Family() {
  const [groomSide, brideSide] = WEDDING.families
  return (
    <section aria-labelledby="family-title" className="px-4 py-16">
      <SectionHeading id="family-title" eyebrow="Hai họ" title="Thông tin lễ cưới" />

      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        {WEDDING.families.map((family, index) => (
          <BlurFade key={family.side} inView delay={index * 0.15}>
            <p className="font-serif text-lg font-semibold text-bronze-deep uppercase">
              {family.side}
            </p>
            <p className="mt-2 text-ink">{family.father}</p>
            <p className="text-ink">{family.mother}</p>
            <p className="mt-2 text-sm text-sage-deep">{family.address}</p>
          </BlurFade>
        ))}
      </div>

      <BlurFade inView delay={0.3} className="mt-10 text-center">
        <p className="font-serif text-sm tracking-[0.25em] text-sage-deep uppercase">
          Trân trọng báo tin lễ thành hôn của con chúng tôi
        </p>
        <p className="mt-4 font-script text-5xl text-mauve">{WEDDING.groom.name}</p>
        <p className="text-sm tracking-[0.2em] text-sage-deep uppercase">{groomSide.childLabel}</p>
        <p className="my-2 font-serif text-3xl font-semibold text-bronze-deep italic">&amp;</p>
        <p className="font-script text-5xl text-mauve">{WEDDING.bride.name}</p>
        <p className="text-sm tracking-[0.2em] text-sage-deep uppercase">{brideSide.childLabel}</p>
      </BlurFade>
    </section>
  )
}
