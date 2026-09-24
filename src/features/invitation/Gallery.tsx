import { useState } from 'react'
import { LazyLightbox } from '@/components/effects/LazyLightbox'
import { Reveal } from '@/components/effects/Reveal'
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

const SLIDES = WEDDING.gallery.map((photo) => ({
  src: photo.src,
  width: photo.width,
  height: photo.height,
  alt: photo.alt,
}))

export function Gallery() {
  const [index, setIndex] = useState(-1)

  return (
    <section aria-labelledby="gallery-title" className="section-screen">
      <SectionHeading id="gallery-title" eyebrow="Khoảnh khắc" title="Album ảnh cưới" />

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {WEDDING.gallery.map((photo, i) => (
          <Reveal
            key={photo.src}
            inView
            delay={i * 0.1}
            className={i === 0 ? 'col-span-2 md:col-span-1' : ''}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Phóng to ảnh: ${photo.alt}`}
              className="block w-full overflow-hidden rounded-xl border border-border"
            >
              <img
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-500 hover:scale-105 ${i === 0 ? 'aspect-[4/3] md:aspect-[3/4]' : 'aspect-[3/4]'}`}
              />
            </button>
          </Reveal>
        ))}
      </div>

      <LazyLightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={SLIDES}
        labels={LIGHTBOX_LABELS}
        styles={{
          root: { '--yarl__portal_zindex': 60, '--yarl__color_backdrop': 'rgba(59, 58, 54, 0.92)' },
        }}
      />
      <NextSectionButton />
    </section>
  )
}
