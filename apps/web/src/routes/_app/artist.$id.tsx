import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/artist/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/artist/$id"!</div>
}
