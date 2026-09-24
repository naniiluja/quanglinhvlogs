import { maskCode, traced } from '@/lib/log'
import { supabase } from '@/lib/supabase'
import { toRsvpAnswer, type RsvpAnswer } from '@/services/invitation'
import { toAppError } from '@/services/supabaseError'

// Ghi đè câu trả lời của khách. Không log nội dung lời nhắn (logging.md).
export function submitRsvp(code: string, answer: RsvpAnswer): Promise<RsvpAnswer> {
  return traced(
    'rsvp.submit',
    async () => {
      const { data, error } = await supabase.rpc('submit_rsvp', {
        p_code: code,
        p_attending: answer.attending,
        // Không tham dự thì luôn gửi 1 (product.md); thống kê chỉ cộng khi attending.
        p_party_size: answer.attending ? answer.partySize : 1,
        p_message: answer.message ?? '',
      })
      if (error) throw toAppError(error)
      return toRsvpAnswer(data)
    },
    { code: maskCode(code), attending: answer.attending },
  )
}
