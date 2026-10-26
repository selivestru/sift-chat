import { Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

import { Show } from '~/common/ui/Show'
import { TrackLibraryControl } from '~/modules/Track'
import { TrackCover } from '~/modules/Track/components/TrackCover'

import { usePlayerStore } from '../stores/player.store'

export const TrackInfo = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)

  if (!currentTrack) return <div />

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-3">
      <TrackCover
        coverUrl={currentTrack.album.imageUrl}
        title={currentTrack.album.name}
        className="row-span-2 size-12"
      />
      <Link
        to="/album/$id"
        params={{ id: currentTrack.album.id }}
        className="w-fit truncate text-base font-medium hover:underline"
      >
        {currentTrack.name}
      </Link>
      <div className="text-muted truncate text-sm">
        {currentTrack.artists.map((artist, index) => (
          <Fragment key={artist.id}>
            <Link
              to="/artist/$id"
              params={{ id: artist.id }}
              className="hover:text-foreground hover:underline"
            >
              {artist.name}
            </Link>
            <Show when={index !== currentTrack.artists.length - 1}>{', '}</Show>
          </Fragment>
        ))}
      </div>
      <TrackLibraryControl trackId={currentTrack.id} likedAt={currentTrack.likedAt} />
    </div>
  )
}
