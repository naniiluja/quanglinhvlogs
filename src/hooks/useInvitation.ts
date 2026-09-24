import { useQuery } from '@tanstack/react-query'
import { AppError } from '@/lib/errors'
import { getInvitation } from '@/services/invitation'

// Không có mã thì không gọi API; mã sai không thử lại (lỗi nghiệp vụ, error-handling.md).
export function useInvitation(code: string | null) {
  return useQuery({
    queryKey: ['invitation', code],
    queryFn: () => getInvitation(code as string),
    enabled: code !== null,
    staleTime: Infinity,
    retry: (failureCount, error) =>
      error instanceof AppError && error.code === 'NETWORK' && failureCount < 2,
  })
}
