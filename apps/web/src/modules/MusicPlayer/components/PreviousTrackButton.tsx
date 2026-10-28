import { Button } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'

import { selectCanGoPrevious, usePlayerStore } from '../stores/player.store'

export const PreviousTrackButton = () => {
  const canGoPrevious = usePlayerStore(selectCanGoPrevious)

  const handlePreviousTrack = () => {
    const { previous } = usePlayerStore.getState()
    previous()
  }

  return (
    <Button
      isIconOnly
      aria-label="Previous track"
      variant="ghost"
      onPress={handlePreviousTrack}
      isDisabled={!canGoPrevious}
    >
      <Icon name="previous" />
    </Button>
  )
}
