import { useState, type FormEvent } from 'react'
import { UserPlus, Users } from 'lucide-react'
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
import { FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useGuestMutations } from '@/hooks/useGuests'
import { BULK_ADD_MAX, GUEST_NAME_MAX, parseGuestNames } from '@/lib/guests'

export function AddGuests() {
  const { add } = useGuestMutations()
  const [name, setName] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [bulkOpen, setBulkOpen] = useState(false)
  const parsed = parseGuestNames(bulkText)
  const bulkInvalid = parsed.names.length === 0 || parsed.overLimit || parsed.tooLong.length > 0

  function addOne(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    add.mutate([trimmed], {
      onSuccess: () => {
        setName('')
        toast.success(`Đã thêm ${trimmed}`)
      },
      onError: (error) => toast.error(error.message),
    })
  }

  function addMany() {
    add.mutate(parsed.names, {
      onSuccess: () => {
        toast.success(`Đã thêm ${parsed.names.length} khách`)
        setBulkText('')
        setBulkOpen(false)
      },
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form onSubmit={addOne} className="flex flex-1 gap-2">
        <Input
          aria-label="Tên khách mời"
          placeholder="Ví dụ: Anh Nam và gia đình"
          maxLength={GUEST_NAME_MAX}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 bg-cream/80"
        />
        <Button type="submit" className="h-11" disabled={add.isPending || !name.trim()}>
          <UserPlus aria-hidden="true" />
          Thêm
        </Button>
      </form>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-11">
            <Users aria-hidden="true" />
            Thêm nhiều
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm nhiều khách</DialogTitle>
            <DialogDescription>
              Mỗi dòng một tên, tối đa {BULK_ADD_MAX} dòng mỗi lần. Dòng trống và tên trùng tự bỏ
              qua.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            aria-label="Danh sách tên khách, mỗi dòng một tên"
            rows={8}
            value={bulkText}
            onChange={(event) => setBulkText(event.target.value)}
          />
          <FieldDescription>Sẽ thêm {parsed.names.length} khách.</FieldDescription>
          {parsed.overLimit && (
            <FieldError>Nhiều hơn {BULK_ADD_MAX} dòng, bạn chia làm nhiều lần nhé.</FieldError>
          )}
          {parsed.tooLong.length > 0 && (
            <FieldError>
              Có {parsed.tooLong.length} tên dài hơn {GUEST_NAME_MAX} ký tự.
            </FieldError>
          )}
          <DialogFooter>
            <Button onClick={addMany} disabled={bulkInvalid || add.isPending}>
              Thêm {parsed.names.length} khách
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
