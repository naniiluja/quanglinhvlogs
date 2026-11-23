import { lazy, Suspense, type ComponentProps } from 'react'
import { loadLightbox } from '@/components/effects/lightboxLoader'
import 'yet-another-react-lightbox/styles.css'

const Lightbox = lazy(loadLightbox)

export function LazyLightbox(props: ComponentProps<typeof Lightbox>) {
  if (!props.open) return null
  return (
    <Suspense fallback={null}>
      <Lightbox {...props} />
    </Suspense>
  )
}
