import { cn } from '@heroui/react'
import { useEffect, useState } from 'react'

import { NowPlayingSidebar } from '../modules/NowPlaying'
import { QueueSidebar, useQueueSidebar } from '../modules/Queue'

export const RightSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { isOpen } = useQueueSidebar()

  useEffect(() => {
    if (isOpen && isCollapsed) {
      // oxlint-disable-next-line react/set-state-in-effect
      setIsCollapsed(false)
    }
  }, [isCollapsed, isOpen, setIsCollapsed])

  return (
    <aside
      className={cn(
        'border-l-border overflow-y-auto overscroll-contain border-l',
        isCollapsed ? 'w-fit content-center' : 'w-100',
      )}
    >
      {isOpen ? (
        <QueueSidebar />
      ) : (
        <NowPlayingSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      )}
    </aside>
  )
}
