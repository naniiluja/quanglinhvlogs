// Hàm thuần tính thời gian còn lại tới một mốc (architecture.md: không phụ thuộc React).
export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function getCountdown(target: Date, now: Date): Countdown {
  const diff = target.getTime() - now.getTime()
  // Sau mốc cưới không bao giờ hiện số âm.
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    done: false,
  }
}
