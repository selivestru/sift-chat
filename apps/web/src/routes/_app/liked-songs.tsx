import { createFileRoute } from '@tanstack/react-router'

import { LikedSongs } from '~/modules/LikedSongs'

export const Route = createFileRoute('/_app/liked-songs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LikedSongs />
}
