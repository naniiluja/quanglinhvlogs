import { BlurFade } from '@/components/ui/blur-fade'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  description?: string
}

// Tiêu đề thống nhất cho mọi section của thiệp.
export function SectionHeading({ id, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <BlurFade inView className="text-center">
      <p className="font-serif text-sm tracking-[0.35em] text-sage-deep uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-serif text-3xl font-semibold text-ink">
        {title}
      </h2>
      <img
        src="/images/petals/cherry-blossom.png"
        width={24}
        height={24}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="mx-auto mt-3 opacity-80"
      />
      {description && <p className="mx-auto mt-3 max-w-80 text-sage-deep">{description}</p>}
    </BlurFade>
  )
}
