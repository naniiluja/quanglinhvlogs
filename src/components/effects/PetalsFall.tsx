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

// Tối đa 18 cánh cùng lúc (design-system.md). Ảnh: Fluent Emoji, MIT, xem public/images/petals/LICENSE.txt.
const PETALS_OPTIONS: ISourceOptions = {
  fullScreen: { enable: true, zIndex: 15 },
  fpsLimit: 60,
  detectRetina: true,
  background: { opacity: 0 },
  particles: {
    number: { value: 18, density: { enable: false } },
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
      drift: { min: -0.15, max: 0.15 },
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
