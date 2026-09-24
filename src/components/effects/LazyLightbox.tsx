import { lazy, Suspense, type ComponentProps } from 'react'
import 'yet-another-react-lightbox/styles.css'

// Lightbox chỉ tải khi khách bấm mở ảnh lần đầu.
const Lightbox = lazy(() => import('yet-another-react-lightbox'))

export function LazyLightbox(props: ComponentProps<typeof Lightbox>) {
  if (!props.open) return null
  return (
    <Suspense fallback={null}>
      <Lightbox {...props} />
    </Suspense>
  )
}
