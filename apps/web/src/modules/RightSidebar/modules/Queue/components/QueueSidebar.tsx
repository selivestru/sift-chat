import { Button } from '@heroui/react'
import { X } from 'reicon-react'

import { useQueueSidebar } from '../hooks/useQueueSidebar'
import { NextInQueue } from './NextInQueue'
import { NowPlaying } from './NowPlaying'
import { QueueContext } from './QueueContext'

export const QueueSidebar = () => {
  const { toggle } = useQueueSidebar()

  return (
    <div className="space-y-8 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Queue</h1>

        <Button isIconOnly variant="ghost" onPress={toggle} aria-label="Close queue">
          <X className="size-5" />
        </Button>
      </header>

      <NowPlaying />

      <NextInQueue />

      <QueueContext />
    </div>
  )
}
