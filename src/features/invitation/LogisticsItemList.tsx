import { Clock, MapPin, Phone } from 'lucide-react'
import { Reveal } from '@/components/effects/Reveal'
import { formatShortDateTime } from '@/lib/datetime'
import { telHref } from '@/lib/logistics'
import { isHttpsUrl, mapsHref } from '@/lib/maps'
import type { LogisticsItem } from '@/services/logistics'

// Lịch trình xe hoặc nơi lưu trú do admin nhập: giờ, nơi (mở Google Maps), người liên hệ (bấm gọi).
export function LogisticsItemList({ items }: { items: LogisticsItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-sage-deep">
        Lịch trình chi tiết sẽ được cập nhật sớm, bạn quay lại xem sau nhé.
      </p>
    )
  }
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={item.id}>
          <Reveal
            inView
            delay={index * 0.08}
            className="rounded-2xl border border-border bg-cream/70 px-4 py-3 text-left"
          >
            {item.startsAt && (
              <p className="flex items-center gap-1.5 font-serif text-xl font-semibold text-bronze-deep">
                <Clock aria-hidden="true" className="size-4" />
                {formatShortDateTime(item.startsAt)}
              </p>
            )}
            <p className="font-semibold text-ink">{item.title}</p>
            {item.location && (
              <a
                href={mapsHref(item.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex min-h-11 items-center gap-1.5 text-sm text-sage-deep underline-offset-4 hover:underline"
              >
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-bronze-deep" />
                <span className="break-words">
                  {isHttpsUrl(item.location) ? 'Xem trên Google Maps' : item.location}
                </span>
              </a>
            )}
            {(item.contactName || item.contactPhone) && (
              <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-ink">
                <Phone aria-hidden="true" className="size-4 shrink-0 text-bronze-deep" />
                Liên hệ {item.contactName}
                {item.contactPhone && (
                  <a
                    href={telHref(item.contactPhone)}
                    className="inline-flex min-h-11 items-center font-semibold text-bronze-deep underline underline-offset-4"
                  >
                    {item.contactPhone}
                  </a>
                )}
              </p>
            )}
            {item.note && <p className="text-sm whitespace-pre-line text-sage-deep">{item.note}</p>}
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
