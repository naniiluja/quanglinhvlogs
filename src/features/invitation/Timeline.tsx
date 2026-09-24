import { BlurFade } from '@/components/ui/blur-fade'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'

export function Timeline() {
  return (
    <section aria-labelledby="timeline-title" className="px-4 py-16">
      <SectionHeading id="timeline-title" eyebrow="Lịch trình" title="Lịch trình ngày cưới" />
      <ol className="relative mx-auto mt-8 max-w-72 border-l border-bronze/50">
        {WEDDING.timeline.map((item, index) => (
          <li key={item.time} className="relative mb-8 ml-6 last:mb-0">
            <BlurFade inView delay={index * 0.1}>
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full border-2 border-bronze bg-cream"
              />
              <p className="font-serif text-2xl font-semibold text-bronze-deep">{item.time}</p>
              <p className="text-ink">{item.title}</p>
            </BlurFade>
          </li>
        ))}
      </ol>
    </section>
  )
}
