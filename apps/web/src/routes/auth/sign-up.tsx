import { createFileRoute } from '@tanstack/react-router'

import { SignUpForm } from '~/modules/Auth'

export const Route = createFileRoute('/auth/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignUpForm />
}
