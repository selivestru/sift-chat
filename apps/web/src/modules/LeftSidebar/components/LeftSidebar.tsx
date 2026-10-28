import { Button, Separator, cn } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { Icon } from '~/common/ui/Icon'

import { Navigation } from './Navigation'

export const LeftSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'border-r-border space-y-4 overflow-y-auto overscroll-contain border-r p-4',
        isCollapsed ? 'w-20' : 'w-75',
      )}
    >
      <div
        className={cn(
          'flex items-center',
          isCollapsed ? 'flex-col-reverse gap-2' : 'justify-between',
        )}
      >
        <Link to="/" aria-label="Siftify home" className="flex items-center gap-2">
          <img className={isCollapsed ? 'w-12' : 'w-15'} src="/assets/images/logo.png" alt="" />
          {!isCollapsed && <span className="text-3xl font-bold">Siftify</span>}
        </Link>
        <Button
          isIconOnly
          variant="ghost"
          onPress={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} />
        </Button>
      </div>
      <Separator />
      <Navigation isCollapsed={isCollapsed} />
      <Separator />
    </aside>
  )
}
