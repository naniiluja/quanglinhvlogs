import { lazy, Suspense } from 'react'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import type { Invitation } from '@/services/invitation'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

// Form (react-hook-form + zod) chỉ tải khi có khách hợp lệ.
const Rsvp = lazy(() => import('@/features/invitation/Rsvp').then((m) => ({ default: m.Rsvp })))

interface RsvpSectionProps {
  code: string | null
  invitation: Invitation | undefined
  loading: boolean
}

// Chỉ khách có mã hợp lệ mới thấy form; mã sai và không mã hiện cùng một dòng nhắc (product.md).
export function RsvpSection({ code, invitation, loading }: RsvpSectionProps) {
  return (
    <section aria-labelledby="rsvp-title" className="section-screen">
      <SectionHeading
        id="rsvp-title"
        eyebrow="Hồi đáp"
        title="Xác nhận tham dự"
        description="Báo giúp hai đứa trước ngày cưới để tụi mình đón tiếp chu đáo nhé."
      />

      <div className="mx-auto mt-5 w-full max-w-xl">
        {loading ? (
          <div className="mx-auto h-64 animate-pulse rounded-2xl bg-muted" aria-label="Đang tải" />
        ) : code && invitation ? (
          <Suspense
            fallback={
              <div
                className="mx-auto h-64 animate-pulse rounded-2xl bg-muted"
                aria-label="Đang tải"
              />
            }
          >
            <Rsvp code={code} initial={invitation.rsvp} />
          </Suspense>
        ) : (
          <p className="rounded-2xl border border-border px-6 py-8 text-ink">
            Vui lòng mở đúng link mời được gửi riêng cho bạn để xác nhận tham dự.
          </p>
        )}
      </div>
      <NextSectionButton />
    </section>
  )
}
