import { lazy, Suspense, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { WEDDING } from '@/config/wedding'
import { Couple } from '@/features/invitation/Couple'
import { Cover } from '@/features/invitation/Cover'
import { Event } from '@/features/invitation/Event'
import { Family } from '@/features/invitation/Family'
import { Gallery } from '@/features/invitation/Gallery'
import { GiftQr } from '@/features/invitation/GiftQr'
import { Guestbook } from '@/features/invitation/Guestbook'
import { InvitationMessage } from '@/features/invitation/InvitationMessage'
import { LogisticsSection } from '@/features/invitation/LogisticsSection'
import { MusicProvider } from '@/features/invitation/MusicProvider'
import { MusicToggle } from '@/features/invitation/MusicToggle'
import { RsvpSection } from '@/features/invitation/RsvpSection'
import { ScrollToTop } from '@/features/invitation/ScrollToTop'
import { Thanks } from '@/features/invitation/Thanks'
import { Timeline } from '@/features/invitation/Timeline'
import { useWheelPaging } from '@/features/invitation/useWheelPaging'
import { Venue } from '@/features/invitation/Venue'
import { useInvitation } from '@/hooks/useInvitation'
import { useMusic } from '@/hooks/useMusic'
import type { GuestSide } from '@/lib/sides'

// Lịch (react-day-picker + date-fns) nằm dưới màn hình đầu: tải riêng để bìa hiện nhanh.
// Hoa rơi chỉ để trang trí: tải sau, không chặn lần vẽ đầu.
const PetalsFall = lazy(() =>
  import('@/components/effects/PetalsFall').then((m) => ({ default: m.PetalsFall })),
)
const Countdown = lazy(() =>
  import('@/features/invitation/Countdown').then((m) => ({ default: m.Countdown })),
)

function InvitationContent() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('g')
  const invitation = useInvitation(code)
  const contentRef = useRef<HTMLDivElement>(null)
  const music = useMusic()
  useWheelPaging()

  // Mã sai và không có mã hiển thị giống hệt nhau (product.md): chỉ khi có dữ liệu mới gọi tên.
  const guestName = invitation.data?.displayName ?? null
  // Link chung và mã sai thấy cả hai bên.
  const side: GuestSide = invitation.data?.side ?? 'both'

  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* Khung fixed để lớp hoa rơi (tải lười) không bao giờ chiếm chỗ và đẩy nội dung (CLS). */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-(--layer-petals)">
        <Suspense fallback={null}>
          <PetalsFall />
        </Suspense>
      </div>
      <MusicToggle />
      <ScrollToTop />

      <main className="relative z-(--layer-content) mx-auto max-w-120 md:max-w-3xl lg:max-w-5xl">
        <h1 className="sr-only">
          Thiệp cưới {WEDDING.groom.name} và {WEDDING.bride.name}
        </h1>

        <Cover
          guestName={guestName}
          side={side}
          loading={invitation.isLoading}
          onOpen={() => {
            // Bấm "Mở thiệp" là thao tác của người dùng nên được phép phát nhạc.
            music.start()
            contentRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        <div ref={contentRef}>
          {invitation.error?.code === 'NETWORK' && (
            <p role="alert" className="px-4 pt-8 text-center text-sm text-sage-deep">
              {invitation.error.message}
            </p>
          )}
          <InvitationMessage />
          <Family side={side} />
          <Couple />
          <Event side={side} />
          <Suspense fallback={<div className="min-h-[44rem]" />}>
            <Countdown side={side} />
          </Suspense>
          <Timeline side={side} />
          <Venue side={side} />
          <Gallery />
          <Guestbook code={code} invitation={invitation.data} />
          {/* Hộp mừng cưới chỉ hiện với link mời riêng hợp lệ, không public (chủ dự án chốt 2026-09-24). */}
          {code && invitation.data && <GiftQr />}
          {/* RSVP cũng chỉ hiện với link mời riêng hợp lệ, trang public ẩn hẳn (chủ dự án chốt 2026-09-24). */}
          {code && invitation.data && <RsvpSection code={code} invitation={invitation.data} />}
          {/* Xe và lưu trú là hai quyền riêng, admin tick cho từng khách (chủ dự án chốt 2026-11-23). */}
          {code && invitation.data?.canRegisterTransport && (
            <LogisticsSection code={code} kind="transport" />
          )}
          {code && invitation.data?.canRegisterLodging && (
            <LogisticsSection code={code} kind="lodging" />
          )}
          <Thanks side={side} />
        </div>
      </main>
    </div>
  )
}

export function InvitationPage() {
  return (
    <MusicProvider>
      <InvitationContent />
    </MusicProvider>
  )
}
