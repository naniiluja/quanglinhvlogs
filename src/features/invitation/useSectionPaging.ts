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

// Một bước trong trang cao hơn màn hình: chừa lại một dải để khách thấy nội dung nối tiếp.
const TALL_STEP = 0.85

// Vị trí cuộn (scrollY) của bước kế theo hướng; null khi đã ở đầu/cuối thiệp.
// Trang hiện tại là trang chứa mép trên màn hình (không chọn "trang có mép trên gần đỉnh nhất": trang
// bị lệch sẽ bị nhận nhầm). Trang cao hơn màn hình cũng đi từng bước, không nhường cuộn thường:
// quán tính cuộn thường kéo trôi sang trang kế, khách thấy "vẫn lướt bình thường" (chủ dự án báo
// 2026-11-23 ở Hôn lễ, trang có hai lễ cao hơn màn điện thoại).
function nextStop(down: boolean): number | null {
  const all = pages()
  const index = all.findIndex((page) => page.getBoundingClientRect().bottom > EDGE)
  if (index < 0) return null
  const viewport = window.innerHeight
  const y = window.scrollY
  const rect = all[index].getBoundingClientRect()
  const tall = rect.height > viewport + EDGE
  if (down) {
    if (tall && rect.bottom > viewport + EDGE)
      return y + Math.min(rect.bottom - viewport, viewport * TALL_STEP)
    const next = all[index + 1]
    return next ? y + next.getBoundingClientRect().top : null
  }
  // Trang đang lệch: về đầu trang này (trang cao thì lùi từng bước).
  if (rect.top < -EDGE) return y + (tall ? Math.max(rect.top, -viewport * TALL_STEP) : rect.top)
  const prev = all[index - 1]
  if (!prev) return null
  const prevRect = prev.getBoundingClientRect()
  // Lùi vào trang cao: dừng ở phần cuối của nó, như vừa đọc xong.
  return y + (prevRect.height > viewport + EDGE ? prevRect.bottom - viewport : prevRect.top)
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

    function goTo(top: number) {
      locked = true
      lockedAt = performance.now()
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
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
      const stop = nextStop(down)
      if (stop === null) return
      event.preventDefault()
      goTo(stop)
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
        touch.mode = handledInside(event.target, down) || nextStop(down) === null ? 'native' : 'page'
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
      const stop = nextStop(dy > 0)
      if (stop !== null) goTo(stop)
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
