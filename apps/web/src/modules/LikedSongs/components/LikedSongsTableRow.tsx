import { Table } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { useState } from 'react'

import { Show } from '~/common/ui/Show'
import { formatDateAdded } from '~/common/utils/formatDateAdded'
import { formatDuration } from '~/common/utils/formatDuration'
import { usePlayer, usePlayerStore } from '~/modules/MusicPlayer'
import {
  TrackLibraryControl,
  TrackRowInfo,
  TrackRowPlaybackControl,
  type Track,
} from '~/modules/Track'

interface LikedSongsTableRowProps {
  track: Track
  index: number
}

export const LikedSongsTableRow = ({ track, index }: LikedSongsTableRowProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const { seek } = usePlayer()

  const handlePlay = () => {
    const { setCurrentTrack } = usePlayerStore.getState()
    setCurrentTrack(track)
    seek(0)
  }

  return (
    <Table.Row
      key={track.id}
      className={cn('group/track-row', {
        'hover:bg-surface-tertiary': isHovered,
      })}
      onDoubleClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Table.Cell className="text-right tabular-nums">
        <TrackRowPlaybackControl position={index + 1} track={track} />
      </Table.Cell>
      <Table.Cell>
        <TrackRowInfo track={track} />
      </Table.Cell>
      <Table.Cell>
        <Link
          to="/album/$id"
          params={{ id: track.album.id }}
          className="text-muted hover:text-foreground group-hover/track-row:text-foreground block w-fit truncate hover:underline"
        >
          {track.album.name}
        </Link>
      </Table.Cell>
      <Table.Cell>{track?.likedAt ? formatDateAdded(track.likedAt) : '—'}</Table.Cell>
      <Table.Cell className="text-right">
        <Show when={isHovered}>
          <TrackLibraryControl trackId={track.id} likedAt={null} />
        </Show>
      </Table.Cell>
      <Table.Cell className="text-right tabular-nums">
        {formatDuration(track.durationMs)}
      </Table.Cell>
    </Table.Row>
  )
}
