import { createPageHead } from '#/lib/page-head'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sub/todo/')({
  head: createPageHead('代办事项'),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_sub/todo/"!</div>
}
