import { maskCode, traced } from '@/lib/log'
import { supabase } from '@/lib/supabase'
import { toAppError } from '@/services/supabaseError'

export interface Invitation {
  displayName: string
}

interface InvitationRow {
  display_name: string
}

function isInvitationRow(value: unknown): value is InvitationRow {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).display_name === 'string'
  )
}

export function getInvitation(code: string): Promise<Invitation> {
  return traced(
    'invitation.get',
    async () => {
      const { data, error } = await supabase.rpc('get_invitation', { p_code: code })
      if (error) throw toAppError(error)
      if (!isInvitationRow(data)) throw toAppError({ message: 'unexpected_shape' })
      return { displayName: data.display_name }
    },
    { code: maskCode(code) },
  )
}
