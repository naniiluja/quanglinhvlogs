import { BlurFade } from '@/components/ui/blur-fade'
import { WEDDING, type Person } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'

function PersonCard({ person, delay }: { person: Person; delay: number }) {
  return (
    <BlurFade inView delay={delay} className="text-center">
      <div className="mx-auto w-fit rounded-full border border-bronze/60 p-1.5">
        <img
          src={person.photo.src}
          width={person.photo.width}
          height={person.photo.height}
          alt={`Ảnh ${person.role.toLowerCase()} ${person.name}`}
          loading="lazy"
          className="size-40 rounded-full object-cover"
        />
      </div>
      <p className="mt-4 font-serif text-sm tracking-[0.3em] text-sage-deep uppercase">
        {person.role}
      </p>
      <p className="font-script text-5xl text-mauve">{person.name}</p>
      <p className="mx-auto mt-3 max-w-80 leading-relaxed text-ink">{person.bio}</p>
    </BlurFade>
  )
}

export function Couple() {
  return (
    <section aria-labelledby="couple-title" className="px-4 py-16">
      <SectionHeading id="couple-title" eyebrow="Đôi uyên ương" title="Chú rể và cô dâu" />
      <div className="mt-10 space-y-12">
        <PersonCard person={WEDDING.groom} delay={0} />
        <PersonCard person={WEDDING.bride} delay={0.1} />
      </div>
    </section>
  )
}
