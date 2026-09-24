// Log JSON một dòng, gắn correlation ID của lượt tải trang (logging.md).
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogFields = Record<string, unknown>

// Sinh một lần mỗi lần tải trang.
export const CORRELATION_ID = crypto.randomUUID()

function write(level: LogLevel, event: string, fields: LogFields = {}): void {
  if (level === 'debug' && !import.meta.env.DEV) return

  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event: `[${event}]`,
    correlationId: CORRELATION_ID,
    ...fields,
  })

  // Đây là nơi duy nhất được gọi console.* (logging.md).
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

export const log = {
  debug: (event: string, fields?: LogFields) => write('debug', event, fields),
  info: (event: string, fields?: LogFields) => write('info', event, fields),
  warn: (event: string, fields?: LogFields) => write('warn', event, fields),
  error: (event: string, fields?: LogFields) => write('error', event, fields),
}

// Đo một lệnh gọi qua ranh giới: log .start, rồi .end hoặc .error kèm thời gian (ms).
export async function traced<T>(
  event: string,
  fn: () => Promise<T>,
  fields?: LogFields,
): Promise<T> {
  const startedAt = performance.now()
  write('info', `${event}.start`, fields)
  try {
    const result = await fn()
    write('info', `${event}.end`, { ...fields, ms: Math.round(performance.now() - startedAt) })
    return result
  } catch (error) {
    write('error', `${event}.error`, {
      ...fields,
      ms: Math.round(performance.now() - startedAt),
      ...describeError(error),
    })
    throw error
  }
}

// Log mã lỗi và nguyên nhân kỹ thuật (cause), không log câu thông báo dành cho người dùng.
function describeError(error: unknown): LogFields {
  if (!(error instanceof Error)) return { error: String(error) }
  const code = (error as { code?: unknown }).code
  const cause =
    error.cause instanceof Error || isMessage(error.cause) ? error.cause.message : undefined
  return { errorCode: code, error: cause ?? error.message }
}

function isMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { message?: unknown }).message === 'string'
  )
}

// Chỉ log 4 ký tự đầu của mã khách (logging.md).
export function maskCode(code: string): string {
  return `${code.slice(0, 4)}…`
}
