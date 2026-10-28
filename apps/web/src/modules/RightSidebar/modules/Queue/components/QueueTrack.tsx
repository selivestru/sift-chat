import { cn } from 'cn'

import { ArtistLinks } from '~/modules/Artist'
import { TrackExplicitBadge, type Track } from '~/modules/Track'
import { TrackCover } from '~/modules/Track/components/TrackCover'

interface QueueTrackProps {
  track: Track
  isCurrent?: boolean
}

export const QueueTrack = ({ track, isCurrent = false }: QueueTrackProps) => (
  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
    <TrackCover
      coverUrl={track.album.imageUrl}
      title={track.album.name}
      className="size-12 rounded"
    />
    <div>
      <p
        className={cn('truncate font-medium', {
          'text-accent': isCurrent,
        })}
      >
        {track.name}
      </p>
      <div className="text-muted flex items-center gap-1 text-sm">
        <TrackExplicitBadge explicit={track.explicit} />
        <span className="truncate">
          <ArtistLinks artists={track.artists} />
        </span>
      </div>
    </div>
  </div>
)
