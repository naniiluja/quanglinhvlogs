import { useEffect, useState } from 'react'
import { vi } from 'react-day-picker/locale'
import { Reveal } from '@/components/effects/Reveal'
import { Calendar } from '@/components/ui/calendar'
import { SlidingNumber } from '@/components/ui/sliding-number'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { getCountdown } from '@/lib/countdown'
import { toDateParts } from '@/lib/datetime'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { eventsFor, type GuestSide } from '@/lib/sides'

// Ngày lễ theo giờ Việt Nam, dựng lại thành Date cục bộ để lịch khoanh đúng ô.
function toLocalDay(iso: string): Date {
  const parts = toDateParts(iso)
  return new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day))
}

const UNITS = [
  { key: 'days', label: 'Ngày' },
  { key: 'hours', label: 'Giờ' },
  { key: 'minutes', label: 'Phút' },
  { key: 'seconds', label: 'Giây' },
] as const

export function Countdown({ side }: { side: GuestSide }) {
  const events = eventsFor(side)
  // Đếm tới buổi lễ sớm nhất khách được mời.
  const target = new Date(events[0].ceremony.startsAt)
  const days = events.map((event) => toLocalDay(event.ceremony.startsAt))
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    // Dọn interval khi unmount (task 004).
    return () => window.clearInterval(timer)
  }, [])

  const left = getCountdown(target, now)

  return (
    <section aria-labelledby="countdown-title" className="section-screen">
      <SectionHeading id="countdown-title" eyebrow="Đếm ngược" title="Ngày chung vui" />

      <Reveal inView className="mt-5">
        {left.done ? (
          <p className="text-center font-serif text-2xl text-ink italic">
            Cảm ơn bạn đã cùng hai đứa mình đi qua ngày trọng đại.
          </p>
        ) : (
          <div
            className="mx-auto grid max-w-xl grid-cols-4 gap-2 md:gap-4"
            role="timer"
            aria-label="Thời gian còn lại tới lễ cưới"
          >
            {UNITS.map((unit) => (
              <div
                key={unit.key}
                className="rounded-xl border border-border bg-cream/70 py-2 text-center"
              >
                <div className="flex justify-center py-1 font-sans text-3xl font-semibold text-mauve tabular-nums">
                  <SlidingNumber value={left[unit.key]} padStart />
                </div>
                <p className="mt-1 text-xs tracking-widest text-sage-deep uppercase">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </Reveal>

      <Reveal inView delay={0.15} className="mt-5 flex justify-center">
        {/* react-day-picker giữ lựa chọn đầu tiên trong state nội bộ; side đổi từ 'both' (lúc đang
            tải lời mời) sang một bên thì phải dựng lại lịch. */}
        <Calendar
          key={side}
          mode="multiple"
          selected={days}
          defaultMonth={days[0]}
          disableNavigation
          hideNavigation
          locale={vi}
          weekStartsOn={1}
          className="rounded-2xl border border-border bg-cream/70 [--cell-size:--spacing(9)] short:[--cell-size:--spacing(7)] md:[--cell-size:--spacing(11)]"
        />
      </Reveal>
      <NextSectionButton />
    </section>
  )
}
