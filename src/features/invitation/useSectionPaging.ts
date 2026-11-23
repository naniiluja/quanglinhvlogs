import { useEffect } from 'react'
import { useReducedMotion } from 'motion/react'

// Một nấc lăn chuột, một lần vuốt trackpad hay một cú vuốt trên điện thoại sang đúng một trang
// (chủ dự án góp ý 2026-11-23). Chỉ dùng scroll-snap thì trang trôi theo tay rồi mới hút về,
// trình duyệt trong Zalo hút không dứt khoát, khách thấy "vẫn từ từ".
const EDGE = 2
// Trackpad còn bắn sự kiện quán tính sau khi nhấc tay: chờ yên đủ lâu mới nhận lượt mới.
const QUIET_MS = 220
const MIN_LOCK_MS = 650
// Ngón tay dịch ít hơn mức này là chạm (mở ảnh, bấm nút), chưa phải vuốt.
const TOUCH_DECIDE_PX = 8
const TOUCH_SWIPE_PX = 40

function pages(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('main section')]
}

// Vùng tự xử lý cử chỉ: lightbox, hộp thoại, hay vùng con còn cuộn được theo hướng này.
function handledInside(target: EventTarget | null, down: boolean): boolean {
  let el = target instanceof Element ? target : null
  if (el?.closest('[role="dialog"], .yarl__root')) return true
  while (el && el !== document.body) {
    const { overflowY } = getComputedStyle(el)
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      const atEnd = down
        ? el.scrollTop + el.clientHeight >= el.scrollHeight - EDGE
        : el.scrollTop <= EDGE
      if (!atEnd) return true
    }
    el = el.parentElement
  }
  return false
}

// Trang kế theo hướng; null khi trang hiện tại dài hơn màn hình và chưa tới mép (cuộn thường),
// hoặc đã ở trang đầu/cuối.
function nextPage(down: boolean): HTMLElement | null {
  const all = pages()
  if (all.length === 0) return null
  // Trang hiện tại: trang có mép trên gần đỉnh màn hình nhất.
  const index = all.reduce(
    (best, page, i) =>
      Math.abs(page.getBoundingClientRect().top) < Math.abs(all[best].getBoundingClientRect().top)
        ? i
        : best,
    0,
  )
  const rect = all[index].getBoundingClientRect()
  if (down ? rect.bottom > window.innerHeight + EDGE : rect.top < -EDGE) return null
  return all[index + (down ? 1 : -1)] ?? null
}

export function useSectionPaging() {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let locked = false
    let lockedAt = 0
    let quietTimer: number | undefined
    // Cử chỉ chạm đang diễn ra: 'page' là do hook điều khiển, 'native' là để trình duyệt cuộn.
    let touch: { y: number; mode: 'pending' | 'page' | 'native' } | null = null

    function release() {
      window.clearTimeout(quietTimer)
      quietTimer = window.setTimeout(() => {
        if (MIN_LOCK_MS - (performance.now() - lockedAt) > 0) return release()
        locked = false
      }, QUIET_MS)
    }

    function goTo(page: HTMLElement) {
      locked = true
      lockedAt = performance.now()
      page.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      release()
    }

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
      if (locked) {
        event.preventDefault()
        release()
        return
      }
      const down = event.deltaY > 0
      if (handledInside(event.target, down)) return
      const next = nextPage(down)
      if (!next) return
      event.preventDefault()
      goTo(next)
    }

    function onTouchStart(event: TouchEvent) {
      touch = event.touches.length === 1 ? { y: event.touches[0].clientY, mode: 'pending' } : null
    }

    function onTouchMove(event: TouchEvent) {
      if (!touch || touch.mode === 'native') return
      const dy = touch.y - event.touches[0].clientY
      if (touch.mode === 'pending') {
        if (Math.abs(dy) < TOUCH_DECIDE_PX) return
        const down = dy > 0
        touch.mode = handledInside(event.target, down) || !nextPage(down) ? 'native' : 'page'
        if (touch.mode === 'native') return
      }
      // Giữ trang đứng yên trong lúc vuốt; thả tay mới chuyển trang.
      event.preventDefault()
    }

    function onTouchEnd(event: TouchEvent) {
      const gesture = touch
      touch = null
      if (!gesture || gesture.mode !== 'page' || locked) return
      const dy = gesture.y - event.changedTouches[0].clientY
      if (Math.abs(dy) < TOUCH_SWIPE_PX) return
      const next = nextPage(dy > 0)
      if (next) goTo(next)
    }

    const active = { passive: false } as const
    window.addEventListener('wheel', onWheel, active)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, active)
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.clearTimeout(quietTimer)
    }
  }, [reduceMotion])
}
