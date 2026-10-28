import { Button } from '@heroui/react'
import { ArrowLeft2, ArrowRight2 } from 'reicon-react'

import { NowPlayingTrackInfo } from './NowPlayingTrackInfo'

interface NowPlayingSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const NowPlayingSidebar = ({ isCollapsed, onToggleCollapse }: NowPlayingSidebarProps) => {
  const ArrowIcon = isCollapsed ? ArrowLeft2 : ArrowRight2

  return (
    <div className="space-y-4 p-4">
      <Button isIconOnly variant="ghost" onPress={onToggleCollapse} aria-label="Toggle sidebar">
        <ArrowIcon className="size-6" />
      </Button>

      {!isCollapsed && <NowPlayingTrackInfo />}
    </div>
  )
}
