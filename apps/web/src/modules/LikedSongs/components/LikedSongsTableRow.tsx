import { Button, Table } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { formatDateAdded } from '~/common/utils/formatDateAdded'
import { formatDuration } from '~/common/utils/formatDuration'
import { usePlayerStore } from '~/modules/MusicPlayer'
import {
  TrackLibraryControl,
  TrackRowInfo,
  TrackRowPlaybackControl,
  type Track,
} from '~/modules/Track'

interface LikedSongsTableRowProps {
  index: number
  track: Track
  tracks: Track[]
}

export const LikedSongsTableRow = ({ index, track, tracks }: LikedSongsTableRowProps) => {
  const handlePlay = () => {
    const { startContext } = usePlayerStore.getState()
    startContext(
      {
        type: 'liked-songs',
      },
      tracks,
      index,
    )
  }

  const addToQueue = () => {
    const { addToQueue } = usePlayerStore.getState()
    addToQueue({ id: crypto.randomUUID(), track })
  }

  return (
    <Table.Row
      key={track.id}
      className="group/track-row hover:bg-surface-tertiary"
      onDoubleClick={handlePlay}
    >
      <Table.Cell className="text-right tabular-nums">
        <TrackRowPlaybackControl position={index + 1} track={track} onPlay={handlePlay} />
      </Table.Cell>
      <Table.Cell>
        <TrackRowInfo track={track} />
      </Table.Cell>
      <Table.Cell>
        <Link
          to="/album/$id"
          params={{ id: track.album.id }}
          className="text-muted hover:text-foreground group-hover/track-row:text-foreground block w-fit max-w-full truncate hover:underline"
        >
          {track.album.name}
        </Link>
      </Table.Cell>
      <Table.Cell>{track?.likedAt ? formatDateAdded(track.likedAt) : '—'}</Table.Cell>
      <Table.Cell className="text-right">
        <TrackLibraryControl trackId={track.id} isLiked={false} />
      </Table.Cell>
      <Table.Cell className="text-right tabular-nums">
        {formatDuration(track.durationMs)}
      </Table.Cell>
      <Table.Cell>
        <Button onPress={addToQueue}>Add</Button>
      </Table.Cell>
    </Table.Row>
  )
}
