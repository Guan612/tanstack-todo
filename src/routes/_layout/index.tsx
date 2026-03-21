import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({ component: App })

function App() {
  return (
    <>
      <div className="">
        <div className="font-bold text-2xl">Todo List</div>
      </div>
    </>
  )
}
