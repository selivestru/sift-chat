import { Button } from '@heroui/react'
import { cn } from 'cn'
import { AddSquare, CheckSquare } from 'reicon-react'

interface TrackLibraryControlProps {
  trackId: string
  likedAt: string | null
}

export const TrackLibraryControl = ({ likedAt }: TrackLibraryControlProps) => {
  const Icon = likedAt ? CheckSquare : AddSquare

  return (
    <Button isIconOnly variant="ghost" size="md">
      <Icon
        weight={likedAt ? 'Filled' : 'Outline'}
        className={cn('size-5.5', {
          'text-accent': !!likedAt,
        })}
      />
    </Button>
  )
}
