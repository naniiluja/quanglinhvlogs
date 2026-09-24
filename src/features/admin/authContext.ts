import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export interface AuthState {
  session: Session | null
  sessionLoading: boolean
  isAdmin: boolean
  adminLoading: boolean
}

export const AuthContext = createContext<AuthState | null>(null)
