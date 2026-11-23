import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { WEDDING } from '@/config/wedding'
import { LogisticsSummary } from '@/features/invitation/LogisticsSummary'
import { useSubmitLogistics } from '@/hooks/useLogistics'
import {
  LOGISTICS_NOTE_MAX,
  LOGISTICS_PARTY_MAX,
  PHONE_PATTERN,
  type LogisticsKind,
} from '@/lib/logistics'
import type { LogisticsRegistration } from '@/services/logistics'

const CHOICES: Record<LogisticsKind, { yes: string; no: string; legend: string }> = {
  transport: { legend: 'Bạn có cần đi xe chung không?', yes: 'Mình cần xe', no: 'Mình tự đi' },
  lodging: { legend: 'Bạn có cần chỗ nghỉ không?', yes: 'Mình cần chỗ nghỉ', no: 'Không cần' },
}

// Cùng giới hạn với hàm submit_logistics trong DB.
const baseSchema = z.object({
  needed: z.enum(['yes', 'no'], { error: 'Bạn chọn giúp mình một ý nhé.' }),
  partySize: z.coerce
    .number<string>()
    .int('Số người là số nguyên.')
    .min(1, 'Ít nhất 1 người.')
    .max(LOGISTICS_PARTY_MAX, `Tối đa ${LOGISTICS_PARTY_MAX} người.`),
  phone: z.string().trim(),
  nights: z.array(z.string()),
  note: z.string().max(LOGISTICS_NOTE_MAX, `Ghi chú tối đa ${LOGISTICS_NOTE_MAX} ký tự.`),
})

// Số điện thoại và đêm nghỉ chỉ bắt buộc khi khách chọn "cần".
function schemaFor(kind: LogisticsKind) {
  return baseSchema.superRefine((values, ctx) => {
    if (values.needed !== 'yes') return
    if (!PHONE_PATTERN.test(values.phone)) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Số điện thoại chưa đúng.' })
    }
    if (kind === 'lodging' && values.nights.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['nights'], message: 'Bạn chọn ít nhất một đêm nhé.' })
    }
  })
}

type FormInput = z.input<typeof baseSchema>
type FormValues = z.output<typeof baseSchema>

function toDefaults(saved: LogisticsRegistration | null): Partial<FormInput> {
  return {
    needed: saved ? (saved.needed ? 'yes' : 'no') : undefined,
    partySize: String(saved?.partySize ?? 1),
    phone: saved?.phone ?? '',
    nights: saved?.nights ?? [],
    note: saved?.note ?? '',
  }
}

interface LogisticsFormProps {
  code: string
  kind: LogisticsKind
  initial: LogisticsRegistration | null
}

export function LogisticsForm({ code, kind, initial }: LogisticsFormProps) {
  const submit = useSubmitLogistics(code, kind)
  const [editing, setEditing] = useState(initial === null)
  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schemaFor(kind)),
    defaultValues: toDefaults(initial),
  })
  const needed = useWatch({ control: form.control, name: 'needed' })
  const choices = CHOICES[kind]
  const id = (name: string) => `${kind}-${name}`

  function onSubmit(values: FormValues) {
    const isNeeded = values.needed === 'yes'
    submit.mutate(
      {
        needed: isNeeded,
        partySize: values.partySize,
        phone: values.phone || null,
        nights: values.nights,
        note: values.note.trim() || null,
      },
      {
        onSuccess: () => setEditing(false),
        onError: (error) => toast.error(error.message),
      },
    )
  }

  const saved = submit.data ?? initial
  if (!editing && saved) {
    return <LogisticsSummary kind={kind} saved={saved} onEdit={() => setEditing(true)} />
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="text-left" noValidate>
      <FieldGroup className="gap-4">
        <Controller
          name="needed"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>{choices.legend}</FieldLegend>
              <RadioGroup
                name={field.name}
                value={field.value ?? ''}
                onValueChange={field.onChange}
                className="grid-cols-2"
              >
                {(['yes', 'no'] as const).map((value) => (
                  <FieldLabel key={value} htmlFor={id(value)}>
                    <Field orientation="horizontal">
                      <span className="flex-1 font-medium">{choices[value]}</span>
                      <RadioGroupItem value={value} id={id(value)} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        {needed === 'yes' && (
          <>
            <div className="grid grid-cols-[6rem_1fr] gap-3">
              <Field data-invalid={!!form.formState.errors.partySize}>
                <FieldLabel htmlFor={id('party')}>Số người</FieldLabel>
                <Input
                  {...form.register('partySize')}
                  id={id('party')}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={LOGISTICS_PARTY_MAX}
                  className="h-11 bg-cream/70"
                />
              </Field>
              <Field data-invalid={!!form.formState.errors.phone}>
                <FieldLabel htmlFor={id('phone')}>Số điện thoại</FieldLabel>
                <Input
                  {...form.register('phone')}
                  id={id('phone')}
                  type="tel"
                  autoComplete="tel"
                  placeholder="09xx xxx xxx"
                  className="h-11 bg-cream/70"
                />
              </Field>
            </div>
            <FieldError errors={[form.formState.errors.partySize, form.formState.errors.phone]} />

            {kind === 'lodging' && (
              <Controller
                name="nights"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Nghỉ những đêm nào?</FieldLegend>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {WEDDING.lodgingNights.map((night) => (
                        <label
                          key={night.date}
                          className="flex min-h-11 items-center gap-2 text-sm"
                        >
                          <Checkbox
                            className="size-5"
                            checked={field.value.includes(night.date)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                checked
                                  ? [...field.value, night.date].sort()
                                  : field.value.filter((date) => date !== night.date),
                              )
                            }
                          />
                          {night.label}
                        </label>
                      ))}
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldSet>
                )}
              />
            )}
          </>
        )}

        <Field data-invalid={!!form.formState.errors.note}>
          <FieldLabel htmlFor={id('note')}>Ghi chú (không bắt buộc)</FieldLabel>
          <Textarea
            {...form.register('note')}
            id={id('note')}
            rows={2}
            maxLength={LOGISTICS_NOTE_MAX}
            className="bg-cream/70"
          />
          <FieldError errors={[form.formState.errors.note]} />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="h-11 rounded-full text-base"
          disabled={submit.isPending}
        >
          {submit.isPending ? 'Đang gửi...' : 'Gửi đăng ký'}
        </Button>
      </FieldGroup>
    </form>
  )
}
