import { Music, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMusic } from '@/hooks/useMusic'

export function MusicToggle() {
  const { playing, toggle } = useMusic()
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      className="fixed right-4 bottom-4 z-(--layer-floating) size-12 rounded-full border-bronze/60 bg-cream/90 text-bronze shadow-md backdrop-blur"
    >
      {playing ? <Music aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
    </Button>
  )
}
