import { BlurFade } from '@/components/ui/blur-fade'
import { NoiseTexture } from '@/components/ui/noise-texture'
import { PetalsFall } from '@/components/effects/PetalsFall'
import { WEDDING } from '@/config/wedding'

// Trang giữ chỗ của task 001: chứng minh theme, font, lớp chồng và hoa rơi chạy thật.
export function InvitationPage() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <NoiseTexture className="fixed z-(--layer-background) opacity-15" />
      <PetalsFall />

      <main className="relative z-(--layer-content) mx-auto flex min-h-svh max-w-120 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="sr-only">
          Thiệp cưới {WEDDING.groom.name} và {WEDDING.bride.name}
        </h1>

        <BlurFade delay={0.1}>
          <p className="font-serif text-sm tracking-[0.35em] text-sage-deep uppercase">
            Lễ thành hôn
          </p>
        </BlurFade>

        <BlurFade delay={0.3}>
          <p
            aria-hidden="true"
            className="mt-6 font-script text-6xl leading-tight text-mauve sm:text-7xl"
          >
            {WEDDING.groom.name}
          </p>
        </BlurFade>

        <BlurFade delay={0.5}>
          <p
            aria-hidden="true"
            className="my-2 font-serif text-5xl font-semibold text-bronze italic"
          >
            &amp;
          </p>
        </BlurFade>

        <BlurFade delay={0.7}>
          <p
            aria-hidden="true"
            className="font-script text-6xl leading-tight text-mauve sm:text-7xl"
          >
            {WEDDING.bride.name}
          </p>
        </BlurFade>

        <BlurFade delay={0.9}>
          <div className="mx-auto my-8 h-px w-24 bg-bronze/60" />
          <p className="font-serif text-2xl font-medium text-ink">Thiệp cưới đang được chuẩn bị</p>
          <p className="mt-3 text-base text-sage-deep">
            Hẹn gặp bạn trong ngày vui của hai đứa mình nhé.
          </p>
        </BlurFade>
      </main>
    </div>
  )
}
