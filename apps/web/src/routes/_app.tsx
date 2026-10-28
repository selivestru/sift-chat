import { createFileRoute, Outlet } from '@tanstack/react-router'

import { LeftSidebar } from '~/modules/LeftSidebar'
import { MusicPlayer, PlayerProvider } from '~/modules/MusicPlayer'
import { RightSidebar } from '~/modules/RightSidebar'
import { QueueSidebarProvider } from '~/modules/RightSidebar/modules/Queue'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PlayerProvider>
      <QueueSidebarProvider>
        <div className="grid h-svh grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[minmax(0,1fr)_auto] overflow-hidden">
          <LeftSidebar />

          <main className="scrollbar-thin overflow-y-auto overscroll-contain">
            <Outlet />
          </main>

          <RightSidebar />

          <MusicPlayer />
        </div>
      </QueueSidebarProvider>
    </PlayerProvider>
  )
}
