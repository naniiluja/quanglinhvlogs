import { maskCode, traced } from '@/lib/log'
import { publicDb } from '@/lib/supabase'
import { toAppError } from '@/services/supabaseError'

export interface RsvpAnswer {
  attending: boolean
  partySize: number
  message: string | null
}

export interface Invitation {
  displayName: string
  rsvp: RsvpAnswer | null
  guestbookCount: number
}

interface RsvpRow {
  attending: boolean
  party_size: number
  message: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isRsvpRow(value: unknown): value is RsvpRow {
  return (
    isRecord(value) &&
    typeof value.attending === 'boolean' &&
    typeof value.party_size === 'number' &&
    (value.message === null || typeof value.message === 'string')
  )
}

// Ép phản hồi RPC về kiểu ứng dụng ngay tại biên (state-management.md).
export function toRsvpAnswer(value: unknown): RsvpAnswer {
  if (!isRsvpRow(value)) throw toAppError({ message: 'unexpected_shape' })
  return { attending: value.attending, partySize: value.party_size, message: value.message }
}

export function getInvitation(code: string): Promise<Invitation> {
  return traced(
    'invitation.get',
    async () => {
      const { data, error } = await publicDb.rpc('get_invitation', { p_code: code })
      if (error) throw toAppError(error)
      if (
        !isRecord(data) ||
        typeof data.display_name !== 'string' ||
        typeof data.guestbook_count !== 'number'
      ) {
        throw toAppError({ message: 'unexpected_shape' })
      }
      return {
        displayName: data.display_name,
        rsvp: data.rsvp === null ? null : toRsvpAnswer(data.rsvp),
        guestbookCount: data.guestbook_count,
      }
    },
    { code: maskCode(code) },
  )
}
