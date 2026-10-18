import { Button } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

import { usePlayerStore } from '~/modules/MusicPlayer'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Button
        onPress={() => {
          usePlayerStore.getState().setCurrentTrack({
            audioUrl: 'test.mp3',
          })
        }}
      >
        Track
      </Button>
    </div>
  )
}
