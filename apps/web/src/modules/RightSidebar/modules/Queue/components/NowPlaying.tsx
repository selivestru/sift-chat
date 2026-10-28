import { usePlayer, usePlayerStore } from '~/modules/MusicPlayer'

import { QueueTrack } from './QueueTrack'

export const NowPlaying = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const { play, pause } = usePlayer()

  return (
    <section className="space-y-4">
      <h2 className="font-bold">Now playing</h2>
      {currentTrack ? (
        <QueueTrack
          track={currentTrack.track}
          isCurrent
          isPlaying={isPlaying}
          onPlay={isPlaying ? pause : play}
        />
      ) : (
        <p className="text-muted text-sm">No track playing</p>
      )}
    </section>
  )
}
