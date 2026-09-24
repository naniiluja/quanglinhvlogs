import { MotionConfig } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AdminPage } from '@/routes/AdminPage'
import { InvitationPage } from '@/routes/InvitationPage'

// reducedMotion="user": mọi hiệu ứng Motion (kể cả component bên thứ ba) tự giảm khi người dùng bật giảm chuyển động.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvitationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
