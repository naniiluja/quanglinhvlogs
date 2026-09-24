// Định dạng ngày giờ theo giờ Việt Nam, bất kể múi giờ của máy khách.
const TIME_ZONE = 'Asia/Ho_Chi_Minh'

function part(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('vi-VN', { timeZone: TIME_ZONE, ...options }).format(date)
}

export interface DateParts {
  weekday: string
  day: string
  month: string
  year: string
  time: string
}

export function toDateParts(iso: string): DateParts {
  const date = new Date(iso)
  return {
    weekday: part(date, { weekday: 'long' }),
    day: part(date, { day: '2-digit' }),
    month: part(date, { month: '2-digit' }),
    year: part(date, { year: 'numeric' }),
    time: part(date, { hour: '2-digit', minute: '2-digit', hour12: false }),
  }
}
