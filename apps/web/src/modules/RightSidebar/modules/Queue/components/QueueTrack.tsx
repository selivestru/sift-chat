import { Button, cn } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'
import { ArtistLinks } from '~/modules/Artist'
import { TrackExplicitBadge, type Track } from '~/modules/Track'
import { TrackCover } from '~/modules/Track/components/TrackCover'

import { QueueTrackDropdown } from './QueueTrackDropdown'

interface QueueTrackProps {
  track: Track
  isCurrent?: boolean
  isPlaying?: boolean
  onPlay: () => void
  onRemove?: () => void
}

export const QueueTrack = ({
  track,
  isCurrent = false,
  isPlaying = false,
  onPlay,
  onRemove,
}: QueueTrackProps) => (
  <div className="group/queue-track hover:bg-surface-tertiary focus-within:bg-surface-tertiary grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-2">
    <div className="relative size-12">
      <TrackCover coverUrl={track.album.imageUrl} title={track.album.name} className="size-12" />
      <Button
        isIconOnly
        variant="ghost"
        aria-label={`${isCurrent && isPlaying ? 'Pause' : 'Play'} ${track.name}`}
        onPress={onPlay}
        className="absolute inset-0 size-full bg-black/60 text-white opacity-0 group-hover/queue-track:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <Icon name={isCurrent && isPlaying ? 'pause' : 'play'} />
      </Button>
    </div>
    <div>
      <p
        className={cn('truncate font-medium', {
          'text-accent': isCurrent,
        })}
      >
        {track.name}
      </p>
      <div className="text-muted group-hover/queue-track:text-foreground flex items-center gap-1 text-sm">
        <TrackExplicitBadge explicit={track.explicit} />
        <ArtistLinks artists={track.artists} />
      </div>
    </div>
    {onRemove && <QueueTrackDropdown trackName={track.name} onRemove={onRemove} />}
  </div>
)
