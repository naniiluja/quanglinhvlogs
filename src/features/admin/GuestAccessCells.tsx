import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell } from '@/components/ui/table'
import { SideSelect } from '@/features/admin/SideSelect'
import { useGuestMutations } from '@/hooks/useGuests'
import type { AdminGuest, GuestPatch } from '@/services/admin'

// Bên mời và hai quyền đăng ký (xe, lưu trú) của một khách: đổi là lưu ngay.
export function GuestAccessCells({ guest }: { guest: AdminGuest }) {
  const { update } = useGuestMutations()

  function save(patch: GuestPatch) {
    update.mutate({ id: guest.id, patch }, { onError: (error) => toast.error(error.message) })
  }

  return (
    <>
      <TableCell>
        <SideSelect
          value={guest.side}
          onChange={(side) => save({ side })}
          ariaLabel={`Bên mời của ${guest.displayName}`}
          disabled={update.isPending}
        />
      </TableCell>
      <TableCell className="text-center">
        <Checkbox
          checked={guest.canRegisterTransport}
          onCheckedChange={(checked) => save({ canRegisterTransport: checked === true })}
          aria-label={`Cho ${guest.displayName} đăng ký xe`}
          disabled={update.isPending}
          className="size-5"
        />
      </TableCell>
      <TableCell className="text-center">
        <Checkbox
          checked={guest.canRegisterLodging}
          onCheckedChange={(checked) => save({ canRegisterLodging: checked === true })}
          aria-label={`Cho ${guest.displayName} đăng ký lưu trú`}
          disabled={update.isPending}
          className="size-5"
        />
      </TableCell>
    </>
  )
}
