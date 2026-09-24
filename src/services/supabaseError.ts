import { AppError, type AppErrorCode } from '@/lib/errors'

// Hàm RPC raise exception '<mã_chữ_thường>'; đổi sang AppErrorCode (error-handling.md).
const RPC_ERROR_CODES: Record<string, AppErrorCode> = {
  invalid_code: 'INVALID_CODE',
  invalid_input: 'INVALID_INPUT',
  limit_reached: 'LIMIT_REACHED',
}

interface SupabaseLikeError {
  message: string
  code?: string
}

export function toAppError(error: SupabaseLikeError): AppError {
  const mapped = RPC_ERROR_CODES[error.message]
  if (mapped) return new AppError(mapped, { cause: error })
  if (error.code === '42501' || error.code === 'PGRST301') {
    return new AppError('UNAUTHORIZED', { cause: error })
  }
  // supabase-js báo lỗi fetch bằng message chứa "Failed to fetch" / "NetworkError".
  if (/fetch|network/i.test(error.message)) return new AppError('NETWORK', { cause: error })
  return new AppError('UNKNOWN', { cause: error })
}
