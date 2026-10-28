import { Button } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'

import { selectCanGoNext, usePlayerStore } from '../stores/player.store'

export const NextTrackButton = () => {
  const canGoNext = usePlayerStore(selectCanGoNext)

  const handleNextTrack = () => {
    const { next } = usePlayerStore.getState()
    next()
  }

  return (
    <Button
      isIconOnly
      aria-label="Next track"
      variant="ghost"
      onPress={handleNextTrack}
      isDisabled={!canGoNext}
    >
      <Icon name="next" />
    </Button>
  )
}
