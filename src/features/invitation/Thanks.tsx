import { BlurFade } from '@/components/ui/blur-fade'
import { WEDDING } from '@/config/wedding'

export function Thanks() {
  return (
    <section aria-labelledby="thanks-title" className="px-4 pt-16 pb-28 text-center">
      <BlurFade inView>
        <h2 id="thanks-title" className="font-script text-5xl text-mauve">
          Cảm ơn bạn
        </h2>
        <p className="mx-auto mt-4 max-w-80 font-serif text-xl leading-relaxed text-ink italic">
          Cảm ơn bạn đã ghé thăm tấm thiệp nhỏ này. Sự hiện diện và lời chúc của bạn là món quà ý
          nghĩa nhất với hai đứa mình.
        </p>
        <p className="mt-6 font-serif text-sm tracking-[0.3em] text-sage-deep uppercase">
          Thân thương
        </p>
        <p className="font-script text-4xl text-mauve">
          {WEDDING.groom.name} &amp; {WEDDING.bride.name}
        </p>
      </BlurFade>
    </section>
  )
}
