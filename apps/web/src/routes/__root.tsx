import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { MusicPlayer, PlayerProvider } from '~/modules/MusicPlayer'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <PlayerProvider>
      <div className="grid h-dvh grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[minmax(0,1fr)_auto] overflow-hidden">
        {/* Left sidebar */}
        <aside className="border-r-border overflow-y-auto overscroll-contain border-r">
          Left sidebar
        </aside>

        {/* Main content */}
        <main className="overflow-y-auto overscroll-contain">
          <Outlet />
        </main>

        {/* Right sidebar */}
        <aside className="border-l-border overflow-y-auto overscroll-contain border-l">
          Right sidebar
        </aside>

        {/* Player */}
        <MusicPlayer />
      </div>
    </PlayerProvider>
  )
}
