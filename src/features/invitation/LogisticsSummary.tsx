import { Button } from '@/components/ui/button'
import { WEDDING } from '@/config/wedding'
import type { LogisticsKind } from '@/lib/logistics'
import type { LogisticsRegistration } from '@/services/logistics'

const NOT_NEEDED: Record<LogisticsKind, string> = {
  transport: 'Bạn đã báo tự đi, cảm ơn bạn nhé.',
  lodging: 'Bạn đã báo không cần chỗ nghỉ, cảm ơn bạn nhé.',
}

interface LogisticsSummaryProps {
  kind: LogisticsKind
  saved: LogisticsRegistration
  onEdit: () => void
}

// Đăng ký đã gửi; khách bấm sửa để đổi ý (gửi lại sẽ ghi đè).
export function LogisticsSummary({ kind, saved, onEdit }: LogisticsSummaryProps) {
  const nights = WEDDING.lodgingNights
    .filter((night) => saved.nights.includes(night.date))
    .map((night) => night.label)
    .join(', ')

  return (
    <div className="rounded-2xl border border-border bg-cream/70 px-6 py-5 text-center">
      <p className="font-serif text-2xl font-semibold text-mauve">Đã nhận đăng ký</p>
      {saved.needed ? (
        <p className="mt-2 text-ink">
          {kind === 'transport' ? 'Xe cho' : 'Chỗ nghỉ cho'} {saved.partySize} người
          {nights && ` (${nights})`}. Hai nhà sẽ gọi số {saved.phone} để báo chi tiết.
        </p>
      ) : (
        <p className="mt-2 text-ink">{NOT_NEEDED[kind]}</p>
      )}
      <Button variant="outline" className="mt-4 h-11 rounded-full" onClick={onEdit}>
        Sửa đăng ký
      </Button>
    </div>
  )
}
