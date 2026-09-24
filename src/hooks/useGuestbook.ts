import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addGuestbookEntry,
  deleteGuestbookEntry,
  listAllGuestbookEntries,
  listGuestbook,
} from '@/services/guestbook'

const PUBLIC_KEY = ['guestbook'] as const
const ADMIN_KEY = ['admin', 'guestbook'] as const

export function useGuestbook() {
  return useQuery({ queryKey: PUBLIC_KEY, queryFn: listGuestbook })
}

export function useAddGuestbookEntry(code: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (message: string) => addGuestbookEntry(code, message),
    retry: false,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: PUBLIC_KEY }),
        // Số lời chúc đã gửi nằm trong get_invitation.
        queryClient.invalidateQueries({ queryKey: ['invitation', code] }),
      ]),
  })
}

export function useAdminGuestbook() {
  return useQuery({ queryKey: ADMIN_KEY, queryFn: listAllGuestbookEntries })
}

export function useDeleteGuestbookEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteGuestbookEntry,
    retry: false,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_KEY }),
      ]),
  })
}
