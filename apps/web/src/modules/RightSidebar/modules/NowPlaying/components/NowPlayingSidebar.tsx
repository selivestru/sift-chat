import { Button } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'

import { NowPlayingTrackInfo } from './NowPlayingTrackInfo'

interface NowPlayingSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const NowPlayingSidebar = ({ isCollapsed, onToggleCollapse }: NowPlayingSidebarProps) => {
  return (
    <div className="space-y-4 p-4">
      <Button isIconOnly variant="ghost" onPress={onToggleCollapse} aria-label="Toggle sidebar">
        <Icon name={isCollapsed ? 'chevron-left' : 'chevron-right'} />
      </Button>

      {!isCollapsed && <NowPlayingTrackInfo />}
    </div>
  )
}
