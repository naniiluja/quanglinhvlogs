import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Client duy nhất của ứng dụng; chỉ src/services/ được import file này (architecture.md).
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error('Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY (xem .env.example).')
}

export const supabase = createClient<Database>(url, publishableKey)
