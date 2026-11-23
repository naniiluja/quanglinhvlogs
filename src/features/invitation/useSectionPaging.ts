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

// Trang cần cuộn tới theo hướng; null khi để trình duyệt cuộn thường (trang dài còn nội dung theo
// hướng đó) hoặc đã ở trang đầu/cuối.
// Trang hiện tại là trang chứa mép trên màn hình. Không chọn "trang có mép trên gần đỉnh nhất": sau
// một lần cuộn thường trang bị lệch, trang nằm thấp có đáy thò khỏi màn hình bị tưởng là trang dài,
// mọi cú vuốt sau đó đều thành cuộn thường (chủ dự án báo 2026-11-23).
function nextPage(down: boolean): HTMLElement | null {
  const all = pages()
  const index = all.findIndex((page) => page.getBoundingClientRect().bottom > EDGE)
  if (index < 0) return null
  const rect = all[index].getBoundingClientRect()
  const tall = rect.height > window.innerHeight + EDGE
  if (down) {
    if (tall && rect.bottom > window.innerHeight + EDGE) return null
    return all[index + 1] ?? null
  }
  // Vuốt lên khi trang đang lệch: căn lại đầu trang này; trang dài thì cuộn thường.
  if (rect.top < -EDGE) return tall ? null : all[index]
  return all[index - 1] ?? null
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
