import type { MouseEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'

// Nút lướt sang section kế, nằm ở đáy mỗi section (section-screen có position: relative).
// Mũi tên nảy bằng `animate-bounce` có sẵn của Tailwind, chỉ chạy khi không bật giảm chuyển động.
export function NextSectionButton() {
  const reduceMotion = useReducedMotion()

  function goNext(event: MouseEvent<HTMLButtonElement>) {
    const current = event.currentTarget.closest('section')
    if (!current) return
    const sections = [...document.querySelectorAll('main section')]
    sections[sections.indexOf(current) + 1]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={goNext}
      aria-label="Sang phần tiếp theo"
      className="absolute inset-x-0 bottom-3 mx-auto size-11 rounded-full text-bronze-deep hover:bg-cream/70"
    >
      <ChevronDown aria-hidden="true" className="size-6 motion-safe:animate-bounce" />
    </Button>
  )
}
