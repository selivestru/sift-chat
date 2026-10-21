import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AuthShell } from '~/modules/Auth'

export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  )
}
