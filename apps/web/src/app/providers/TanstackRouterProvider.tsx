import { useQueryClient } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from '../routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
    user: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const TanstackRouterProvider = () => {
  const queryClient = useQueryClient()

  return <RouterProvider router={router} context={{ queryClient }} />
}
