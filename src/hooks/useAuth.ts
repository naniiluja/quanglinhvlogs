import { useContext } from 'react'
import { AuthContext, type AuthState } from '@/features/admin/authContext'

export function useAuth(): AuthState {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth phải nằm trong AuthProvider')
  return value
}
