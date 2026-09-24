import { lazy, Suspense } from 'react'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import type { Invitation } from '@/services/invitation'

// Form (react-hook-form + zod) chỉ tải khi có khách hợp lệ.
const Rsvp = lazy(() => import('@/features/invitation/Rsvp').then((m) => ({ default: m.Rsvp })))

interface RsvpSectionProps {
  code: string
  invitation: Invitation
}

// Chỉ render với link mời riêng hợp lệ; trang public không có section này (product.md).
export function RsvpSection({ code, invitation }: RsvpSectionProps) {
  return (
    <section aria-labelledby="rsvp-title" className="section-screen">
      <SectionHeading
        id="rsvp-title"
        eyebrow="Hồi đáp"
        title="Xác nhận tham dự"
        description="Báo giúp hai đứa trước ngày cưới để tụi mình đón tiếp chu đáo nhé."
      />

      <div className="mx-auto mt-5 w-full max-w-xl">
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
      </div>
      <NextSectionButton />
    </section>
  )
}
