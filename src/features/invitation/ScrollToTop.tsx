import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react'
import { Button } from '@/components/ui/button'

// Nút nổi lên đầu trang, ngay trên nút nhạc, cùng kiểu với nút nhạc (MusicToggle).
// Chỉ hiện khi đã cuộn qua bìa; hiện và ẩn bằng AnimatePresence của Motion.
export function ScrollToTop() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > window.innerHeight * 0.8))

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed right-4 bottom-20 z-(--layer-floating)"
        >
          <Button
            size="icon"
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
            aria-label="Lên đầu trang"
            className="size-12 rounded-full border-bronze/60 bg-cream text-bronze-deep shadow-md"
          >
            <ChevronUp aria-hidden="true" className="size-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
