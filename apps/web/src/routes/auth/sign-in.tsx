import { createFileRoute } from '@tanstack/react-router'

import { SignInForm } from '~/modules/Auth'

export const Route = createFileRoute('/auth/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInForm />
}
