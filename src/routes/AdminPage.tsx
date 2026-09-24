import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AdminDashboard } from '@/features/admin/AdminDashboard'
import { AdminLogin } from '@/features/admin/AdminLogin'
import { AuthProvider } from '@/features/admin/AuthProvider'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/services/admin'

// Route guard chỉ là tiện ích giao diện; quyền thật nằm ở RLS (security.md).
function AdminGate() {
  const { session, sessionLoading, isAdmin, adminLoading } = useAuth()

  if (sessionLoading || adminLoading) {
    return <p className="text-center text-sage-deep">Đang tải...</p>
  }
  if (!session) return <AdminLogin />
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-ink">Tài khoản này chưa được cấp quyền quản trị.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => signOut().catch((error) => toast.error(error.message))}
        >
          Đăng xuất
        </Button>
      </div>
    )
  }
  return <AdminDashboard />
}

export function AdminPage() {
  return (
    <main className="min-h-svh px-4 py-10">
      {/* React 19 tự đưa thẻ meta lên <head>: không cho máy tìm kiếm lập chỉ mục trang quản trị. */}
      <meta name="robots" content="noindex, nofollow" />
      <title>Quản trị thiệp cưới</title>
      <AuthProvider>
        <AdminGate />
      </AuthProvider>
    </main>
  )
}
