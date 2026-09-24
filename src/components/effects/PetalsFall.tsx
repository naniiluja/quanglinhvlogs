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
      speed: { min: 0.6, max: 1.6 },
      drift: { min: -0.4, max: 0.4 },
      straight: false,
      outModes: { default: 'out' },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: 'random',
      animation: { enable: true, speed: { min: 2, max: 8 } },
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 360 },
      direction: 'random',
      animation: { enable: true, speed: { min: 4, max: 12 } },
    },
    wobble: { enable: true, distance: 14, speed: { min: -6, max: 6 } },
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
