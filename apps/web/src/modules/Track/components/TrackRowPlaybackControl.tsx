import { Button } from '@heroui/react'
import { cn } from 'cn'
import { Pause, Play } from 'reicon-react'

import { Equalizer } from '~/common/ui/Equalizer'
import { usePlayer, usePlayerStore } from '~/modules/MusicPlayer'

import type { Track } from '../types/track.types'

const hideOnInteraction =
  'group-hover/track-row:hidden group-focus-within/track-row:hidden [@media(hover:none)]:hidden'

const showOnInteraction =
  'opacity-0 pointer-events-none group-hover/track-row:opacity-100 group-hover/track-row:pointer-events-auto group-focus-within/track-row:opacity-100 group-focus-within/track-row:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto'

interface TrackRowPlaybackControlProps {
  position: number
  track: Track
}

export const TrackRowPlaybackControl = ({ position, track }: TrackRowPlaybackControlProps) => {
  const { play, pause } = usePlayer()

  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const currentTrack = usePlayerStore((state) => state.currentTrack)

  const isSelectedCurrentTrack = currentTrack && currentTrack.id === track.id
  const isPlayingCurrentTrack = isSelectedCurrentTrack && isPlaying
  const isPausedCurrentTrack = isSelectedCurrentTrack && !isPlaying

  const handlePlay = () => {
    const { setCurrentTrack } = usePlayerStore.getState()

    setCurrentTrack({
      id: track.id,
      audioUrl: track.audioUrl,
    })
  }

  const handleResume = () => {
    play()
  }

  const handlePause = () => {
    pause()
  }

  return (
    <div className="relative ml-auto size-4">
      {isPlayingCurrentTrack && <Equalizer className={cn('block', hideOnInteraction)} />}

      {(!isSelectedCurrentTrack || (isSelectedCurrentTrack && isPausedCurrentTrack)) && (
        <>
          <span
            className={cn('block', hideOnInteraction, {
              'text-accent': isPausedCurrentTrack,
            })}
          >
            {position}
          </span>
          <Button
            isIconOnly
            aria-label={`${isSelectedCurrentTrack ? 'Resume' : 'Play'} ${track.name}`}
            variant="ghost"
            className={cn('absolute top-1/2 -right-2.5 -translate-y-1/2', showOnInteraction)}
            onPress={isSelectedCurrentTrack ? handleResume : handlePlay}
          >
            <Play weight="Filled" />
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
          <Pause weight="Filled" />
        </Button>
      )}
    </div>
  )
}
