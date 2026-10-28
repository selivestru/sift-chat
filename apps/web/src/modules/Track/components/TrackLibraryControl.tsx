import { Button } from '@heroui/react'
import { cn } from 'cn'
import type { MouseEvent } from 'react'
import { useState } from 'react'

interface TrackLibraryControlProps {
  trackId: string
  isLiked: boolean
}

export const TrackLibraryControl = ({ isLiked: initialIsLiked }: TrackLibraryControlProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)

  const handlePress = () => {
    setIsLiked((previous) => !previous)
  }

  const handleStopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Button
      isIconOnly
      aria-label="Save track to library"
      aria-pressed={isLiked}
      variant="ghost"
      size="md"
      className="shrink-0"
      onPress={handlePress}
      onDoubleClick={handleStopPropagation}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5.5"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          className={cn(
            'transition-[fill,stroke] duration-200 ease-out motion-reduce:transition-none',
            isLiked ? 'fill-accent stroke-accent' : 'fill-transparent stroke-white',
          )}
        />
        <path
          d="M8 12h8M12 8v8"
          className={cn(
            'origin-center stroke-white transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none',
            isLiked ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <path
          d="m8 12 2.5 2.5L16 9"
          className={cn(
            'origin-center stroke-accent-foreground transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none',
            isLiked ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
      </svg>
    </Button>
  )
}
