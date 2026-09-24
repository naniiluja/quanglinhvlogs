import { useContext } from 'react'
import { MusicContext, type MusicState } from '@/features/invitation/musicContext'

export function useMusic(): MusicState {
  const value = useContext(MusicContext)
  if (!value) throw new Error('useMusic phải nằm trong MusicProvider')
  return value
}
