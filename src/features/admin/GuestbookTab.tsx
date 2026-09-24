import { Trash2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { useAdminGuestbook, useDeleteGuestbookEntry } from '@/hooks/useGuestbook'
import { formatShortDate } from '@/lib/datetime'

export function GuestbookTab() {
  const entries = useAdminGuestbook()
  const remove = useDeleteGuestbookEntry()

  if (entries.isLoading)
    return <div className="h-40 animate-pulse rounded-xl bg-muted" aria-label="Đang tải" />
  if (entries.isError)
    return (
      <p role="alert" className="text-destructive">
        {entries.error.message}
      </p>
    )
  if (!entries.data?.length)
    return <p className="py-8 text-center text-sage-deep">Chưa có lời chúc nào.</p>

  return (
    <ul className="space-y-3">
      {entries.data.map((entry) => (
        <li
          key={entry.id}
          className="flex items-start gap-3 rounded-xl border border-border bg-cream/80 px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="break-words whitespace-pre-line text-ink">{entry.message}</p>
            <p className="mt-1 text-sm text-bronze-deep">
              {entry.authorName} · {formatShortDate(entry.createdAt)}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Xóa lời chúc của ${entry.authorName}`}
              >
                <Trash2 className="text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa lời chúc này?</AlertDialogTitle>
                <AlertDialogDescription>
                  Lời chúc sẽ biến mất khỏi thiệp và không khôi phục được.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Giữ lại</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    remove.mutate(entry.id, { onError: (error) => toast.error(error.message) })
                  }
                >
                  Xóa lời chúc
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </li>
      ))}
    </ul>
  )
}
