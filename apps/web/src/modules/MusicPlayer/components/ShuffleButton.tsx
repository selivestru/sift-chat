import { Button } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'

import { usePlayerStore } from '../stores/player.store'

export const ShuffleButton = () => {
  const isShuffleEnabled = usePlayerStore((state) => state.isShuffleEnabled)
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle)

  return (
    <Button
      isIconOnly
      aria-label="Shuffle"
      aria-pressed={isShuffleEnabled}
      variant="ghost"
      onPress={toggleShuffle}
      className={isShuffleEnabled ? 'text-accent' : undefined}
    >
      <Icon name="shuffle" className="size-5" />
    </Button>
  )
}
