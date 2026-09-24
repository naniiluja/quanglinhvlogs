import { Rsvp } from '@/features/invitation/Rsvp'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import type { Invitation } from '@/services/invitation'

interface RsvpSectionProps {
  code: string | null
  invitation: Invitation | undefined
  loading: boolean
}

// Chỉ khách có mã hợp lệ mới thấy form; mã sai và không mã hiện cùng một dòng nhắc (product.md).
export function RsvpSection({ code, invitation, loading }: RsvpSectionProps) {
  return (
    <section aria-labelledby="rsvp-title" className="px-4 py-16">
      <SectionHeading
        id="rsvp-title"
        eyebrow="Hồi đáp"
        title="Xác nhận tham dự"
        description="Bạn báo giúp hai đứa trước ngày cưới để tụi mình chuẩn bị đón tiếp chu đáo nhé."
      />

      <div className="mt-8">
        {loading ? (
          <div className="mx-auto h-64 animate-pulse rounded-2xl bg-muted" aria-label="Đang tải" />
        ) : code && invitation ? (
          <Rsvp code={code} initial={invitation.rsvp} />
        ) : (
          <p className="rounded-2xl border border-border px-6 py-8 text-ink">
            Vui lòng mở đúng link mời được gửi riêng cho bạn để xác nhận tham dự.
          </p>
        )}
      </div>
    </section>
  )
}
