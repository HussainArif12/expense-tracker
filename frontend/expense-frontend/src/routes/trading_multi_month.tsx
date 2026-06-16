import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trading_multi_month')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/trading_multi_month"!</div>
}
