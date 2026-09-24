import { Reveal } from '@/components/effects/Reveal'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  description?: string
}

// Tiêu đề thống nhất cho mọi section của thiệp.
export function SectionHeading({ id, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal inView className="text-center">
      <p className="font-serif text-sm tracking-[0.35em] text-sage-deep uppercase short:text-xs">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-1 font-serif text-3xl font-semibold text-ink md:text-4xl">
        {title}
      </h2>
      <img
        src="/images/petals/cherry-blossom.png"
        width={20}
        height={20}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="mx-auto mt-2 size-5 opacity-80 short:hidden"
      />
      {description && (
        <p className="mx-auto mt-2 max-w-80 text-sm text-sage-deep md:max-w-md md:text-base">
          {description}
        </p>
      )}
    </Reveal>
  )
}
