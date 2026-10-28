import { cn } from '@heroui/react'
import { useState } from 'react'

interface TrackCoverProps {
  coverUrl: string | null
  title: string
  className?: string
}

export const TrackCover = ({ coverUrl, title, className }: TrackCoverProps) => {
  const [failedCoverUrl, setFailedCoverUrl] = useState<string | null>(null)
  const shouldShowFallback = !coverUrl || failedCoverUrl === coverUrl

  if (shouldShowFallback) {
    return (
      <div
        role="img"
        aria-label={`${title} cover art unavailable`}
        className={cn('relative aspect-square w-full overflow-hidden bg-accent-muted', className)}
      >
        <div aria-hidden="true" className="bg-accent absolute inset-[12%] rounded-full">
          <span className="bg-accent-muted absolute top-1/2 left-1/2 size-[25%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <img
      src={coverUrl}
      alt={`${title} cover`}
      className={cn('aspect-square w-full object-cover', className)}
      onError={() => setFailedCoverUrl(coverUrl)}
    />
  )
}
