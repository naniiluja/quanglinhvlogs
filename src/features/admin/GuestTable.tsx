import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GuestRow } from '@/features/admin/GuestRow'
import type { AdminGuest } from '@/services/admin'

export function GuestTable({ guests }: { guests: AdminGuest[] }) {
  if (guests.length === 0) {
    return (
      <p className="py-8 text-center text-sage-deep">
        Chưa có khách nào. Thêm khách đầu tiên ở trên nhé.
      </p>
    )
  }
  return (
    <div className="rounded-xl border border-border bg-cream/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Khách mời</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Lời nhắn</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <GuestRow key={guest.id} guest={guest} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
