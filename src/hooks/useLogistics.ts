import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppError } from '@/lib/errors'
import type { LogisticsKind } from '@/lib/logistics'
import { getLogistics, submitLogistics, type LogisticsRegistration } from '@/services/logistics'
import {
  deleteLogisticsItem,
  listLogisticsItems,
  listRegistrations,
  saveLogisticsItem,
} from '@/services/logisticsAdmin'

const logisticsKey = (code: string) => ['logistics', code] as const
const ITEMS_KEY = ['admin', 'logistics', 'items'] as const
const REGISTRATIONS_KEY = ['admin', 'logistics', 'registrations'] as const

// Chỉ thử lại lỗi mạng (error-handling.md).
export function useLogistics(code: string) {
  return useQuery({
    queryKey: logisticsKey(code),
    queryFn: () => getLogistics(code),
    retry: (failureCount, error) =>
      error instanceof AppError && error.code === 'NETWORK' && failureCount < 2,
  })
}

export function useSubmitLogistics(code: string, kind: LogisticsKind) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (registration: LogisticsRegistration) => submitLogistics(code, kind, registration),
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: logisticsKey(code) }),
  })
}

export function useLogisticsItems() {
  return useQuery({ queryKey: ITEMS_KEY, queryFn: listLogisticsItems })
}

export function useLogisticsItemMutations() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: ITEMS_KEY })
  return {
    save: useMutation({ mutationFn: saveLogisticsItem, retry: false, onSuccess: refresh }),
    remove: useMutation({ mutationFn: deleteLogisticsItem, retry: false, onSuccess: refresh }),
  }
}

export function useRegistrations() {
  return useQuery({ queryKey: REGISTRATIONS_KEY, queryFn: listRegistrations })
}
