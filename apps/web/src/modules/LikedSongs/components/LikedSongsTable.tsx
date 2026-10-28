import { Link } from '@tanstack/react-router'

import { formatDateAdded } from '~/common/utils/formatDateAdded'
import { TrackTable, type Track, type TrackTableColumn } from '~/modules/Track'

const columns: TrackTableColumn[] = [
  {
    key: 'album',
    title: 'Album',
    className: 'w-1/4',
    render: (track) => (
      <Link
        to="/album/$id"
        params={{ id: track.album.id }}
        className="text-muted hover:text-foreground group-hover/track-row:text-foreground group-aria-selected/track-row:text-foreground block w-fit max-w-full truncate hover:underline"
      >
        {track.album.name}
      </Link>
    ),
  },
  {
    key: 'date-added',
    title: 'Date added',
    className: 'w-32',
    render: (track) => (track.likedAt ? formatDateAdded(track.likedAt) : '—'),
  },
]

interface LikedSongsTableProps {
  data: Track[]
}

export const LikedSongsTable = ({ data }: LikedSongsTableProps) => {
  return (
    <TrackTable
      tracks={data}
      source={{ type: 'liked-songs' }}
      ariaLabel="Liked songs table"
      columns={columns}
    />
  )
}
