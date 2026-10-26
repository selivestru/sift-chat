import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { Fragment } from 'react/jsx-runtime'

import { Show } from '~/common/ui/Show'
import { usePlayerStore } from '~/modules/MusicPlayer'

import type { Track } from '../types/track.types'
import { TrackCover } from './TrackCover'

interface TrackRowInfoProps {
  track: Track
}

export const TrackRowInfo = ({ track }: TrackRowInfoProps) => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)

  const isSelectedCurrentTrack = currentTrack && currentTrack.id === track.id

  return (
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] grid-rows-[auto_auto] items-center gap-x-3">
      <TrackCover
        coverUrl={track.album.imageUrl}
        title={track.album.name}
        className="row-span-2 size-10"
      />
      <span
        className={cn('truncate text-base font-medium', {
          'text-accent': isSelectedCurrentTrack,
        })}
      >
        {track.name}
      </span>
      <div className="text-muted group-hover/track-row:text-foreground truncate">
        {track.artists.map((artist, index) => (
          <Fragment key={artist.id}>
            <Link
              to="/artist/$id"
              params={{ id: artist.id }}
              className="hover:text-foreground hover:underline"
            >
              {artist.name}
            </Link>
            <Show when={index !== track.artists.length - 1}>{', '}</Show>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
