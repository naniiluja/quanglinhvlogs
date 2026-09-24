import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { LazyLightbox } from '@/components/effects/LazyLightbox'
import { Reveal } from '@/components/effects/Reveal'
import { Button } from '@/components/ui/button'
import { WEDDING, type GiftAccount } from '@/config/wedding'
import { SectionHeading } from '@/features/invitation/SectionHeading'
import { log } from '@/lib/log'
import { buildVietQrUrl } from '@/lib/vietqr'
import { NextSectionButton } from '@/features/invitation/NextSectionButton'

function AccountCard({ account, onZoom }: { account: GiftAccount; onZoom: (src: string) => void }) {
  const [qrFailed, setQrFailed] = useState(false)
  const qrUrl = buildVietQrUrl(account.bankBin, account.accountNumber, account.accountName)

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      toast.success('Đã sao chép số tài khoản')
    } catch (error) {
      // Trình duyệt trong Zalo có thể chặn clipboard: báo để khách tự chọn số (vẫn chọn được).
      log.warn('gift.copy.denied', {
        error: error instanceof Error ? error.message : String(error),
      })
      toast.error('Không sao chép được, bạn giữ tay lên số tài khoản để chọn nhé.')
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-cream/70 px-5 py-6 text-center">
      <p className="font-serif text-xl font-semibold text-bronze-deep uppercase">{account.label}</p>

      {qrFailed ? (
        <p className="mx-auto mt-4 max-w-64 text-sm text-sage-deep">
          Chưa tải được mã QR. Bạn chuyển khoản theo số tài khoản bên dưới giúp mình nhé.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => onZoom(qrUrl)}
          aria-label={`Phóng to mã QR ${account.label.toLowerCase()}`}
          className="mx-auto mt-4 block w-fit rounded-xl bg-white p-2"
        >
          <img
            src={qrUrl}
            width={540}
            height={540}
            alt={`Mã QR chuyển khoản ${account.bankName} của ${account.accountName}`}
            loading="lazy"
            onError={() => setQrFailed(true)}
            className="size-52"
          />
        </button>
      )}

      <p className="mt-4 text-sm text-sage-deep">{account.bankName}</p>
      <p className="font-sans text-2xl font-semibold tracking-wider text-ink select-all">
        {account.accountNumber}
      </p>
      <p className="text-sm text-ink">{account.accountName}</p>

      <Button variant="outline" className="mt-4 h-11 rounded-full" onClick={copyAccountNumber}>
        <Copy aria-hidden="true" />
        Sao chép số tài khoản
      </Button>
    </div>
  )
}

export function GiftQr() {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)

  return (
    <section aria-labelledby="gift-title" className="section-screen">
      <SectionHeading
        id="gift-title"
        eyebrow="Mừng cưới"
        title="Hộp mừng cưới"
        description="Sự hiện diện của bạn là món quà ý nghĩa nhất. Nếu muốn gửi lời chúc, bạn có thể quét mã bên dưới."
      />
      <Reveal inView className="mx-auto mt-8 w-full max-w-sm">
        <AccountCard account={WEDDING.giftAccount} onZoom={setZoomSrc} />
      </Reveal>

      <LazyLightbox
        open={zoomSrc !== null}
        close={() => setZoomSrc(null)}
        slides={zoomSrc ? [{ src: zoomSrc, alt: 'Mã QR chuyển khoản' }] : []}
        labels={{ Close: 'Đóng', Lightbox: 'Xem mã QR' }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
        carousel={{ finite: true }}
        styles={{
          root: {
            '--yarl__portal_zindex': 60,
            '--yarl__color_backdrop': 'rgba(250, 245, 234, 0.97)',
          },
        }}
      />
      <NextSectionButton />
    </section>
  )
}
