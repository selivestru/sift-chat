import { Button } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'

import { usePlayer } from '../hooks/usePlayer'
import { usePlayerStore } from '../stores/player.store'

export const PlayPauseButton = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)

  const { play, pause } = usePlayer()

  const toggleIsPlaying = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  return (
    <Button
      isIconOnly
      aria-label={isPlaying ? 'Pause' : 'Play'}
      variant="ghost"
      onPress={toggleIsPlaying}
      isDisabled={!currentTrack}
    >
      <Icon name={isPlaying ? 'pause' : 'play'} />
    </Button>
  )
}
