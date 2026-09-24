// Kiểu lỗi chuẩn của ứng dụng (error-handling.md).
export type AppErrorCode =
  'INVALID_CODE' | 'INVALID_INPUT' | 'LIMIT_REACHED' | 'UNAUTHORIZED' | 'NETWORK' | 'UNKNOWN'

// Thông báo hiển thị được cho người dùng; chi tiết kỹ thuật chỉ nằm trong `cause`.
const USER_MESSAGES: Record<AppErrorCode, string> = {
  INVALID_CODE: 'Link mời không hợp lệ, vui lòng mở đúng link được gửi riêng cho bạn.',
  INVALID_INPUT: 'Thông tin chưa hợp lệ, bạn kiểm tra lại giúp mình nhé.',
  LIMIT_REACHED: 'Bạn đã gửi đủ số lượt cho phép.',
  UNAUTHORIZED: 'Bạn không có quyền thực hiện thao tác này.',
  NETWORK: 'Mất kết nối, thử lại giúp mình nhé.',
  UNKNOWN: 'Có lỗi xảy ra, bạn thử lại sau ít phút nhé.',
}

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, options?: { cause?: unknown }) {
    super(USER_MESSAGES[code], options)
    this.name = 'AppError'
    this.code = code
  }
}
