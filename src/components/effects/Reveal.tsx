import type { ComponentProps } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'

// BlurFade bỏ phần blur: Safari không đưa `filter` lên compositor (motion.dev/docs/performance),
// mỗi khối giữ `filter` sau khi hiện làm cuộn bị giật trên iPhone và máy yếu.
// Chỉ còn opacity + transform, hai thuộc tính an toàn trên mọi thiết bị.
const FADE_UP = { hidden: { y: -6, opacity: 0 }, visible: { y: 0, opacity: 1 } }

export function Reveal(props: ComponentProps<typeof BlurFade>) {
  return <BlurFade variant={FADE_UP} {...props} />
}
