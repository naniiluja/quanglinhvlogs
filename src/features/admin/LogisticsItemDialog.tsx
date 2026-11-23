import { useState, type FormEvent, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SideSelect } from '@/features/admin/SideSelect'
import { useLogisticsItemMutations } from '@/hooks/useLogistics'
import { fromVnInputValue, toVnInputValue } from '@/lib/datetime'
import {
  isLogisticsKind,
  LOGISTICS_KIND_LABELS,
  LOGISTICS_KINDS,
  LOGISTICS_NOTE_MAX,
  type LogisticsKind,
} from '@/lib/logistics'
import type { GuestSide } from '@/lib/sides'
import type { AdminLogisticsItem } from '@/services/logisticsAdmin'

interface Draft {
  kind: LogisticsKind
  side: GuestSide
  startsAt: string
  title: string
  location: string
  contactName: string
  contactPhone: string
  note: string
}

function toDraft(item?: AdminLogisticsItem): Draft {
  return {
    kind: item?.kind ?? 'transport',
    side: item?.side ?? 'both',
    startsAt: item?.startsAt ? toVnInputValue(item.startsAt) : '',
    title: item?.title ?? '',
    location: item?.location ?? '',
    contactName: item?.contactName ?? '',
    contactPhone: item?.contactPhone ?? '',
    note: item?.note ?? '',
  }
}

const orNull = (value: string) => value.trim() || null

interface LogisticsItemDialogProps {
  item?: AdminLogisticsItem
  trigger: ReactNode
}

// Thêm hoặc sửa một mục lịch trình xe / nơi lưu trú.
export function LogisticsItemDialog({ item, trigger }: LogisticsItemDialogProps) {
  const { save } = useLogisticsItemMutations()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() => toDraft(item))
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim()) return
    save.mutate(
      {
        id: item?.id,
        kind: draft.kind,
        side: draft.side,
        startsAt: draft.startsAt ? fromVnInputValue(draft.startsAt) : null,
        title: draft.title.trim(),
        location: orNull(draft.location),
        contactName: orNull(draft.contactName),
        contactPhone: orNull(draft.contactPhone),
        note: orNull(draft.note),
      },
      {
        onSuccess: () => {
          toast.success(item ? 'Đã lưu thay đổi' : 'Đã thêm mục mới')
          setOpen(false)
        },
        onError: (error) => toast.error(error.message),
      },
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Mở lại thì nạp lại từ dữ liệu mới nhất.
        if (next) setDraft(toDraft(item))
        setOpen(next)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Sửa mục' : 'Thêm mục'} lịch trình</DialogTitle>
          <DialogDescription>
            Khách chỉ thấy mục thuộc loại mình được tick và đúng bên mời.
          </DialogDescription>
        </DialogHeader>
        <form id="logistics-item-form" onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Loại</FieldLabel>
              <Select
                value={draft.kind}
                onValueChange={(value) => isLogisticsKind(value) && set('kind', value)}
              >
                <SelectTrigger aria-label="Loại" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOGISTICS_KINDS.map((kind) => (
                    <SelectItem key={kind} value={kind}>
                      {LOGISTICS_KIND_LABELS[kind]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Hiện cho khách</FieldLabel>
              <SideSelect
                value={draft.side}
                onChange={(side) => set('side', side)}
                ariaLabel="Hiện cho khách bên nào"
                className="w-full"
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="li-title">Tiêu đề</FieldLabel>
            <Input
              id="li-title"
              required
              maxLength={120}
              placeholder="Ví dụ: Xe đón khách tại TP.HCM"
              value={draft.title}
              onChange={(event) => set('title', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="li-time">Thời gian (giờ Việt Nam)</FieldLabel>
            <Input
              id="li-time"
              type="datetime-local"
              value={draft.startsAt}
              onChange={(event) => set('startsAt', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="li-location">Địa điểm</FieldLabel>
            <Input
              id="li-location"
              maxLength={500}
              placeholder="Địa chỉ, hoặc dán link Google Maps"
              value={draft.location}
              onChange={(event) => set('location', event.target.value)}
            />
            <FieldDescription>Khách bấm vào sẽ mở Google Maps.</FieldDescription>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="li-contact">Người liên hệ</FieldLabel>
              <Input
                id="li-contact"
                maxLength={80}
                value={draft.contactName}
                onChange={(event) => set('contactName', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="li-phone">Số điện thoại</FieldLabel>
              <Input
                id="li-phone"
                type="tel"
                maxLength={20}
                value={draft.contactPhone}
                onChange={(event) => set('contactPhone', event.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="li-note">Ghi chú</FieldLabel>
            <Textarea
              id="li-note"
              rows={2}
              maxLength={LOGISTICS_NOTE_MAX}
              value={draft.note}
              onChange={(event) => set('note', event.target.value)}
            />
          </Field>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="logistics-item-form"
            disabled={save.isPending || !draft.title.trim()}
          >
            {item ? 'Lưu' : 'Thêm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
