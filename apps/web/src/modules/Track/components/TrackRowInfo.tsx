import { cn } from 'cn'

import { ArtistLinks } from '~/modules/Artist'
import type { PlaybackSource } from '~/modules/MusicPlayer/stores/player.store'

import { useIsCurrentTrack } from '../hooks/useIsCurrentTrack'
import type { Track } from '../types/track.types'
import { TrackCover } from './TrackCover'
import { TrackExplicitBadge } from './TrackExplicitBadge'

interface TrackRowInfoProps {
  track: Track
  source: PlaybackSource
}

export const TrackRowInfo = ({ track, source }: TrackRowInfoProps) => {
  const isSelectedCurrentTrack = useIsCurrentTrack(track.id, source)

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] items-center gap-x-3">
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
        <TrackExplicitBadge explicit={track.explicit} /> <ArtistLinks artists={track.artists} />
      </div>
    </div>
  )
}
