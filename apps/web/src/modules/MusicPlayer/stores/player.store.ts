import { z } from 'zod'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { getStorageItem, setStorageItem } from '~/common/utils/storage'
import type { Track } from '~/modules/Track'

import { getVolumeFromStorage } from '../utils/volume'

const repeatModeSchema = z.enum(['off', 'all', 'one'])

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
  isShuffleEnabled: boolean
  contextOrder: { originalTracks: Track[]; positions: number[] } | null
  repeatMode: z.infer<typeof repeatModeSchema>
  currentTrack: CurrentTrack | null
  currentTime: number | null
  volume: number
  previousVolume: number
  queue: QueueItem[]
  context: PlaybackContext | null
}

interface Actions {
  setIsPlaying: (isPlaying: boolean) => void
  toggleShuffle: () => void
  cycleRepeatMode: () => void
  setCurrentTime: (time: State['currentTime']) => void
  setVolume: (volume: number) => void
  setPreviousVolume: (volume: number) => void
  addToQueue: (item: QueueItem) => void
  clearQueue: () => void
  removeFromQueue: (itemId: string) => void
  playQueueItem: (itemId: string) => void
  playContextTrack: (index: number) => void
  removeContextTrack: (index: number) => void
  setContext: (context: PlaybackContext | null) => void
  startContext: (source: PlaybackSource, tracks: Track[], startIndex: number) => void
  next: () => boolean
  previous: () => boolean
}

type Store = State & Actions

const shuffleSuffix = (context: PlaybackContext, positions: number[]) => {
  for (let i = context.tracks.length - 1; i > context.nextIndex; i--) {
    const j = context.nextIndex + Math.floor(Math.random() * (i - context.nextIndex + 1))
    ;[context.tracks[i], context.tracks[j]] = [context.tracks[j], context.tracks[i]]
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }
}

export const selectCanGoNext = (state: State) =>
  state.queue.length > 0 ||
  (state.context !== null &&
    (state.context.nextIndex < state.context.tracks.length ||
      (state.repeatMode === 'all' && state.context.tracks.length > 0)))

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
      isShuffleEnabled: getStorageItem('isShuffleEnabled', z.boolean(), false),
      contextOrder: null,
      repeatMode: getStorageItem('repeatMode', repeatModeSchema, 'off'),
      currentTrack: null,
      currentTime: null,
      volume: getVolumeFromStorage('volume'),
      previousVolume: getVolumeFromStorage('previousVolume'),
      queue: [],
      context: null,

      setIsPlaying: (isPlaying) => set({ isPlaying }, undefined, 'change is playing'),
      toggleShuffle: () =>
        set(
          (state) => {
            state.isShuffleEnabled = !state.isShuffleEnabled
            setStorageItem('isShuffleEnabled', state.isShuffleEnabled)
            if (!state.context) return

            if (state.isShuffleEnabled) {
              state.contextOrder = {
                originalTracks: [...state.context.tracks],
                positions: state.context.tracks.map((_, index) => index),
              }
              shuffleSuffix(state.context, state.contextOrder.positions)
            } else if (state.contextOrder) {
              const anchor = state.context.nextIndex - 1
              const originalIndex = anchor >= 0 ? state.contextOrder.positions[anchor] : -1
              state.context.tracks = state.contextOrder.originalTracks
              state.context.nextIndex = originalIndex + 1
              if (state.currentTrack && state.currentTrack.contextIndex !== null) {
                state.currentTrack.contextIndex = originalIndex
              }
              state.contextOrder = null
            }
          },
          undefined,
          'toggle shuffle',
        ),
      cycleRepeatMode: () =>
        set(
          (state) => {
            state.repeatMode =
              state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off'
            setStorageItem('repeatMode', state.repeatMode)
          },
          undefined,
          'cycle repeat mode',
        ),
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
      clearQueue: () => set({ queue: [] }, undefined, 'clear queue'),
      playQueueItem: (itemId) =>
        set(
          (state) => {
            const index = state.queue.findIndex((item) => item.id === itemId)
            if (index < 0) return
            const item = state.queue[index]
            state.queue.splice(0, index + 1)
            state.currentTrack = { ...item, contextIndex: null }
          },
          undefined,
          'play queue item',
        ),
      playContextTrack: (index) =>
        set(
          (state) => {
            if (
              !state.context ||
              index < state.context.nextIndex ||
              index >= state.context.tracks.length
            )
              return
            state.currentTrack = {
              id: crypto.randomUUID(),
              track: state.context.tracks[index],
              contextIndex: index,
            }
            state.context.nextIndex = index + 1
          },
          undefined,
          'play context track',
        ),
      removeContextTrack: (index) =>
        set(
          (state) => {
            if (
              !state.context ||
              !Number.isInteger(index) ||
              index < state.context.nextIndex ||
              index >= state.context.tracks.length
            )
              return

            state.context.tracks.splice(index, 1)
            if (state.contextOrder) {
              const originalIndex = state.contextOrder.positions[index]
              state.contextOrder.originalTracks.splice(originalIndex, 1)
              state.contextOrder.positions.splice(index, 1)
              state.contextOrder.positions = state.contextOrder.positions.map((position) =>
                position > originalIndex ? position - 1 : position,
              )
            }
          },
          undefined,
          'remove context track',
        ),
      setContext: (context) =>
        set(
          (state) => {
            state.context = context ? { ...context, tracks: [...context.tracks] } : null
            state.contextOrder = null
            if (context && state.isShuffleEnabled) {
              state.contextOrder = {
                originalTracks: [...context.tracks],
                positions: context.tracks.map((_, index) => index),
              }
              shuffleSuffix(state.context!, state.contextOrder.positions)
            }
          },
          undefined,
          'change playback context',
        ),
      startContext: (source, tracks, startIndex) =>
        set(
          (state) => {
            state.context = { source, tracks: [...tracks], nextIndex: startIndex + 1 }
            state.contextOrder = null
            if (state.isShuffleEnabled) {
              state.contextOrder = {
                originalTracks: [...tracks],
                positions: tracks.map((_, index) => index),
              }
              shuffleSuffix(state.context, state.contextOrder.positions)
            }
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

            if (state.context && state.context.nextIndex >= state.context.tracks.length) {
              if (state.repeatMode !== 'all' || state.context.tracks.length === 0) return
              state.context.nextIndex = 0
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
