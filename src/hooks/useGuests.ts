import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addGuests, deleteGuest, listGuests, renameGuest } from '@/services/admin'

const GUESTS_KEY = ['admin', 'guests'] as const

export function useGuests() {
  return useQuery({ queryKey: GUESTS_KEY, queryFn: listGuests })
}

// Mutation của admin không tự thử lại; thành công thì làm mới danh sách (state-management.md).
export function useGuestMutations() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: GUESTS_KEY })
  return {
    add: useMutation({ mutationFn: addGuests, retry: false, onSuccess: refresh }),
    rename: useMutation({
      mutationFn: ({ id, displayName }: { id: string; displayName: string }) =>
        renameGuest(id, displayName),
      retry: false,
      onSuccess: refresh,
    }),
    remove: useMutation({ mutationFn: deleteGuest, retry: false, onSuccess: refresh }),
  }
}
