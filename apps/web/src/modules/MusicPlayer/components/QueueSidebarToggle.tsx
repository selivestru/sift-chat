import { Button } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'
import { useQueueSidebar } from '~/modules/RightSidebar/modules/Queue'

import { usePlayerStore } from '../stores/player.store'

export const QueueSidebarToggle = () => {
  const { isOpen, toggle } = useQueueSidebar()
  const currentTrack = usePlayerStore((state) => state.currentTrack)

  return (
    <Button
      isIconOnly
      variant="ghost"
      aria-label={isOpen ? 'Close queue' : 'Open queue'}
      onPress={toggle}
      className="relative"
      isDisabled={!currentTrack}
    >
      <Icon name="queue" className={isOpen ? 'text-accent' : undefined} />
    </Button>
  )
}
