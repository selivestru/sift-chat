import { Link } from '@tanstack/react-router'

import { usePlayerStore } from '~/modules/MusicPlayer'
import type { PlaybackSource } from '~/modules/MusicPlayer/stores/player.store'

import { QueueTrack } from './QueueTrack'

interface QueueSourceProps {
  source: PlaybackSource
}

const QueueSource = ({ source }: QueueSourceProps) => {
  switch (source.type) {
    case 'album':
      return (
        <Link to="/album/$id" params={{ id: source.id }} className="hover:underline">
          {source.name}
        </Link>
      )
    case 'liked-songs':
      return (
        <Link to="/liked-songs" className="hover:underline">
          Liked Songs
        </Link>
      )
    case 'playlist':
      return <span>{source.name}</span>
  }
}

export const QueueContext = () => {
  const context = usePlayerStore((state) => state.context)

  if (!context) return

  const tracks = context.tracks.slice(context.nextIndex)

  if (tracks.length === 0) return

  return (
    <section className="space-y-4">
      <h2 className="font-bold">
        Next from: <QueueSource source={context.source} />
      </h2>
      <div className="space-y-4">
        {tracks.map((track) => (
          <QueueTrack key={track.id} track={track} />
        ))}
      </div>
    </section>
  )
}
