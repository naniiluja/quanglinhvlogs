import { WEDDING } from '@/config/wedding'
import { toDateParts } from '@/lib/datetime'
import { coupleFor, eventsFor, type GuestSide } from '@/lib/sides'

// Mặt sau tấm bưu thiếp trên bìa: tem hoa, lời tâm sự của hai người gửi đích danh khách,
// dấu bưu điện ngày cưới. Thiệp co giãn theo chiều cao màn (142px đến hơn 400px bề ngang) nên
// cỡ chữ và khoảng cách tính theo bề ngang thiệp (container query, đơn vị cqw), luôn vừa khung vòm.
interface CoverPostcardProps {
  guestName: string | null
  side: GuestSide
}

export function CoverPostcard({ guestName, side }: CoverPostcardProps) {
  const [first, second] = coupleFor(side)
  // Dấu bưu điện là ngày lễ đầu tiên khách được mời.
  const date = toDateParts(eventsFor(side)[0].ceremony.startsAt)
  return (
    <div className="@container size-full rounded-t-full border border-bronze/60">
      <div className="flex size-full flex-col items-center justify-center gap-[2.5cqw] px-[9cqw] pt-[20%] pb-[7cqw] text-center">
        <img
          src="/images/petals/cherry-blossom.png"
          width={40}
          height={40}
          alt=""
          aria-hidden="true"
          className="size-[13cqw] rounded-sm border-2 border-dashed border-blush bg-cream p-[1cqw]"
          draggable={false}
        />
        <p className="font-serif text-[9cqw] leading-tight font-semibold text-mauve">
          {WEDDING.coverNote.title}
        </p>
        <p className="font-serif text-[6.2cqw] font-semibold text-ink italic">
          Gửi {guestName ?? 'bạn thân mến'},
        </p>
        <p className="text-[5.4cqw] leading-relaxed text-ink">{WEDDING.coverNote.body}</p>
        <p className="font-serif text-[6.2cqw] font-semibold text-bronze-deep italic">
          {first.name} &amp; {second.name}
        </p>
        <span className="rounded-full border border-dashed border-bronze/70 px-[3cqw] font-serif text-[4.4cqw] tracking-[0.2em] text-bronze-deep">
          {date.day} · {date.month} · {date.year}
        </span>
      </div>
    </div>
  )
}
