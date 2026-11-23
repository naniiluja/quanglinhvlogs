import { useEffect } from 'react'
import { useReducedMotion } from 'motion/react'

// Máy tính: một nấc lăn chuột (hoặc một lần vuốt trackpad) sang đúng một trang (chủ dự án góp ý
// 2026-11-23). Chỉ dùng scroll-snap thì mỗi nấc cuộn ~100px rồi bị hút về trang cũ.
// Điện thoại không qua đây: cảm ứng đã có scroll-snap-stop: always.
const EDGE = 2
// Trackpad còn bắn sự kiện quán tính một lúc sau khi nhấc tay: chờ yên đủ lâu mới nhận lượt mới.
const QUIET_MS = 220
const MIN_LOCK_MS = 650

function pages(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('main section')]
}

// Vùng con tự cuộn được theo hướng này (danh sách lời chúc, ô nhập, hộp thoại) thì để nguyên.
function innerCanScroll(target: EventTarget | null, down: boolean): boolean {
  let el = target instanceof Element ? target : null
  while (el && el !== document.body) {
    if (el.closest('[role="dialog"]')) return true
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

export function useWheelPaging() {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    let locked = false
    let lockedAt = 0
    let quietTimer: number | undefined

    function release() {
      window.clearTimeout(quietTimer)
      quietTimer = window.setTimeout(() => {
        const wait = MIN_LOCK_MS - (performance.now() - lockedAt)
        if (wait > 0) return release()
        locked = false
      }, QUIET_MS)
    }

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
      if (locked) {
        event.preventDefault()
        release()
        return
      }
      const down = event.deltaY > 0
      if (innerCanScroll(event.target, down)) return

      const all = pages()
      // Trang hiện tại: trang có mép trên gần đỉnh màn hình nhất.
      const index = all.reduce(
        (best, page, i) =>
          Math.abs(page.getBoundingClientRect().top) <
          Math.abs(all[best].getBoundingClientRect().top)
            ? i
            : best,
        0,
      )
      const rect = all[index].getBoundingClientRect()
      // Trang dài hơn màn hình (form, danh sách): cuộn thường cho tới mép rồi mới sang trang.
      if (down ? rect.bottom > window.innerHeight + EDGE : rect.top < -EDGE) return

      const next = all[index + (down ? 1 : -1)]
      if (!next) return
      event.preventDefault()
      locked = true
      lockedAt = performance.now()
      next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      release()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.clearTimeout(quietTimer)
    }
  }, [reduceMotion])
}
