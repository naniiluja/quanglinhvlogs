// Hàm thuần chọn nội dung thiệp theo bên mời của khách (architecture.md: không phụ thuộc React).
import { WEDDING, type Person, type Side, type SideInfo } from '@/config/wedding'

// 'both': khách của cả hai họ, cũng là mặc định của link chung và mã sai.
export type GuestSide = Side | 'both'

export const GUEST_SIDES: readonly GuestSide[] = ['both', 'groom', 'bride']

export const GUEST_SIDE_LABELS: Record<GuestSide, string> = {
  both: 'Cả hai bên',
  groom: 'Nhà trai',
  bride: 'Nhà gái',
}

export function isGuestSide(value: unknown): value is GuestSide {
  return typeof value === 'string' && (GUEST_SIDES as readonly string[]).includes(value)
}

// Thiệp in của nhà gái để nhà gái và cô dâu đứng trước; còn lại nhà trai trước.
export function familiesFor(side: GuestSide): SideInfo[] {
  const { groom, bride } = WEDDING.sides
  return side === 'bride' ? [bride, groom] : [groom, bride]
}

// Cùng thứ tự với familiesFor: người của bên mời đứng trước.
export function coupleFor(side: GuestSide): Person[] {
  return familiesFor(side).map((family) => WEDDING[family.side])
}

// Các buổi lễ khách được mời, theo thứ tự thời gian.
export function eventsFor(side: GuestSide): SideInfo[] {
  if (side !== 'both') return [WEDDING.sides[side]]
  return Object.values(WEDDING.sides).sort((a, b) =>
    a.ceremony.startsAt.localeCompare(b.ceremony.startsAt),
  )
}

// Câu báo tin đúng như thiệp in của từng bên.
export function announcementFor(side: GuestSide): string {
  if (side === 'both') return 'Trân trọng báo tin lễ thành hôn của hai con chúng tôi'
  return `Trân trọng báo tin ${WEDDING.sides[side].ceremony.title.toLowerCase()} của con chúng tôi`
}
