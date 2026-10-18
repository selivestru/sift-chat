import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface State {
  isPlaying: boolean
  currentTrack: {
    audioUrl: string
  } | null
  currentTime: number | null
}

interface Actions {
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTrack: (track: State['currentTrack']) => void
  setCurrentTime: (time: State['currentTime']) => void
}

type Store = State & Actions

export const usePlayerStore = create<Store>()(
  immer((set) => ({
    isPlaying: false,
    currentTrack: null,
    currentTime: null,

    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentTrack: (currentTrack: State['currentTrack']) => set({ currentTrack }),
    setCurrentTime: (currentTime: State['currentTime']) => set({ currentTime }),
  })),
)
