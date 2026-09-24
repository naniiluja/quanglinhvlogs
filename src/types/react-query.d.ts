import type { AppError } from '@/lib/errors'

// Mọi service chỉ ném AppError (error-handling.md), nên lỗi của query và mutation mang kiểu này.
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AppError
  }
}
