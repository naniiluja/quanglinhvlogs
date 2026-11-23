import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GuestSide } from '@/lib/sides'
import { addGuests, deleteGuest, listGuests, updateGuest, type GuestPatch } from '@/services/admin'

const GUESTS_KEY = ['admin', 'guests'] as const

export function useGuests() {
  return useQuery({ queryKey: GUESTS_KEY, queryFn: listGuests })
}

// Mutation của admin không tự thử lại; thành công thì làm mới danh sách (state-management.md).
export function useGuestMutations() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: GUESTS_KEY })
  return {
    add: useMutation({
      mutationFn: ({ names, side }: { names: string[]; side: GuestSide }) => addGuests(names, side),
      retry: false,
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: GuestPatch }) => updateGuest(id, patch),
      retry: false,
      onSuccess: refresh,
    }),
    remove: useMutation({ mutationFn: deleteGuest, retry: false, onSuccess: refresh }),
  }
}
