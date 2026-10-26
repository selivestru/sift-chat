import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type { Track } from '~/modules/Track'

import { getVolumeFromStorage } from '../utils/volume'

interface State {
  isPlaying: boolean
  currentTrack: Track | null
  currentTime: number | null
  volume: number
  previousVolume: number
}

interface Actions {
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTrack: (track: State['currentTrack']) => void
  setCurrentTime: (time: State['currentTime']) => void
  setVolume: (volume: number) => void
  setPreviousVolume: (volume: number) => void
}

type Store = State & Actions

export const usePlayerStore = create<Store>()(
  devtools(
    immer((set) => ({
      isPlaying: false,
      currentTrack: null,
      currentTime: null,
      volume: getVolumeFromStorage(),
      previousVolume: getVolumeFromStorage('previousVolume'),

      setIsPlaying: (isPlaying) => set({ isPlaying }, undefined, 'change is playing'),
      setCurrentTrack: (currentTrack) => set({ currentTrack }, undefined, 'change current track'),
      setCurrentTime: (currentTime) => set({ currentTime }, undefined, 'change current time'),
      setVolume: (volume) => set({ volume }, undefined, 'change volume'),
      setPreviousVolume: (volume) =>
        set({ previousVolume: volume }, undefined, 'change previous volume'),
    })),
    {
      name: 'player',
    },
  ),
)
