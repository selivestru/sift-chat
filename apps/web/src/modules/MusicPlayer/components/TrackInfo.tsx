import { Link } from '@tanstack/react-router'

import { ArtistLinks } from '~/modules/Artist'
import { TrackExplicitBadge, TrackLibraryControl } from '~/modules/Track'
import { TrackCover } from '~/modules/Track/components/TrackCover'

import { usePlayerStore } from '../stores/player.store'

export const TrackInfo = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)

  if (!currentTrack) return <div />

  const track = currentTrack.track

  return (
    <div className="grid grid-cols-[auto_minmax(0,max-content)_auto] items-center justify-start gap-x-3">
      <TrackCover coverUrl={track.album.imageUrl} title={track.album.name} className="size-12" />
      <div>
        <Link
          to="/album/$id"
          params={{ id: track.album.id }}
          className="block max-w-full truncate text-base font-medium hover:underline"
        >
          {track.name}
        </Link>
        <div className="text-muted truncate text-sm">
          <TrackExplicitBadge explicit={track.explicit} /> <ArtistLinks artists={track.artists} />
        </div>
      </div>
      <TrackLibraryControl trackId={track.id} isLiked={!!track.likedAt} />
    </div>
  )
}
