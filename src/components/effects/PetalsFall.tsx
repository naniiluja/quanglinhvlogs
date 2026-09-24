import { useReducedMotion } from 'motion/react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import { loadBasic } from '@tsparticles/basic'
import { loadImageShape } from '@tsparticles/shape-image'
import { loadRotateUpdater } from '@tsparticles/updater-rotate'
import { loadTiltUpdater } from '@tsparticles/updater-tilt'
import { loadWobbleUpdater } from '@tsparticles/updater-wobble'

// Hàm init phải cố định suốt vòng đời app (yêu cầu của ParticlesProvider), nên đặt ở cấp module.
async function initPetalsEngine(engine: Engine): Promise<void> {
  await loadBasic(engine)
  await loadImageShape(engine)
  await loadRotateUpdater(engine)
  await loadTiltUpdater(engine)
  await loadWobbleUpdater(engine)
}

// Theo mẫu hiệu năng trong tài liệu tsParticles (guides/react): canvas DPR 3 của iPhone lớn gấp
// 9 lần điểm ảnh nên bỏ retina khi DPR > 2; màn nhỏ bớt số cánh.
const IS_SMALL_SCREEN = window.matchMedia('(max-width: 767px)').matches

// Tối đa 18 cánh cùng lúc, 10 cánh trên điện thoại (design-system.md).
// Ảnh: Fluent Emoji, MIT, xem public/images/petals/LICENSE.txt.
const PETALS_OPTIONS: ISourceOptions = {
  fullScreen: { enable: true, zIndex: 15 },
  // Không giới hạn bằng đúng tần số màn hình: bộ giới hạn bỏ nhầm khung đến sớm vài phần mười ms,
  // cánh hoa khựng. 120 để trình duyệt tự vẽ theo màn thật (60Hz, 120Hz ProMotion); tốc độ rơi
  // tính theo thời gian nên không đổi. Chủ dự án góp ý 2026-09-24: hoa rơi khựng.
  fpsLimit: 120,
  detectRetina: window.devicePixelRatio <= 2,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  background: { opacity: 0 },
  particles: {
    number: { value: IS_SMALL_SCREEN ? 10 : 18, density: { enable: false } },
    shape: {
      type: 'image',
      options: {
        image: { src: '/images/petals/cherry-blossom.png', width: 96, height: 96 },
      },
    },
    size: { value: { min: 7, max: 16 } },
    opacity: { value: { min: 0.55, max: 0.95 } },
    move: {
      enable: true,
      direction: 'bottom',
      // Chậm, bồng bềnh (chủ dự án góp ý 2026-09-24: bay quá nhanh).
      speed: { min: 0.2, max: 0.55 },
      // Không dùng `drift`: tsParticles cộng nó vào vận tốc ngang mỗi khung hình (không giới hạn),
      // hoa nhanh dần theo thời gian. Rơi hơi xiên bằng `angle`, chọn một lần cho mỗi cánh.
      angle: { value: 30, offset: 0 },
      straight: false,
      outModes: { default: 'out' },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: 'random',
      animation: { enable: true, speed: { min: 0.5, max: 2 } },
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 360 },
      direction: 'random',
      animation: { enable: true, speed: { min: 1, max: 4 } },
    },
    wobble: { enable: true, distance: 10, speed: { min: -2, max: 2 } },
  },
}

export function PetalsFall() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <ParticlesProvider init={initPetalsEngine}>
      <Particles id="petals" options={PETALS_OPTIONS} className="pointer-events-none" />
    </ParticlesProvider>
  )
}
