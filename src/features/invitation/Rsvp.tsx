import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Reveal } from '@/components/effects/Reveal'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { celebrate } from '@/components/effects/celebrate'
import { useSubmitRsvp } from '@/hooks/useSubmitRsvp'
import type { RsvpAnswer } from '@/services/invitation'

// Cùng giới hạn với hàm submit_rsvp trong DB (product.md mục RSVP).
const MESSAGE_MAX = 500
const PARTY_SIZES = ['1', '2', '3', '4', '5'] as const

const rsvpSchema = z.object({
  attending: z.enum(['yes', 'no'], { error: 'Bạn chọn giúp mình có đến được không nhé.' }),
  partySize: z.enum(PARTY_SIZES),
  message: z.string().max(MESSAGE_MAX, `Lời nhắn tối đa ${MESSAGE_MAX} ký tự.`),
})

type RsvpForm = z.infer<typeof rsvpSchema>

function toFormValues(answer: RsvpAnswer | null): RsvpForm | undefined {
  if (!answer) return undefined
  return {
    attending: answer.attending ? 'yes' : 'no',
    partySize: String(answer.partySize) as RsvpForm['partySize'],
    message: answer.message ?? '',
  }
}

interface RsvpProps {
  code: string
  initial: RsvpAnswer | null
}

export function Rsvp({ code, initial }: RsvpProps) {
  const submit = useSubmitRsvp(code)
  const [editing, setEditing] = useState(initial === null)
  const form = useForm<RsvpForm>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: toFormValues(initial) ?? { partySize: '1', message: '' },
  })
  const attending = useWatch({ control: form.control, name: 'attending' })
  const message = useWatch({ control: form.control, name: 'message' }) ?? ''

  function onSubmit(values: RsvpForm) {
    const answer: RsvpAnswer = {
      attending: values.attending === 'yes',
      partySize: Number(values.partySize),
      message: values.message.trim() || null,
    }
    submit.mutate(answer, {
      onSuccess: (saved) => {
        setEditing(false)
        if (saved.attending) celebrate()
      },
      // Giữ nguyên nội dung khách đã nhập, chỉ báo lỗi (error-handling.md).
      onError: (error) => toast.error(error.message),
    })
  }

  const saved = submit.data ?? initial

  if (!editing && saved) {
    return (
      <Reveal inView className="rounded-2xl border border-border bg-cream/70 px-6 py-8">
        <p className="font-script text-5xl text-mauve">Cảm ơn bạn</p>
        <p className="mt-4 text-ink">
          {saved.attending
            ? `Hai đứa mình rất vui được đón ${saved.partySize > 1 ? `${saved.partySize} người` : 'bạn'} trong ngày cưới.`
            : 'Tiếc quá, hẹn gặp bạn dịp gần nhất nhé. Cảm ơn bạn đã báo cho hai đứa.'}
        </p>
        <Button
          variant="outline"
          className="mt-6 h-11 rounded-full"
          onClick={() => setEditing(true)}
        >
          Sửa lại câu trả lời
        </Button>
      </Reveal>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="text-left" noValidate>
      <FieldGroup>
        <Controller
          name="attending"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Bạn có đến chung vui được không?</FieldLegend>
              <RadioGroup
                name={field.name}
                value={field.value ?? ''}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="rsvp-yes">
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldTitle>Mình sẽ tham dự</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="yes" id="rsvp-yes" aria-invalid={fieldState.invalid} />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="rsvp-no">
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldTitle>Rất tiếc, mình không thể đến</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="no" id="rsvp-no" aria-invalid={fieldState.invalid} />
                  </Field>
                </FieldLabel>
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        {attending === 'yes' && (
          <Controller
            name="partySize"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel id="rsvp-party-label">Số người đi cùng (tính cả bạn)</FieldLabel>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={field.value}
                  // Radix trả chuỗi rỗng khi bấm lại ô đang chọn; giữ nguyên lựa chọn cũ.
                  onValueChange={(value) => value && field.onChange(value)}
                  aria-labelledby="rsvp-party-label"
                  className="w-full"
                >
                  {PARTY_SIZES.map((size) => (
                    <ToggleGroupItem
                      key={size}
                      value={size}
                      aria-label={`${size} người`}
                      className="h-11 flex-1 data-[state=on]:border-bronze-deep data-[state=on]:bg-bronze-deep data-[state=on]:text-cream"
                    >
                      {size}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            )}
          />
        )}

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="rsvp-message">
                Lời nhắn cho cô dâu chú rể (không bắt buộc)
              </FieldLabel>
              <Textarea
                {...field}
                id="rsvp-message"
                rows={3}
                maxLength={MESSAGE_MAX}
                aria-invalid={fieldState.invalid}
                className="bg-cream/70"
              />
              <FieldDescription className="text-right">
                {message.length}/{MESSAGE_MAX}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-full text-base"
          disabled={submit.isPending}
        >
          {submit.isPending ? 'Đang gửi...' : 'Gửi xác nhận'}
        </Button>
      </FieldGroup>
    </form>
  )
}
