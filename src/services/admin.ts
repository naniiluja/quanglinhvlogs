import type { Session } from '@supabase/supabase-js'
import { AppError } from '@/lib/errors'
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
  createdAt: string
  rsvp: GuestRsvp | null
}

// Không log email hay mật khẩu (logging.md).
export async function signIn(email: string, password: string): Promise<void> {
  await traced('admin.signin', async () => {
    const supabase = await getAdminClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
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
        'id, code, display_name, created_at, rsvps(attending, party_size, message, updated_at)',
      )
      .order('created_at', { ascending: true })
    if (error) throw toAppError(error)
    return data.map((row) => ({
      id: row.id,
      code: row.code,
      displayName: row.display_name,
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

export function addGuests(names: string[]): Promise<void> {
  return traced(
    'admin.guests.add',
    async () => {
      const supabase = await getAdminClient()
      const { error } = await supabase
        .from('guests')
        .insert(names.map((display_name) => ({ display_name })))
      if (error) throw toAppError(error)
    },
    { count: names.length },
  )
}

export function renameGuest(id: string, displayName: string): Promise<void> {
  return traced('admin.guests.rename', async () => {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('guests')
      .update({ display_name: displayName })
      .eq('id', id)
    if (error) throw toAppError(error)
  })
}

export function deleteGuest(id: string): Promise<void> {
  return traced('admin.guests.delete', async () => {
    const supabase = await getAdminClient()
    const { error } = await supabase.from('guests').delete().eq('id', id)
    if (error) throw toAppError(error)
  })
}
