import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { LazyLightbox } from '@/components/effects/LazyLightbox'
import { preloadLightbox } from '@/components/effects/lightboxLoader'
import { WEDDING } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

// Nhãn điều khiển của lightbox bằng tiếng Việt (product.md: chữ hiển thị toàn tiếng Việt).
const LIGHTBOX_LABELS = {
  Previous: 'Ảnh trước',
  Next: 'Ảnh sau',
  Close: 'Đóng',
  Lightbox: 'Xem ảnh',
  Carousel: 'Album ảnh',
  Slide: 'Ảnh',
  'Photo gallery': 'Album ảnh',
  '{index} of {total}': '{index} trên {total}',
}

// Tường ảnh nằm dưới màn hình đầu: tải riêng khi album sắp hiện (tech-stack.md, danh sách tải lười).
const DriftWall = lazy(() => import('@/components/ui/drift-wall/DriftWall'))

// Điện thoại: ô nhỏ hơn, ít cột, trôi chậm và nông hơn cho nhẹ máy.
const IS_SMALL_SCREEN = window.matchMedia('(max-width: 767px)').matches
const WALL = IS_SMALL_SCREEN
  ? { columns: 4, tileWidth: 110, tileHeight: 146, gap: 10, depth: 60, speed: 18 }
  : { columns: 5, tileWidth: 170, tileHeight: 226, gap: 16, depth: 120, speed: 26 }

const WALL_ITEMS = WEDDING.gallery.map((photo) => ({
  image: photo.thumb ?? photo.src,
  title: photo.alt,
}))

// DriftWall chia ảnh vào cột theo `i % columns` (cột trống lấy ảnh đầu) và đặt id ô là
// `<cột>-<bản sao>-<vị trí trong cột>`: suy ngược ra ảnh nào để mở lightbox.
function tileToPhotoIndex(tileId: string): number {
  const [column, , position] = tileId.split('-').map(Number)
  const photoIndex = column + position * WALL.columns
  return photoIndex < WALL_ITEMS.length ? photoIndex : 0
}

// Ngón tay hoặc chuột xê dịch quá ngưỡng này là vuốt, không phải chạm mở ảnh.
const TAP_SLOP_PX = 10

const SLIDES = WEDDING.gallery.map((photo) => ({
  src: photo.src,
  width: photo.width,
  height: photo.height,
  alt: photo.alt,
}))

export function Gallery() {
  const [index, setIndex] = useState(-1)
  const wallRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wallRef, { margin: '120px' })
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (inView) preloadLightbox()
  }, [inView])

  // Ô ảnh đang hiển thị dưới điểm chạm (getBoundingClientRect đã tính phép xoay 3D); nhiều ô chồng
  // nhau ở mép thì lấy ô có tâm gần điểm chạm nhất.
  function openAt(x: number, y: number) {
    let best: { id: string; distance: number } | null = null
    for (const tile of wallRef.current?.querySelectorAll<HTMLElement>('[data-tile-id]') ?? []) {
      const rect = (tile.firstElementChild ?? tile).getBoundingClientRect()
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue
      const distance = Math.hypot(
        x - (rect.left + rect.right) / 2,
        y - (rect.top + rect.bottom) / 2,
      )
      if (tile.dataset.tileId && (!best || distance < best.distance))
        best = { id: tile.dataset.tileId, distance }
    }
    if (best) setIndex(tileToPhotoIndex(best.id))
  }

  // Bàn phím: ô đang được focus.
  function openFrom(target: EventTarget) {
    const tile = target instanceof Element ? target.closest('[data-tile-id]') : null
    if (tile instanceof HTMLElement && tile.dataset.tileId)
      setIndex(tileToPhotoIndex(tile.dataset.tileId))
  }

  return (
    <section aria-labelledby="gallery-title" className="section-screen">
      <SectionHeading id="gallery-title" eyebrow="Khoảnh khắc" title="Album ảnh cưới" />

      {/* Tường ảnh trôi 3D (@react-bits DriftWall). Component chạy vòng requestAnimationFrame liên tục,
          nên chỉ gắn khi album nằm trong màn hình và gỡ khi cuộn đi, để không tốn pin và không giật. */}
      <div
        ref={wallRef}
        className="album-wall mt-5 h-[min(56svh,36rem)] w-full"
        // Mở ảnh theo toạ độ ngón tay/chuột, không theo event.target: tường ảnh xoay 3D (preserve-3d)
        // và WebKit (Safari, Zalo trên iPhone) xác định phần tử bị chạm theo vị trí trước khi xoay, nên
        // target thường là khung nền chứ không phải ô ảnh. pointerup cũng không bị iOS nuốt như click.
        // Hiệu ứng nhấc ô của DriftWall là hover, chỉ dành cho chuột. Trên điện thoại ngón tay kích nó
        // theo phép dò phần tử sai của WebKit, ô bị nhấc lồi lên, cột đứng yên, có lúc ô biến mất
        // (chủ dự án báo 2026-11-23): chặn pointermove cảm ứng ở pha capture, trước khi tới DriftWall.
        onPointerMoveCapture={(event) => {
          if (event.pointerType !== 'mouse') event.stopPropagation()
        }}
        // Chạm hay bấm không cho ô nhận focus: ô đang focus giữ trạng thái nhấc và dừng cả cột tới khi
        // mất focus. Phím Tab vẫn focus được để mở ảnh bằng bàn phím.
        onMouseDown={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          pointerStart.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerUp={(event) => {
          const start = pointerStart.current
          pointerStart.current = null
          if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP_PX)
            return
          openAt(event.clientX, event.clientY)
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          openFrom(event.target)
        }}
      >
        {inView && (
          <Suspense fallback={null}>
            <DriftWall
              items={WALL_ITEMS}
              columns={WALL.columns}
              tileWidth={WALL.tileWidth}
              tileHeight={WALL.tileHeight}
              gap={WALL.gap}
              depth={WALL.depth}
              speed={WALL.speed}
              tilt={16}
              turn={-14}
              perspective={1200}
              variance={0.45}
              parallax={0.6}
              lift={48}
              fade={0.55}
              dim={0.92}
              overlayColor="var(--color-cream)"
              radius={12}
            />
          </Suspense>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-sage-deep">Bấm vào ảnh để xem lớn</p>

      <LazyLightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={SLIDES}
        labels={LIGHTBOX_LABELS}
        // Bấm ra ngoài ảnh (vùng nền tối) là đóng (chủ dự án góp ý 2026-11-23).
        controller={{ closeOnBackdropClick: true }}
        styles={{
          root: { '--yarl__portal_zindex': 60, '--yarl__color_backdrop': 'rgba(59, 58, 54, 0.92)' },
        }}
      />
      <NextSectionButton />
    </section>
  )
}
