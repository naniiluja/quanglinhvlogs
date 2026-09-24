import { Reveal } from '@/components/effects/Reveal'
import { WEDDING, type Person } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

function PersonCard({ person, delay }: { person: Person; delay: number }) {
  return (
    <Reveal inView delay={delay} className="text-center">
      <div className="mx-auto w-fit rounded-full border border-bronze/60 p-1.5">
        <img
          src={person.photo.src}
          width={person.photo.width}
          height={person.photo.height}
          alt={`Ảnh ${person.role.toLowerCase()} ${person.name}`}
          loading="lazy"
          className="size-40 rounded-full object-cover lg:size-56"
        />
      </div>
      <p className="mt-4 font-serif text-sm tracking-[0.3em] text-sage-deep uppercase">
        {person.role}
      </p>
      <p className="font-script text-5xl text-mauve">{person.name}</p>
      <p className="mx-auto mt-3 max-w-80 leading-relaxed text-ink">{person.bio}</p>
    </Reveal>
  )
}

export function Couple() {
  return (
    <section aria-labelledby="couple-title" className="section-screen">
      <SectionHeading id="couple-title" eyebrow="Đôi uyên ương" title="Chú rể và cô dâu" />
      <div className="mt-10 space-y-12 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
        <PersonCard person={WEDDING.groom} delay={0} />
        <PersonCard person={WEDDING.bride} delay={0.1} />
      </div>
      <NextSectionButton />
    </section>
  )
}
