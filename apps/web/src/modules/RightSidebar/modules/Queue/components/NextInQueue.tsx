import { usePlayerStore } from '~/modules/MusicPlayer'

import { QueueTrack } from './QueueTrack'

export const NextInQueue = () => {
  const queue = usePlayerStore((state) => state.queue)

  if (queue.length === 0) return

  return (
    <section className="space-y-4">
      <h2 className="font-bold">Next in queue</h2>
      <div className="space-y-4">
        {queue.map((item) => (
          <QueueTrack
            key={item.id}
            track={item.track}
            onPlay={() => usePlayerStore.getState().playQueueItem(item.id)}
          />
        ))}
      </div>
    </section>
  )
}
