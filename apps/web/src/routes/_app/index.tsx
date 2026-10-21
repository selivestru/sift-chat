import { createFileRoute } from '@tanstack/react-router'

import { usePlayerStore } from '~/modules/MusicPlayer'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <button
        onClick={() => {
          usePlayerStore.getState().setCurrentTrack({
            audioUrl: 'music-test/05 - Tom Olivier - Forever In My Heart.mp3',
          })
        }}
      >
        Track
      </button>
    </div>
  )
}
