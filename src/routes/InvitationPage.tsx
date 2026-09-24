import { useRef } from 'react'
import { useSearchParams } from 'react-router'
import { PetalsFall } from '@/components/effects/PetalsFall'
import { NoiseTexture } from '@/components/ui/noise-texture'
import { WEDDING } from '@/config/wedding'
import { Countdown } from '@/features/invitation/Countdown'
import { Couple } from '@/features/invitation/Couple'
import { Cover } from '@/features/invitation/Cover'
import { Event } from '@/features/invitation/Event'
import { Family } from '@/features/invitation/Family'
import { Gallery } from '@/features/invitation/Gallery'
import { GiftQr } from '@/features/invitation/GiftQr'
import { Guestbook } from '@/features/invitation/Guestbook'
import { InvitationMessage } from '@/features/invitation/InvitationMessage'
import { MusicProvider } from '@/features/invitation/MusicProvider'
import { MusicToggle } from '@/features/invitation/MusicToggle'
import { RsvpSection } from '@/features/invitation/RsvpSection'
import { Timeline } from '@/features/invitation/Timeline'
import { Venue } from '@/features/invitation/Venue'
import { useInvitation } from '@/hooks/useInvitation'
import { useMusic } from '@/hooks/useMusic'

function InvitationContent() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('g')
  const invitation = useInvitation(code)
  const contentRef = useRef<HTMLDivElement>(null)
  const music = useMusic()

  // Mã sai và không có mã hiển thị giống hệt nhau (product.md): chỉ khi có dữ liệu mới gọi tên.
  const guestName = invitation.data?.displayName ?? null

  return (
    <div className="relative min-h-svh overflow-hidden">
      <NoiseTexture className="fixed z-(--layer-background) opacity-15" />
      <PetalsFall />
      <MusicToggle />

      <main className="relative z-(--layer-content) mx-auto max-w-120">
        <h1 className="sr-only">
          Thiệp cưới {WEDDING.groom.name} và {WEDDING.bride.name}
        </h1>

        <Cover
          guestName={guestName}
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
          <Family />
          <Couple />
          <Event />
          <Countdown />
          <Timeline />
          <Venue />
          <Gallery />
          <Guestbook code={code} invitation={invitation.data} />
          <GiftQr />
          <RsvpSection code={code} invitation={invitation.data} loading={invitation.isLoading} />
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
