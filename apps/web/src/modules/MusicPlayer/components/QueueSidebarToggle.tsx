import { Button, cn } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'
import { Show } from '~/common/ui/Show'
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
      <Icon name="queue" className={cn('size-6', isOpen && 'text-accent')} />
      <Show when={isOpen}>
        <span className="bg-accent absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full" />
      </Show>
    </Button>
  )
}
