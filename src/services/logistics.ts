import type { LogisticsKind } from '@/lib/logistics'
import { maskCode, traced } from '@/lib/log'
import { publicDb } from '@/lib/supabase'
import { toAppError } from '@/services/supabaseError'

export interface LogisticsRegistration {
  needed: boolean
  partySize: number
  phone: string | null
  // Ngày dạng YYYY-MM-DD; chỉ có với lưu trú.
  nights: string[]
  note: string | null
}

export interface LogisticsItem {
  id: string
  startsAt: string | null
  title: string
  location: string | null
  contactName: string | null
  contactPhone: string | null
  note: string | null
}

export interface LogisticsKindInfo {
  registration: LogisticsRegistration | null
  items: LogisticsItem[]
}

// null: khách không được tick loại đó.
export type GuestLogistics = Record<LogisticsKind, LogisticsKindInfo | null>

type Row = Record<string, unknown>

function isRow(value: unknown): value is Row {
  return typeof value === 'object' && value !== null
}

const isText = (value: unknown): value is string | null =>
  value === null || typeof value === 'string'

function unexpected(): never {
  throw toAppError({ message: 'unexpected_shape' })
}

// Ép phản hồi RPC về kiểu ứng dụng ngay tại biên (state-management.md).
function toRegistration(value: unknown): LogisticsRegistration {
  if (
    !isRow(value) ||
    typeof value.needed !== 'boolean' ||
    typeof value.party_size !== 'number' ||
    !isText(value.phone) ||
    !isText(value.note) ||
    !(value.nights === null || Array.isArray(value.nights))
  ) {
    unexpected()
  }
  return {
    needed: value.needed,
    partySize: value.party_size,
    phone: value.phone,
    nights: (value.nights ?? []).map(String),
    note: value.note,
  }
}

function toItem(value: unknown): LogisticsItem {
  if (
    !isRow(value) ||
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    !isText(value.starts_at) ||
    !isText(value.location) ||
    !isText(value.contact_name) ||
    !isText(value.contact_phone) ||
    !isText(value.note)
  ) {
    unexpected()
  }
  return {
    id: value.id,
    startsAt: value.starts_at,
    title: value.title,
    location: value.location,
    contactName: value.contact_name,
    contactPhone: value.contact_phone,
    note: value.note,
  }
}

function toKindInfo(value: unknown): LogisticsKindInfo | null {
  if (value === null) return null
  if (!isRow(value) || !Array.isArray(value.items)) unexpected()
  return {
    registration: value.registration === null ? null : toRegistration(value.registration),
    items: value.items.map(toItem),
  }
}

export function getLogistics(code: string): Promise<GuestLogistics> {
  return traced(
    'logistics.get',
    async () => {
      const { data, error } = await publicDb.rpc('get_logistics', { p_code: code })
      if (error) throw toAppError(error)
      if (!isRow(data)) unexpected()
      return { transport: toKindInfo(data.transport), lodging: toKindInfo(data.lodging) }
    },
    { code: maskCode(code) },
  )
}

// Không log số điện thoại hay ghi chú (logging.md).
export function submitLogistics(
  code: string,
  kind: LogisticsKind,
  registration: LogisticsRegistration,
): Promise<LogisticsRegistration> {
  return traced(
    'logistics.submit',
    async () => {
      const { needed } = registration
      const { data, error } = await publicDb.rpc('submit_logistics', {
        p_code: code,
        p_kind: kind,
        p_needed: needed,
        // Không cần thì luôn gửi 1, giống RSVP.
        p_party_size: needed ? registration.partySize : 1,
        p_phone: registration.phone ?? '',
        // DB chỉ giữ đêm khi là lưu trú và có cần; còn lại bỏ qua mảng này.
        p_nights: registration.nights,
        p_note: registration.note ?? '',
      })
      if (error) throw toAppError(error)
      return toRegistration(data)
    },
    { code: maskCode(code), kind, needed: registration.needed },
  )
}
