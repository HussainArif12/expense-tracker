import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sparkasse_multi_month')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sparkasse_multi_month"!</div>
}
