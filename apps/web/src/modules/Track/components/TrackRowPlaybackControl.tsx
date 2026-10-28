import { Button } from '@heroui/react'
import { cn } from 'cn'

import { Equalizer } from '~/common/ui/Equalizer'
import { Icon } from '~/common/ui/Icon'
import { usePlayer, usePlayerStore } from '~/modules/MusicPlayer'
import type { PlaybackSource } from '~/modules/MusicPlayer/stores/player.store'

import { useIsCurrentTrack } from '../hooks/useIsCurrentTrack'
import type { Track } from '../types/track.types'

const hideOnInteraction = 'group-hover/track-row:hidden [@media(hover:none)]:hidden'

const showOnInteraction =
  'opacity-0 pointer-events-none group-hover/track-row:opacity-100 group-hover/track-row:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto'

interface TrackRowPlaybackControlProps {
  position: number
  track: Track
  source: PlaybackSource
  onPlay: () => void
}

export const TrackRowPlaybackControl = ({
  position,
  track,
  source,
  onPlay,
}: TrackRowPlaybackControlProps) => {
  const { play, pause } = usePlayer()

  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const isSelectedCurrentTrack = useIsCurrentTrack(track.id, source)
  const isPlayingCurrentTrack = isSelectedCurrentTrack && isPlaying
  const isPausedCurrentTrack = isSelectedCurrentTrack && !isPlaying

  const handleResume = () => {
    play()
  }

  const handlePause = () => {
    pause()
  }

  return (
    <div className="group/playback-control relative ml-auto size-4">
      {isPlayingCurrentTrack && (
        <Equalizer
          className={cn(
            'block',
            hideOnInteraction,
            'group-has-[button:focus-visible]/playback-control:hidden',
          )}
        />
      )}

      {(!isSelectedCurrentTrack || (isSelectedCurrentTrack && isPausedCurrentTrack)) && (
        <>
          <span
            className={cn(
              'block',
              hideOnInteraction,
              'group-has-[button:focus-visible]/playback-control:hidden',
              {
                'text-accent': isPausedCurrentTrack,
              },
            )}
          >
            {position}
          </span>
          <Button
            isIconOnly
            aria-label={`${isSelectedCurrentTrack ? 'Resume' : 'Play'} ${track.name}`}
            variant="ghost"
            className={cn('absolute top-1/2 -right-2.5 -translate-y-1/2', showOnInteraction)}
            onPress={isSelectedCurrentTrack ? handleResume : onPlay}
          >
            <Icon name="play" />
          </Button>
        </>
      )}

      {isPlayingCurrentTrack && (
        <Button
          isIconOnly
          aria-label={`Pause ${track.name}`}
          variant="ghost"
          className={cn('absolute top-1/2 -right-2.5 -translate-y-1/2', showOnInteraction)}
          onPress={handlePause}
        >
          <Icon name="pause" />
        </Button>
      )}
    </div>
  )
}
