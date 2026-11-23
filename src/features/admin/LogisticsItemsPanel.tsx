import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import { LogisticsItemDialog } from '@/features/admin/LogisticsItemDialog'
import { useLogisticsItemMutations, useLogisticsItems } from '@/hooks/useLogistics'
import { formatShortDateTime } from '@/lib/datetime'
import { LOGISTICS_KIND_LABELS } from '@/lib/logistics'
import { GUEST_SIDE_LABELS } from '@/lib/sides'

export function LogisticsItemsPanel() {
  const items = useLogisticsItems()
  const { remove } = useLogisticsItemMutations()

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-semibold text-ink">Lịch trình và chỗ nghỉ</h2>
        <LogisticsItemDialog
          trigger={
            <Button>
              <Plus aria-hidden="true" />
              Thêm mục
            </Button>
          }
        />
      </div>

      {items.isLoading && (
        <div className="h-32 animate-pulse rounded-xl bg-muted" aria-label="Đang tải" />
      )}
      {items.isError && (
        <p role="alert" className="text-destructive">
          {items.error.message}
        </p>
      )}
      {items.data?.length === 0 && (
        <p className="py-6 text-center text-sage-deep">
          Chưa có mục nào. Thêm giờ xe chạy, điểm đón, nơi nghỉ và người liên hệ để khách xem.
        </p>
      )}
      <ul className="space-y-2">
        {items.data?.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-border bg-cream/80 px-4 py-3"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-sage text-cream">{LOGISTICS_KIND_LABELS[item.kind]}</Badge>
                <Badge variant="outline">{GUEST_SIDE_LABELS[item.side]}</Badge>
                {item.startsAt && (
                  <span className="text-sm font-semibold text-bronze-deep">
                    {formatShortDateTime(item.startsAt)}
                  </span>
                )}
              </div>
              <p className="font-medium text-ink">{item.title}</p>
              <p className="text-sm break-words text-sage-deep">
                {[item.location, item.contactName, item.contactPhone].filter(Boolean).join(' · ')}
              </p>
            </div>
            <LogisticsItemDialog
              item={item}
              trigger={
                <Button size="icon" variant="ghost" aria-label={`Sửa ${item.title}`}>
                  <Pencil />
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" aria-label={`Xóa ${item.title}`}>
                  <Trash2 className="text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa “{item.title}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Khách sẽ không còn thấy mục này trên thiệp.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Giữ lại</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      remove.mutate(item.id, { onError: (error) => toast.error(error.message) })
                    }
                  >
                    Xóa mục
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        ))}
      </ul>
    </section>
  )
}
