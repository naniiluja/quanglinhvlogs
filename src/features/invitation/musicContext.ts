import { createContext } from 'react'

export interface MusicState {
  // Phản ánh trạng thái phát thật của thẻ audio, không phải mong muốn.
  playing: boolean
  // Chỉ gọi trong handler của thao tác người dùng (chính sách autoplay).
  start: () => void
  toggle: () => void
}

export const MusicContext = createContext<MusicState | null>(null)
