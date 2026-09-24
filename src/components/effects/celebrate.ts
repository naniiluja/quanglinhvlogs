import confetti from 'canvas-confetti'

// Pháo hoa anh đào khi khách xác nhận tham dự, dùng canvas-confetti (tech-stack.md: không tự chế).
const blossom = confetti.shapeFromText({ text: '🌸', scalar: 2 })

export function celebrate(): void {
  void confetti({
    particleCount: 60,
    spread: 75,
    startVelocity: 35,
    origin: { y: 0.7 },
    shapes: [blossom],
    scalar: 2,
    zIndex: 50,
    // Tự tắt khi người dùng bật giảm chuyển động.
    disableForReducedMotion: true,
  })
}
