import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { currentUserOptions } from '~/common/constants/currentUserOptions'
import type { User } from '~/modules/User'

interface RouterContext {
  queryClient: QueryClient
  user: User | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query(currentUserOptions).catch(() => null)
    return { user }
  },
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}
