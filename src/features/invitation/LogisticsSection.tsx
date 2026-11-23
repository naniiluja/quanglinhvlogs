import { lazy, Suspense } from 'react'
import { LogisticsItemList } from '@/features/invitation/LogisticsItemList'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { useLogistics } from '@/hooks/useLogistics'
import { LOGISTICS_KIND_LABELS, type LogisticsKind } from '@/lib/logistics'

// Form (react-hook-form + zod) chỉ tải khi khách được tick loại này.
const LogisticsForm = lazy(() =>
  import('@/features/invitation/LogisticsForm').then((m) => ({ default: m.LogisticsForm })),
)

const COPY: Record<LogisticsKind, { eyebrow: string; description: string }> = {
  transport: {
    eyebrow: 'Đi cùng nhau',
    description: 'Hai nhà có xe đưa đón. Xem lịch trình rồi đăng ký giúp tụi mình nhé.',
  },
  lodging: {
    eyebrow: 'Nghỉ ngơi',
    description: 'Hai nhà lo chỗ nghỉ cho khách ở xa. Đăng ký để tụi mình chuẩn bị chu đáo.',
  },
}

interface LogisticsSectionProps {
  code: string
  kind: LogisticsKind
}

// Chỉ render khi admin đã tick quyền đăng ký loại này cho khách (get_invitation báo trước).
export function LogisticsSection({ code, kind }: LogisticsSectionProps) {
  const logistics = useLogistics(code)
  const info = logistics.data?.[kind]
  const skeleton = <div className="h-48 animate-pulse rounded-2xl bg-muted" aria-label="Đang tải" />

  return (
    <section aria-labelledby={`${kind}-title`} className="section-screen">
      <SectionHeading
        id={`${kind}-title`}
        eyebrow={COPY[kind].eyebrow}
        title={LOGISTICS_KIND_LABELS[kind]}
        description={COPY[kind].description}
      />

      <div className="mx-auto mt-5 w-full max-w-xl space-y-5">
        {logistics.isLoading && skeleton}
        {logistics.isError && (
          <p role="alert" className="text-center text-sm text-sage-deep">
            {logistics.error.message}
          </p>
        )}
        {info && (
          <>
            <LogisticsItemList items={info.items} />
            <Suspense fallback={skeleton}>
              <LogisticsForm code={code} kind={kind} initial={info.registration} />
            </Suspense>
          </>
        )}
      </div>
      <NextSectionButton />
    </section>
  )
}
