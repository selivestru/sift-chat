import { Button } from '@heroui/react'

import { usePlayerStore } from '~/modules/MusicPlayer'

import { QueueTrack } from './QueueTrack'

export const NextInQueue = () => {
  const queue = usePlayerStore((state) => state.queue)

  if (queue.length === 0) return

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold">Next in queue</h2>
        <Button variant="ghost" size="sm" onPress={() => usePlayerStore.getState().clearQueue()}>
          Clear queue
        </Button>
      </div>
      <div className="space-y-4">
        {queue.map((item) => (
          <QueueTrack
            key={item.id}
            track={item.track}
            onPlay={() => usePlayerStore.getState().playQueueItem(item.id)}
            onRemove={() => usePlayerStore.getState().removeFromQueue(item.id)}
          />
        ))}
      </div>
    </section>
  )
}
