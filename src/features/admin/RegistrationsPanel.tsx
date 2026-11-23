import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { WEDDING } from '@/config/wedding'
import { useRegistrations } from '@/hooks/useLogistics'
import { LOGISTICS_KIND_LABELS, LOGISTICS_KINDS, telHref } from '@/lib/logistics'

const nightLabel = (date: string) =>
  WEDDING.lodgingNights.find((night) => night.date === date)?.label ?? date

// Ai đã đăng ký xe, lưu trú; dòng tổng cộng số người cần cho từng loại.
export function RegistrationsPanel() {
  const registrations = useRegistrations()

  if (registrations.isLoading)
    return <div className="h-32 animate-pulse rounded-xl bg-muted" aria-label="Đang tải" />
  if (registrations.isError)
    return (
      <p role="alert" className="text-destructive">
        {registrations.error.message}
      </p>
    )

  const rows = registrations.data ?? []
  const totals = LOGISTICS_KINDS.map((kind) => ({
    kind,
    people: rows
      .filter((row) => row.kind === kind && row.needed)
      .reduce((sum, row) => sum + row.partySize, 0),
  }))

  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl font-semibold text-ink">Khách đã đăng ký</h2>
      <p className="text-sm text-sage-deep">
        {totals.map((t) => `${LOGISTICS_KIND_LABELS[t.kind]}: ${t.people} người`).join(' · ')}
      </p>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sage-deep">Chưa có khách nào đăng ký.</p>
      ) : (
        <div className="rounded-xl border border-border bg-cream/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách mời</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Cần</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${row.guestId}-${row.kind}`}>
                  <TableCell className="font-medium whitespace-normal">{row.guestName}</TableCell>
                  <TableCell>{LOGISTICS_KIND_LABELS[row.kind]}</TableCell>
                  <TableCell className="whitespace-normal">
                    {row.needed ? (
                      <Badge className="bg-sage text-cream">
                        {row.partySize} người
                        {row.nights.length > 0 && ` · ${row.nights.map(nightLabel).join(', ')}`}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Không cần</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.phone && (
                      <a href={telHref(row.phone)} className="text-bronze-deep underline">
                        {row.phone}
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="max-w-64 text-sm whitespace-normal text-sage-deep">
                    {row.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}
