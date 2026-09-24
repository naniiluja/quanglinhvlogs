import { Reveal } from '@/components/effects/Reveal'
import { WEDDING, type Person } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { cn } from '@/lib/utils'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

function PersonCard({
  person,
  delay,
  reverse,
}: {
  person: Person
  delay: number
  reverse?: boolean
}) {
  return (
    // Điện thoại: thẻ ngang (ảnh một bên, chữ một bên) để hai người vừa một màn; từ md: cột dọc.
    <Reveal
      inView
      delay={delay}
      className={cn(
        'flex items-center gap-4 text-left md:flex-col md:text-center',
        reverse && 'flex-row-reverse text-right md:flex-col',
      )}
    >
      <div className="w-fit shrink-0 rounded-full border border-bronze/60 p-1.5 md:mx-auto">
        <img
          src={person.photo.src}
          width={person.photo.width}
          height={person.photo.height}
          alt={`Ảnh ${person.role.toLowerCase()} ${person.name}`}
          loading="lazy"
          className="size-24 rounded-full object-cover short:size-20 max-[389px]:size-20 md:size-40 lg:size-48"
        />
      </div>
      <div className="min-w-0">
        <p className="font-serif text-sm tracking-[0.3em] text-sage-deep uppercase md:mt-4">
          {person.role}
        </p>
        <p className="font-script text-5xl leading-tight whitespace-nowrap text-mauve">
          {person.name}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink short:leading-snug max-[389px]:leading-snug md:mx-auto md:mt-3 md:max-w-80 md:text-base">
          {person.bio}
        </p>
      </div>
    </Reveal>
  )
}

export function Couple() {
  return (
    <section aria-labelledby="couple-title" className="section-screen">
      <SectionHeading id="couple-title" eyebrow="Đôi uyên ương" title="Chú rể và cô dâu" />
      <div className="mt-6 space-y-6 short:mt-4 short:space-y-4 md:mt-10 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
        <PersonCard person={WEDDING.groom} delay={0} />
        <PersonCard person={WEDDING.bride} delay={0.1} reverse />
      </div>
      <NextSectionButton />
    </section>
  )
}
