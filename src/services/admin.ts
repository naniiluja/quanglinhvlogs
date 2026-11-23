import type { Session } from '@supabase/supabase-js'
import { AppError } from '@/lib/errors'
import { isGuestSide, type GuestSide } from '@/lib/sides'
import { traced } from '@/lib/log'
import { getAdminClient } from '@/lib/supabase'
import { toAppError } from '@/services/supabaseError'

export interface GuestRsvp {
  attending: boolean
  partySize: number
  message: string | null
  updatedAt: string
}

export interface AdminGuest {
  id: string
  code: string
  displayName: string
  side: GuestSide
  canRegisterTransport: boolean
  canRegisterLodging: boolean
  createdAt: string
  rsvp: GuestRsvp | null
}

// Các trường admin sửa được trên một khách.
export interface GuestPatch {
  displayName?: string
  side?: GuestSide
  canRegisterTransport?: boolean
  canRegisterLodging?: boolean
}

// Supabase Auth chỉ nhận email: tên đăng nhập không có '@' (ví dụ `admin`) được hiểu là
// `<tên>@quanglinh-thanhtruc.pages.dev`, địa chỉ nội bộ không nhận thư.
const USERNAME_EMAIL_DOMAIN = 'quanglinh-thanhtruc.pages.dev'

function toLoginEmail(identifier: string): string {
  const trimmed = identifier.trim()
  return trimmed.includes('@') ? trimmed : `${trimmed}@${USERNAME_EMAIL_DOMAIN}`
}

// Không log email hay mật khẩu (logging.md).
export async function signIn(identifier: string, password: string): Promise<void> {
  await traced('admin.signin', async () => {
    const supabase = await getAdminClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: toLoginEmail(identifier),
      password,
    })
    // Không nói rõ sai email hay sai mật khẩu.
    if (error) throw new AppError('UNAUTHORIZED', { cause: error })
  })
}

export async function signOut(): Promise<void> {
  await traced('admin.signout', async () => {
    const supabase = await getAdminClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw toAppError(error)
  })
}

export async function getSession(): Promise<Session | null> {
  const supabase = await getAdminClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onSessionChange(callback: (session: Session | null) => void): () => void {
  let unsubscribe: (() => void) | undefined
  let cancelled = false
  void getAdminClient().then((supabase) => {
    if (cancelled) return
    const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
    unsubscribe = () => data.subscription.unsubscribe()
  })
  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

export function checkIsAdmin(): Promise<boolean> {
  return traced('admin.check', async () => {
    const supabase = await getAdminClient()
    const { data, error } = await supabase.rpc('is_admin')
    if (error) throw toAppError(error)
    return data === true
  })
}

export function listGuests(): Promise<AdminGuest[]> {
  return traced('admin.guests.list', async () => {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('guests')
      .select(
        'id, code, display_name, side, can_register_transport, can_register_lodging, created_at, rsvps(attending, party_size, message, updated_at)',
      )
      .order('created_at', { ascending: true })
    if (error) throw toAppError(error)
    return data.map((row) => ({
      id: row.id,
      code: row.code,
      displayName: row.display_name,
      // Cột có check constraint nên luôn hợp lệ; vẫn thu hẹp kiểu tại biên.
      side: isGuestSide(row.side) ? row.side : 'both',
      canRegisterTransport: row.can_register_transport,
      canRegisterLodging: row.can_register_lodging,
      createdAt: row.created_at,
      rsvp: row.rsvps
        ? {
            attending: row.rsvps.attending,
            partySize: row.rsvps.party_size,
            message: row.rsvps.message,
            updatedAt: row.rsvps.updated_at,
          }
        : null,
    }))
  })
}

export function addGuests(names: string[], side: GuestSide): Promise<void> {
  return traced(
    'admin.guests.add',
    async () => {
      const supabase = await getAdminClient()
      const { error } = await supabase
        .from('guests')
        .insert(names.map((display_name) => ({ display_name, side })))
      if (error) throw toAppError(error)
    },
    { count: names.length, side },
  )
}

export function updateGuest(id: string, patch: GuestPatch): Promise<void> {
  return traced(
    'admin.guests.update',
    async () => {
      const supabase = await getAdminClient()
      const { error } = await supabase
        .from('guests')
        .update({
          display_name: patch.displayName,
          side: patch.side,
          can_register_transport: patch.canRegisterTransport,
          can_register_lodging: patch.canRegisterLodging,
        })
        .eq('id', id)
      if (error) throw toAppError(error)
    },
    // Chỉ log tên trường được sửa, không log giá trị.
    { fields: Object.keys(patch).join(',') },
  )
}

export function deleteGuest(id: string): Promise<void> {
  return traced('admin.guests.delete', async () => {
    const supabase = await getAdminClient()
    const { error } = await supabase.from('guests').delete().eq('id', id)
    if (error) throw toAppError(error)
  })
}
