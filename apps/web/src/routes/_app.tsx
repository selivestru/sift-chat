import { createFileRoute, Outlet } from '@tanstack/react-router'

import { LeftSidebar } from '~/modules/LeftSidebar'
import { MusicPlayer, PlayerProvider } from '~/modules/MusicPlayer'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PlayerProvider>
      <div className="grid h-svh grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[minmax(0,1fr)_auto] overflow-hidden">
        <LeftSidebar />

        {/* Main content */}
        <main className="scrollbar-thin overflow-y-auto overscroll-contain">
          <Outlet />
        </main>

        {/* Right sidebar */}
        <aside className="border-l-border w-[300px] overflow-y-auto overscroll-contain border-l"></aside>

        {/* Player */}
        <MusicPlayer />
      </div>
    </PlayerProvider>
  )
}
