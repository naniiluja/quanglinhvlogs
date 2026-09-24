import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RsvpAnswer } from '@/services/invitation'
import { submitRsvp } from '@/services/rsvp'

export function useSubmitRsvp(code: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (answer: RsvpAnswer) => submitRsvp(code, answer),
    // Lỗi nghiệp vụ không bao giờ thử lại (error-handling.md).
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invitation', code] }),
  })
}
