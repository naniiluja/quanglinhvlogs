import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Reveal } from '@/components/effects/Reveal'
import { Button } from '@/components/ui/button'
import FlipCard from '@/components/ui/flip-card'
import { WEDDING } from '@/config/wedding'
import { CoverPostcard } from '@/features/invitation/CoverPostcard'

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
      className="flex min-h-svh snap-start flex-col items-center justify-center px-4 py-8 text-center short:py-5 lg:grid lg:grid-cols-2 lg:content-center lg:gap-x-16"
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
        className="mt-5 flex flex-col items-center short:mt-3 lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:justify-self-end"
      >
        {/* Tấm bưu thiếp lật được như mẫu "Notes from the roadmap" của Dia: FlipCard của React Bits
            (nghiêng theo chuột, vệt sáng, bấm hoặc kéo để lật). Kích thước đặt bằng biến CSS có
            `!important` để thắng style nội tuyến của component, co giãn theo chiều cao màn (svh). */}
        <FlipCard
          front={
            <div className="size-full rounded-t-full border border-bronze/60 p-2">
              <img
                src="/images/cover-couple.jpg"
                width={548}
                height={685}
                alt={`${WEDDING.groom.name} và ${WEDDING.bride.name} cùng bó hoa hồng`}
                className="size-full rounded-t-full object-cover"
                fetchPriority="high"
                draggable={false}
              />
            </div>
          }
          back={<CoverPostcard guestName={guestName} />}
          ariaLabel="Lật ảnh bìa để xem lời tâm sự"
          tiltMax={10}
          hoverScale={1.02}
          perspective={1800}
          background="var(--color-cream)"
          color="var(--color-ink)"
          shadowColor="var(--color-bronze-deep)"
          shadowOpacity={0.3}
          className="[--fc-h:clamp(10rem,37svh,23.5rem)]! [--fc-radius:9999px_9999px_0_0]! [--fc-w:calc(var(--fc-h)*0.8)]! short:[--fc-h:32svh]! lg:[--fc-h:clamp(17rem,62svh,35.5rem)]!"
        />
        <p className="mt-2 text-xs text-sage-deep">Bấm vào ảnh để xem lời tâm sự</p>
      </motion.div>

      <Reveal delay={0.55} className="lg:col-start-2">
        <div aria-hidden="true" className="mt-5 font-script leading-tight text-mauve short:mt-3">
          <p className="text-5xl">{WEDDING.groom.name}</p>
          <p className="font-serif text-3xl font-semibold text-bronze-deep italic">&amp;</p>
          <p className="text-5xl">{WEDDING.bride.name}</p>
        </div>
      </Reveal>

      <Reveal delay={0.75} className="lg:col-start-2">
        <Button
          onClick={onOpen}
          size="lg"
          className="mt-6 h-12 rounded-full px-8 text-base short:mt-3 short:h-11"
        >
          Mở thiệp
          <ChevronDown aria-hidden="true" className="motion-safe:animate-bounce" />
        </Button>
      </Reveal>
    </section>
  )
}
