import { Button, Dropdown, cn } from '@heroui/react'
import { useState, type Key } from 'react'

import { Icon } from '~/common/ui/Icon'
import { usePlayerStore } from '~/modules/MusicPlayer'

import type { Track } from '../types/track.types'

interface TrackActionsDropdownProps {
  track: Track
  onOpen: () => void
}

export const TrackActionsDropdown = ({ track, onOpen }: TrackActionsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) onOpen()
  }

  const handleAction = (key: Key) => {
    if (key === 'add') {
      usePlayerStore.getState().addToQueue({ id: crypto.randomUUID(), track })
    }
  }

  return (
    <div onDoubleClick={(event) => event.stopPropagation()} className="w-fit">
      <Dropdown isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Button
          isIconOnly
          variant="ghost"
          aria-label={`More options for ${track.name}`}
          className={cn(
            'text-muted opacity-0 group-hover/track-row:opacity-100 group-data-[selected=true]/track-row:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100',
            isOpen && 'opacity-100',
          )}
        >
          <Icon name="more" className="size-5" />
        </Button>
        <Dropdown.Popover placement="bottom end" data-track-actions-id={track.id}>
          <Dropdown.Menu onAction={handleAction}>
            <Dropdown.Item id="add">Add to queue</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  )
}
