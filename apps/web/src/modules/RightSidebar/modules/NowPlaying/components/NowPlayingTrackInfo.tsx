import { Link } from '@tanstack/react-router'

import { ArtistLinks } from '~/modules/Artist'
import { usePlayerStore } from '~/modules/MusicPlayer'
import { TrackExplicitBadge, TrackLibraryControl } from '~/modules/Track'
import { TrackCover } from '~/modules/Track/components/TrackCover'

export const NowPlayingTrackInfo = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)

  if (!currentTrack) return

  const track = currentTrack.track

  return (
    <div className="space-y-4">
      <TrackCover coverUrl={track.album.imageUrl} title={track.album.name} className="w-full" />
      <div className="flex items-center justify-between gap-3">
        <div className="overflow-hidden">
          <Link
            to="/album/$id"
            params={{ id: track.album.id }}
            className="block truncate text-lg font-bold hover:underline"
          >
            {track.name}
          </Link>
          <div className="text-muted flex items-center gap-1 truncate text-sm">
            <TrackExplicitBadge explicit={track.explicit} />
            <ArtistLinks artists={track.artists} />
          </div>
        </div>
        <TrackLibraryControl trackId={track.id} isLiked={!!track.likedAt} />
      </div>
    </div>
  )
}
