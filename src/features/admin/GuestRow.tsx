import { useState } from 'react'
import { Check, Link2, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'
import { useGuestMutations } from '@/hooks/useGuests'
import { GUEST_NAME_MAX, inviteLink } from '@/lib/guests'
import type { AdminGuest } from '@/services/admin'

function RsvpBadge({ guest }: { guest: AdminGuest }) {
  if (!guest.rsvp) return <Badge variant="outline">Chưa trả lời</Badge>
  return guest.rsvp.attending ? (
    <Badge className="bg-sage text-cream">Tham dự · {guest.rsvp.partySize} người</Badge>
  ) : (
    <Badge variant="secondary" className="bg-blush text-ink">
      Không đến
    </Badge>
  )
}

export function GuestRow({ guest }: { guest: AdminGuest }) {
  const { rename, remove } = useGuestMutations()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(guest.displayName)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink(window.location.origin, guest.code))
      toast.success(`Đã sao chép link mời của ${guest.displayName}`)
    } catch {
      toast.error('Trình duyệt chặn sao chép, bạn thử lại trên trình duyệt khác nhé.')
    }
  }

  function saveName() {
    const trimmed = draft.trim()
    if (!trimmed || trimmed === guest.displayName) return setEditing(false)
    rename.mutate(
      { id: guest.id, displayName: trimmed },
      {
        onSuccess: () => setEditing(false),
        onError: (error) => toast.error(error.message),
      },
    )
  }

  return (
    <TableRow>
      <TableCell className="min-w-44 whitespace-normal">
        {editing ? (
          <div className="flex gap-1">
            <Input
              aria-label={`Tên mới cho ${guest.displayName}`}
              value={draft}
              maxLength={GUEST_NAME_MAX}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && saveName()}
              className="h-9"
              autoFocus
            />
            <Button size="icon" variant="ghost" aria-label="Lưu tên" onClick={saveName}>
              <Check />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Hủy sửa"
              onClick={() => setEditing(false)}
            >
              <X />
            </Button>
          </div>
        ) : (
          <span className="font-medium">{guest.displayName}</span>
        )}
      </TableCell>
      <TableCell>
        <RsvpBadge guest={guest} />
      </TableCell>
      <TableCell className="max-w-64 text-sm whitespace-normal text-sage-deep">
        {guest.rsvp?.message ?? ''}
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Sao chép link mời của ${guest.displayName}`}
          onClick={copyLink}
        >
          <Link2 />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Sửa tên ${guest.displayName}`}
          onClick={() => {
            setDraft(guest.displayName)
            setEditing(true)
          }}
        >
          <Pencil />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost" aria-label={`Xóa ${guest.displayName}`}>
              <Trash2 className="text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa {guest.displayName}?</AlertDialogTitle>
              <AlertDialogDescription>
                Link mời của khách này sẽ hết hiệu lực. Câu trả lời tham dự và lời chúc của khách
                cũng bị xóa theo, không khôi phục được.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Giữ lại</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  remove.mutate(guest.id, { onError: (error) => toast.error(error.message) })
                }
              >
                Xóa khách
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  )
}
