// Hằng số và hàm thuần cho đăng ký xe, lưu trú (architecture.md). Giới hạn khớp hàm submit_logistics.
export type LogisticsKind = 'transport' | 'lodging'

export const LOGISTICS_KINDS: readonly LogisticsKind[] = ['transport', 'lodging']

export const LOGISTICS_KIND_LABELS: Record<LogisticsKind, string> = {
  transport: 'Xe đưa đón',
  lodging: 'Lưu trú',
}

export const LOGISTICS_PARTY_MAX = 10
export const LOGISTICS_NOTE_MAX = 300
// Cùng biểu thức với check constraint trong DB: tùy chọn dấu +, 8 đến 20 ký tự số, cách, chấm.
export const PHONE_PATTERN = /^\+?[0-9 .]{8,20}$/

export function isLogisticsKind(value: unknown): value is LogisticsKind {
  return value === 'transport' || value === 'lodging'
}

// Link gọi điện: bỏ khoảng trắng và dấu chấm để trình quay số nhận đúng.
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s.]/g, '')}`
}
