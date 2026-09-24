import type { GuestStats } from '@/lib/guests'

const ITEMS: { key: keyof GuestStats; label: string }[] = [
  { key: 'invited', label: 'Khách mời' },
  { key: 'responded', label: 'Đã trả lời' },
  { key: 'attending', label: 'Tham dự' },
  { key: 'declined', label: 'Không đến' },
  { key: 'attendingPeople', label: 'Tổng số người' },
]

export function Stats({ stats }: { stats: GuestStats }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ITEMS.map((item) => (
        <div key={item.key} className="rounded-xl border border-border bg-cream/80 px-4 py-3">
          <dt className="text-xs tracking-wider text-sage-deep uppercase">{item.label}</dt>
          <dd className="font-serif text-3xl font-semibold text-ink">{stats[item.key]}</dd>
        </div>
      ))}
    </dl>
  )
}
