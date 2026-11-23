import { isLogisticsKind, type LogisticsKind } from '@/lib/logistics'
import { traced } from '@/lib/log'
import { isGuestSide, type GuestSide } from '@/lib/sides'
import { getAdminClient } from '@/lib/supabase'
import type { LogisticsItem, LogisticsRegistration } from '@/services/logistics'
import { toAppError } from '@/services/supabaseError'

export interface AdminLogisticsItem extends LogisticsItem {
  kind: LogisticsKind
  side: GuestSide
}

export type LogisticsItemInput = Omit<AdminLogisticsItem, 'id'>

export interface AdminRegistration extends LogisticsRegistration {
  guestId: string
  guestName: string
  kind: LogisticsKind
  updatedAt: string
}

export function listLogisticsItems(): Promise<AdminLogisticsItem[]> {
  return traced('admin.logistics.items.list', async () => {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('logistics_items')
      .select('id, kind, side, starts_at, title, location, contact_name, contact_phone, note')
      .order('starts_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
    if (error) throw toAppError(error)
    // Cột có check constraint; vẫn thu hẹp kiểu tại biên.
    return data.flatMap((row) =>
      isLogisticsKind(row.kind) && isGuestSide(row.side)
        ? [
            {
              id: row.id,
              kind: row.kind,
              side: row.side,
              startsAt: row.starts_at,
              title: row.title,
              location: row.location,
              contactName: row.contact_name,
              contactPhone: row.contact_phone,
              note: row.note,
            },
          ]
        : [],
    )
  })
}

function toItemRow(item: LogisticsItemInput) {
  return {
    kind: item.kind,
    side: item.side,
    starts_at: item.startsAt,
    title: item.title,
    location: item.location,
    contact_name: item.contactName,
    contact_phone: item.contactPhone,
    note: item.note,
  }
}

// Không có id thì thêm mới, có id thì sửa.
export function saveLogisticsItem(item: LogisticsItemInput & { id?: string }): Promise<void> {
  return traced(
    'admin.logistics.items.save',
    async () => {
      const supabase = await getAdminClient()
      const { error } = item.id
        ? await supabase.from('logistics_items').update(toItemRow(item)).eq('id', item.id)
        : await supabase.from('logistics_items').insert(toItemRow(item))
      if (error) throw toAppError(error)
    },
    { kind: item.kind, isNew: !item.id },
  )
}

export function deleteLogisticsItem(id: string): Promise<void> {
  return traced('admin.logistics.items.delete', async () => {
    const supabase = await getAdminClient()
    const { error } = await supabase.from('logistics_items').delete().eq('id', id)
    if (error) throw toAppError(error)
  })
}

export function listRegistrations(): Promise<AdminRegistration[]> {
  return traced('admin.logistics.registrations.list', async () => {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('logistics_registrations')
      .select(
        'guest_id, kind, needed, party_size, phone, nights, note, updated_at, guests(display_name)',
      )
      .order('updated_at', { ascending: false })
    if (error) throw toAppError(error)
    return data.flatMap((row) =>
      isLogisticsKind(row.kind)
        ? [
            {
              guestId: row.guest_id,
              guestName: row.guests?.display_name ?? '',
              kind: row.kind,
              needed: row.needed,
              partySize: row.party_size,
              phone: row.phone,
              nights: row.nights ?? [],
              note: row.note,
              updatedAt: row.updated_at,
            },
          ]
        : [],
    )
  })
}
