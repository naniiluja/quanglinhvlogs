import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Reveal } from '@/components/effects/Reveal'
import { Button } from '@/components/ui/button'
import { FieldDescription } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { useAddGuestbookEntry, useGuestbook } from '@/hooks/useGuestbook'
import { formatShortDate } from '@/lib/datetime'
import { GUESTBOOK_LIMIT_PER_GUEST, GUESTBOOK_MESSAGE_MAX } from '@/services/guestbook'
import type { Invitation } from '@/services/invitation'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

function GuestbookForm({ code, sentCount }: { code: string; sentCount: number }) {
  const [message, setMessage] = useState('')
  const add = useAddGuestbookEntry(code)

  if (sentCount >= GUESTBOOK_LIMIT_PER_GUEST) {
    return (
      <p className="text-center text-sage-deep">Bạn đã gửi đủ số lời chúc. Cảm ơn bạn rất nhiều!</p>
    )
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    add.mutate(trimmed, {
      onSuccess: () => {
        setMessage('')
        toast.success('Đã gửi lời chúc, cảm ơn bạn!')
      },
      // Giữ nguyên nội dung khi lỗi (error-handling.md).
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Textarea
        aria-label="Lời chúc gửi cô dâu chú rể"
        placeholder="Viết đôi lời chúc cho hai đứa nhé..."
        rows={2}
        maxLength={GUESTBOOK_MESSAGE_MAX}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="bg-cream/70"
      />
      <div className="flex items-center justify-between gap-2">
        <FieldDescription>
          {message.length}/{GUESTBOOK_MESSAGE_MAX} · còn {GUESTBOOK_LIMIT_PER_GUEST - sentCount}{' '}
          lượt
        </FieldDescription>
        <Button
          type="submit"
          className="h-11 rounded-full px-5"
          disabled={add.isPending || !message.trim()}
        >
          <Send aria-hidden="true" />
          {add.isPending ? 'Đang gửi...' : 'Gửi lời chúc'}
        </Button>
      </div>
    </form>
  )
}

interface GuestbookProps {
  code: string | null
  invitation: Invitation | undefined
}

export function Guestbook({ code, invitation }: GuestbookProps) {
  const entries = useGuestbook()

  return (
    <section aria-labelledby="guestbook-title" className="section-screen">
      <SectionHeading id="guestbook-title" eyebrow="Sổ lưu bút" title="Lời chúc gửi hai đứa" />

      <div className="mx-auto mt-6 w-full max-w-2xl">
        {code && invitation ? (
          <GuestbookForm code={code} sentCount={invitation.guestbookCount} />
        ) : (
          <p className="text-center text-sm text-sage-deep">
            Mở đúng link mời được gửi riêng cho bạn để viết lời chúc nhé.
          </p>
        )}
      </div>

      <div className="mx-auto mt-4 max-h-[max(7rem,calc(100svh-24rem))] w-full max-w-2xl space-y-3 overflow-y-auto pr-1">
        {entries.isLoading && (
          <div className="h-24 animate-pulse rounded-xl bg-muted" aria-label="Đang tải" />
        )}
        {entries.isError && (
          <p role="alert" className="text-center text-sm text-sage-deep">
            {entries.error.message}
          </p>
        )}
        {entries.data?.length === 0 && (
          <p className="text-center text-sage-deep italic">Hãy là người đầu tiên gửi lời chúc.</p>
        )}
        {entries.data?.map((entry, index) => (
          <Reveal key={`${entry.createdAt}-${index}`} inView delay={Math.min(index, 5) * 0.05}>
            {/* Hiển thị văn bản thuần, React tự escape; không dùng dangerouslySetInnerHTML (task 007). */}
            <figure className="rounded-xl border border-border bg-cream/70 px-4 py-3">
              <blockquote className="leading-relaxed break-words whitespace-pre-line text-ink">
                {entry.message}
              </blockquote>
              <figcaption className="mt-2 text-sm text-bronze-deep">
                {entry.authorName} · {formatShortDate(entry.createdAt)}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <NextSectionButton />
    </section>
  )
}
