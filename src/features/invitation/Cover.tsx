import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Reveal } from '@/components/effects/Reveal'
import { Button } from '@/components/ui/button'
import { WEDDING } from '@/config/wedding'

interface CoverProps {
  // null: thiệp chung (không có mã hoặc mã sai, hiển thị y hệt nhau).
  guestName: string | null
  loading: boolean
  onOpen: () => void
}

export function Cover({ guestName, loading, onOpen }: CoverProps) {
  // Parallax nhẹ cho ảnh bìa (design-system.md); tắt khi người dùng bật giảm chuyển động.
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const photoY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : -40])

  return (
    // Máy tính: ảnh bên trái, chữ bên phải; điện thoại: một cột.
    <section
      aria-label="Bìa thiệp"
      className="flex min-h-svh snap-start flex-col items-center justify-center px-4 py-12 text-center lg:grid lg:grid-cols-2 lg:content-center lg:gap-x-16"
    >
      <Reveal delay={0.1} className="lg:col-start-2">
        <p className="font-serif text-sm tracking-[0.35em] text-sage-deep uppercase">
          Trân trọng kính mời
        </p>
      </Reveal>

      <div
        className="mt-3 flex min-h-12 items-center justify-center lg:col-start-2"
        aria-live="polite"
      >
        {loading ? (
          <span className="h-7 w-44 animate-pulse rounded-full bg-muted" aria-label="Đang tải" />
        ) : (
          <Reveal delay={0.2}>
            <p className="font-serif text-3xl font-semibold text-ink">{guestName ?? 'Quý khách'}</p>
          </Reveal>
        )}
      </div>

      {/* Ảnh bìa là phần tử LCP: không bọc hiệu ứng mờ dần để trình duyệt vẽ ngay khi ảnh tải xong. */}
      <motion.div
        style={{ y: photoY }}
        className="mt-8 rounded-t-full border border-bronze/60 p-2 lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:justify-self-end"
      >
        <img
          src="/images/cover-couple.jpg"
          width={548}
          height={685}
          alt={`${WEDDING.groom.name} và ${WEDDING.bride.name} cùng bó hoa hồng`}
          className="aspect-4/5 w-64 rounded-t-full object-cover sm:w-72 lg:w-96"
          fetchPriority="high"
        />
      </motion.div>

      <Reveal delay={0.55} className="lg:col-start-2">
        <div aria-hidden="true" className="mt-8 font-script leading-tight text-mauve">
          <p className="text-5xl">{WEDDING.groom.name}</p>
          <p className="my-1 font-serif text-4xl font-semibold text-bronze-deep italic">&amp;</p>
          <p className="text-5xl">{WEDDING.bride.name}</p>
        </div>
      </Reveal>

      <Reveal delay={0.75} className="lg:col-start-2">
        <Button onClick={onOpen} size="lg" className="mt-10 h-12 rounded-full px-8 text-base">
          Mở thiệp
          <ChevronDown aria-hidden="true" className="motion-safe:animate-bounce" />
        </Button>
      </Reveal>
    </section>
  )
}
