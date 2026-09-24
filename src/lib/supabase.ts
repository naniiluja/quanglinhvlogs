import { PostgrestClient } from '@supabase/postgrest-js'
import type { Database } from '@/types/database'

// Chỉ src/services/ được import file này (architecture.md).
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error('Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY (xem .env.example).')
}

// Khách chỉ gọi RPC công khai: dùng PostgREST client độc lập để bìa thiệp tải nhanh
// (supabase-js luôn kèm Auth, Realtime, Storage). Thử lại do react-query lo, nên tắt retry ở đây.
export const publicDb = new PostgrestClient<Database>(`${url}/rest/v1`, {
  headers: { apikey: publishableKey },
  retry: false,
})

function loadAdminClient() {
  return import('@supabase/supabase-js').then(({ createClient }) =>
    createClient<Database>(url, publishableKey),
  )
}

let adminClient: ReturnType<typeof loadAdminClient> | undefined

// Client đầy đủ (có Auth) chỉ trang admin cần: tải lười, dùng chung một instance.
export function getAdminClient(): ReturnType<typeof loadAdminClient> {
  adminClient ??= loadAdminClient()
  return adminClient
}
