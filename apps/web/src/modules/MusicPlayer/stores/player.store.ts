import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type { Track } from '~/modules/Track'

import { getVolumeFromStorage } from '../utils/volume'

export type PlaybackSource =
  | { type: 'playlist'; id: string; name: string }
  | { type: 'album'; id: string; name: string }
  | { type: 'liked-songs' }

interface PlaybackContext {
  source: PlaybackSource
  tracks: Track[]
  nextIndex: number
}

interface QueueItem {
  id: string
  track: Track
}

interface CurrentTrack extends QueueItem {
  contextIndex: number | null
}

interface State {
  isPlaying: boolean
  currentTrack: CurrentTrack | null
  currentTime: number | null
  volume: number
  previousVolume: number
  queue: QueueItem[]
  context: PlaybackContext | null
}

interface Actions {
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTime: (time: State['currentTime']) => void
  setVolume: (volume: number) => void
  setPreviousVolume: (volume: number) => void
  addToQueue: (item: QueueItem) => void
  removeFromQueue: (itemId: string) => void
  setContext: (context: PlaybackContext | null) => void
  startContext: (source: PlaybackSource, tracks: Track[], startIndex: number) => void
  next: () => boolean
  previous: () => boolean
}

type Store = State & Actions

export const selectCanGoNext = (state: State) =>
  state.queue.length > 0 ||
  (state.context !== null && state.context.nextIndex < state.context.tracks.length)

const getPreviousContextIndex = (state: State) => {
  if (!state.context || !state.currentTrack) return null

  const previousIndex =
    state.currentTrack.contextIndex === null
      ? state.context.nextIndex - 1
      : state.currentTrack.contextIndex - 1

  return previousIndex >= 0 ? previousIndex : null
}

export const selectCanGoPrevious = (state: State) => getPreviousContextIndex(state) !== null

export const usePlayerStore = create<Store>()(
  devtools(
    immer((set) => ({
      isPlaying: false,
      currentTrack: null,
      currentTime: null,
      volume: getVolumeFromStorage('volume'),
      previousVolume: getVolumeFromStorage('previousVolume'),
      queue: [],
      context: null,

      setIsPlaying: (isPlaying) => set({ isPlaying }, undefined, 'change is playing'),
      setCurrentTime: (currentTime) => set({ currentTime }, undefined, 'change current time'),
      setVolume: (volume) => set({ volume }, undefined, 'change volume'),
      setPreviousVolume: (volume) =>
        set({ previousVolume: volume }, undefined, 'change previous volume'),
      addToQueue: (item) =>
        set(
          (state) => {
            state.queue.push(item)
          },
          undefined,
          'add to queue',
        ),
      removeFromQueue: (itemId) =>
        set(
          (state) => {
            state.queue = state.queue.filter((item) => item.id !== itemId)
          },
          undefined,
          'remove from queue',
        ),
      setContext: (context) => set({ context }, undefined, 'change playback context'),
      startContext: (source, tracks, startIndex) =>
        set(
          (state) => {
            state.context = { source, tracks, nextIndex: startIndex + 1 }
            state.currentTrack = {
              id: crypto.randomUUID(),
              track: tracks[startIndex],
              contextIndex: startIndex,
            }
          },
          undefined,
          'start playback context',
        ),
      next: () => {
        let advanced = false
        set(
          (state) => {
            if (state.queue.length > 0) {
              const firstTrack = state.queue.shift()!
              state.currentTrack = { ...firstTrack, contextIndex: null }
              advanced = true
              return
            }

            if (state.context && state.context.nextIndex < state.context.tracks.length) {
              const nextTrack = state.context.tracks[state.context.nextIndex]
              state.currentTrack = {
                id: crypto.randomUUID(),
                track: nextTrack,
                contextIndex: state.context.nextIndex,
              }
              state.context.nextIndex += 1
              advanced = true
            }
          },
          undefined,
          'next track',
        )
        return advanced
      },
      previous: () => {
        let moved = false
        set(
          (state) => {
            const previousIndex = getPreviousContextIndex(state)
            if (previousIndex === null || !state.context) return

            state.currentTrack = {
              id: crypto.randomUUID(),
              track: state.context.tracks[previousIndex],
              contextIndex: previousIndex,
            }
            state.context.nextIndex = previousIndex + 1
            moved = true
          },
          undefined,
          'previous track',
        )
        return moved
      },
    })),
    {
      name: 'player',
    },
  ),
)
