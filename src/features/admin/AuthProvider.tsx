import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '@/features/admin/authContext'
import { checkIsAdmin, getSession, onSessionChange } from '@/services/admin'

// Context duy nhất cho phiên admin (state-management.md). Quyền thật nằm ở RLS.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    void getSession().then((current) => {
      setSession(current)
      setSessionLoading(false)
    })
    return onSessionChange(setSession)
  }, [])

  const admin = useQuery({
    queryKey: ['admin', 'is-admin', session?.user.id],
    queryFn: checkIsAdmin,
    enabled: session !== null,
  })

  return (
    <AuthContext.Provider
      value={{
        session,
        sessionLoading,
        isAdmin: admin.data === true,
        adminLoading: session !== null && admin.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
