import { maskCode, traced } from '@/lib/log'
import { supabase } from '@/lib/supabase'
import { toAppError } from '@/services/supabaseError'

export const GUESTBOOK_MESSAGE_MAX = 500
export const GUESTBOOK_LIMIT_PER_GUEST = 3

export interface GuestbookEntry {
  authorName: string
  message: string
  createdAt: string
}

export interface AdminGuestbookEntry extends GuestbookEntry {
  id: string
}

export function listGuestbook(): Promise<GuestbookEntry[]> {
  return traced('guestbook.list', async () => {
    const { data, error } = await supabase.rpc('list_guestbook')
    if (error) throw toAppError(error)
    return data.map((row) => ({
      authorName: row.author_name,
      message: row.message,
      createdAt: row.created_at,
    }))
  })
}

// Không log nội dung lời chúc (logging.md).
export function addGuestbookEntry(code: string, message: string): Promise<void> {
  return traced(
    'guestbook.add',
    async () => {
      const { error } = await supabase.rpc('add_guestbook_entry', {
        p_code: code,
        p_message: message,
      })
      if (error) throw toAppError(error)
    },
    { code: maskCode(code) },
  )
}

export function listAllGuestbookEntries(): Promise<AdminGuestbookEntry[]> {
  return traced('admin.guestbook.list', async () => {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('id, message, created_at, guests(display_name)')
      .order('created_at', { ascending: false })
    if (error) throw toAppError(error)
    return data.map((row) => ({
      id: row.id,
      message: row.message,
      createdAt: row.created_at,
      authorName: row.guests?.display_name ?? '',
    }))
  })
}

export function deleteGuestbookEntry(id: string): Promise<void> {
  return traced('admin.guestbook.delete', async () => {
    const { error } = await supabase.from('guestbook_entries').delete().eq('id', id)
    if (error) throw toAppError(error)
  })
}
