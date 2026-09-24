import { Rsvp } from '@/features/invitation/Rsvp'
import type { Invitation } from '@/services/invitation'

interface RsvpSectionProps {
  code: string | null
  invitation: Invitation | undefined
  loading: boolean
}

// Chỉ khách có mã hợp lệ mới thấy form; mã sai và không mã hiện cùng một dòng nhắc (product.md).
export function RsvpSection({ code, invitation, loading }: RsvpSectionProps) {
  return (
    <section aria-labelledby="rsvp-title" className="px-4 py-16 text-center">
      <p className="font-serif text-sm tracking-[0.35em] text-sage-deep uppercase">R.S.V.P</p>
      <h2 id="rsvp-title" className="mt-2 font-serif text-3xl font-semibold text-ink">
        Xác nhận tham dự
      </h2>
      <p className="mx-auto mt-3 max-w-80 text-sage-deep">
        Bạn báo giúp hai đứa trước ngày cưới để tụi mình chuẩn bị đón tiếp chu đáo nhé.
      </p>

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
