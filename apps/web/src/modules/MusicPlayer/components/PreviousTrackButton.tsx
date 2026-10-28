import { Button } from '@heroui/react'
import { Previous } from 'reicon-react'

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
      <Previous weight="Filled" className="size-5" />
    </Button>
  )
}
