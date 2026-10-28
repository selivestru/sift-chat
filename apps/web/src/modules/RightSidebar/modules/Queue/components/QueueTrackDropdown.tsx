import { Button, Dropdown, cn } from '@heroui/react'
import { useState, type Key } from 'react'

import { Icon } from '~/common/ui/Icon'

interface QueueTrackDropdownProps {
  trackName: string
  onRemove: () => void
}

export const QueueTrackDropdown = ({ trackName, onRemove }: QueueTrackDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (key: Key) => {
    if (key === 'remove') {
      onRemove()
    }
  }

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        isIconOnly
        variant="ghost"
        aria-label={`More options for ${trackName}`}
        className={cn(
          'text-muted opacity-0 group-hover/queue-track:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100',
          isOpen && 'opacity-100',
        )}
      >
        <Icon name="more" className="size-5" />
      </Button>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu onAction={handleAction}>
          <Dropdown.Item id="remove">Remove from queue</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
