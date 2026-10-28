import { usePlayerStore } from '~/modules/MusicPlayer'
import type { PlaybackSource } from '~/modules/MusicPlayer/stores/player.store'

export const useIsCurrentTrack = (trackId: string, source: PlaybackSource) =>
  usePlayerStore((state) => {
    if (state.currentTrack?.track.id !== trackId) return false
    if (state.currentTrack.contextIndex === null) return true

    const currentSource = state.context?.source
    if (!currentSource || currentSource.type !== source.type) return false
    return (
      source.type === 'liked-songs' ||
      (currentSource.type !== 'liked-songs' && currentSource.id === source.id)
    )
  })
