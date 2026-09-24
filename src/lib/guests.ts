// Hàm thuần cho trang admin (architecture.md): tách danh sách tên và tính thống kê.
export const GUEST_NAME_MAX = 80
export const BULK_ADD_MAX = 100

export interface ParsedNames {
  names: string[]
  tooLong: string[]
  overLimit: boolean
}

// Mỗi dòng một tên: bỏ dòng trống, cắt khoảng trắng đầu cuối, bỏ trùng lặp.
export function parseGuestNames(input: string): ParsedNames {
  const names = [
    ...new Set(
      input
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    ),
  ]
  return {
    names,
    tooLong: names.filter((name) => name.length > GUEST_NAME_MAX),
    overLimit: names.length > BULK_ADD_MAX,
  }
}

export interface GuestStats {
  invited: number
  responded: number
  attending: number
  declined: number
  attendingPeople: number
}

interface StatsInput {
  rsvp: { attending: boolean; partySize: number } | null
}

// Tổng số người chỉ cộng party_size của khách tham dự (task 006).
export function computeStats(guests: StatsInput[]): GuestStats {
  const answered = guests.flatMap((guest) => (guest.rsvp ? [guest.rsvp] : []))
  const attending = answered.filter((rsvp) => rsvp.attending)
  return {
    invited: guests.length,
    responded: answered.length,
    attending: attending.length,
    declined: answered.length - attending.length,
    attendingPeople: attending.reduce((sum, rsvp) => sum + rsvp.partySize, 0),
  }
}

export function inviteLink(origin: string, code: string): string {
  return `${origin}/?g=${encodeURIComponent(code)}`
}
