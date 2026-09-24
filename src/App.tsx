import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { MotionConfig } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { InvitationPage } from '@/routes/InvitationPage'

const queryClient = new QueryClient()

// Trang quản trị tải riêng: khách mở thiệp không phải tải code admin.
const AdminPage = lazy(() => import('@/routes/AdminPage').then((m) => ({ default: m.AdminPage })))

// reducedMotion="user": mọi hiệu ứng Motion (kể cả component bên thứ ba) tự giảm khi người dùng bật giảm chuyển động.
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InvitationPage />} />
            <Route
              path="/admin"
              element={
                <Suspense fallback={null}>
                  <AdminPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster theme="light" position="top-center" />
      </MotionConfig>
    </QueryClientProvider>
  )
}
