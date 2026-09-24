import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { WEDDING } from '@/config/wedding'
import { MusicContext } from '@/features/invitation/musicContext'
import { log } from '@/lib/log'

const VOLUME = 0.45

// Context duy nhất của phần nhạc (state-management.md). Chính sách autoplay:
// developer.chrome.com/blog/autoplay, chỉ phát sau thao tác của người dùng.
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const wantsMusic = useRef(false)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = VOLUME
    // Promise bị từ chối (chặn autoplay, lỗi tải): giữ trạng thái tắt, thiệp vẫn chạy bình thường.
    audio.play().catch((error: unknown) => {
      log.warn('music.play.rejected', {
        error: error instanceof Error ? error.name : String(error),
      })
    })
  }, [])

  const start = useCallback(() => {
    wantsMusic.current = true
    play()
  }, [play])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      start()
    } else {
      wantsMusic.current = false
      audio.pause()
    }
  }, [start])

  useEffect(() => {
    // Ẩn trang thì tạm dừng; quay lại chỉ phát tiếp nếu khách chưa tắt.
    function onVisibility() {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) audio.pause()
      else if (wantsMusic.current) play()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [play])

  const value = useMemo(() => ({ playing, start, toggle }), [playing, start, toggle])

  return (
    <MusicContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={WEDDING.music.src}
        preload="none"
        loop
        // `playing` chỉ bắn khi âm thanh chạy thật (sau khi tải xong), không phải lúc vừa gọi play().
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setPlaying(false)}
        onError={() => {
          setPlaying(false)
          log.warn('music.load.error')
        }}
      />
      {children}
    </MusicContext.Provider>
  )
}
