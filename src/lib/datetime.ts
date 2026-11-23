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

// Ngày ngắn cho lời chúc, ví dụ 24/09/2026.
export function formatShortDate(iso: string): string {
  return part(new Date(iso), { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Giá trị cho ô `datetime-local` (YYYY-MM-DDTHH:mm) theo giờ Việt Nam.
export function toVnInputValue(iso: string): string {
  const date = new Date(iso)
  const get = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, ...options }).format(date)
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date)
  return `${get({ year: 'numeric', month: '2-digit', day: '2-digit' })}T${time}`
}

// Ngược lại: ô `datetime-local` luôn hiểu là giờ Việt Nam (+07:00, không có giờ mùa hè).
export function fromVnInputValue(value: string): string {
  return new Date(`${value}:00+07:00`).toISOString()
}

// Ngày giờ ngắn cho lịch trình, ví dụ "07:30 · 11/12".
export function formatShortDateTime(iso: string): string {
  const date = new Date(iso)
  // Ghép ngày/tháng bằng tay: vi-VN chỉ có ngày và tháng thì in "11-12".
  const time = part(date, { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${time} · ${part(date, { day: '2-digit' })}/${part(date, { month: '2-digit' })}`
}
