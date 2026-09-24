import { useEffect, useState } from 'react'
import { vi } from 'react-day-picker/locale'
import { Reveal } from '@/components/effects/Reveal'
import { Calendar } from '@/components/ui/calendar'
import { SlidingNumber } from '@/components/ui/sliding-number'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { getCountdown } from '@/lib/countdown'
import { toDateParts } from '@/lib/datetime'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

const TARGET = new Date(WEDDING.countdownTarget)
const parts = toDateParts(WEDDING.countdownTarget)
// Ngày cưới theo giờ Việt Nam, dựng lại thành Date cục bộ để lịch khoanh đúng ô.
const WEDDING_DAY = new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day))

const UNITS = [
  { key: 'days', label: 'Ngày' },
  { key: 'hours', label: 'Giờ' },
  { key: 'minutes', label: 'Phút' },
  { key: 'seconds', label: 'Giây' },
] as const

export function Countdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    // Dọn interval khi unmount (task 004).
    return () => window.clearInterval(timer)
  }, [])

  const left = getCountdown(TARGET, now)

  return (
    <section aria-labelledby="countdown-title" className="section-screen">
      <SectionHeading id="countdown-title" eyebrow="Đếm ngược" title="Ngày chung vui" />

      <Reveal inView className="mt-8">
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
                className="rounded-xl border border-border bg-cream/70 py-3 text-center"
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

      <Reveal inView delay={0.15} className="mt-8 flex justify-center">
        <Calendar
          mode="single"
          selected={WEDDING_DAY}
          defaultMonth={WEDDING_DAY}
          disableNavigation
          hideNavigation
          locale={vi}
          weekStartsOn={1}
          className="rounded-2xl border border-border bg-cream/70 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
        />
      </Reveal>
      <NextSectionButton />
    </section>
  )
}
