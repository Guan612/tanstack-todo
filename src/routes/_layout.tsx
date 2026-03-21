import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Outlet />
    </div>
  )
}
