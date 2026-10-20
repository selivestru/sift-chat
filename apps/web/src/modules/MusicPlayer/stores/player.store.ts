import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { getVolumeFromStorage } from '../utils/volume'

interface State {
  isPlaying: boolean
  currentTrack: {
    audioUrl: string
  } | null
  currentTime: number | null
  volume: number
}

interface Actions {
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTrack: (track: State['currentTrack']) => void
  setCurrentTime: (time: State['currentTime']) => void
  setVolume: (volume: number) => void
}

type Store = State & Actions

export const usePlayerStore = create<Store>()(
  immer((set) => ({
    isPlaying: false,
    currentTrack: null,
    currentTime: null,
    volume: getVolumeFromStorage(),

    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentTrack: (currentTrack: State['currentTrack']) => set({ currentTrack }),
    setCurrentTime: (currentTime: State['currentTime']) => set({ currentTime }),
    setVolume: (volume: number) => set({ volume }),
  })),
)
