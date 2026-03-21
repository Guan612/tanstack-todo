import { Button } from '#/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({ component: App })

function App() {
  const { data: session, isPending } = authClient.useSession()
  return (
    <>
      <div className="">
        <div className="font-bold text-2xl">Todo List</div>

        {session?.user ? (
          <div className="flex flex-col my-2">
            <p className="flex font-bold">
              欢迎回来, {session.user.name || session.user.email}
            </p>
            <div>
              <Link to={'/todo'}>
                <Button>添加代办事情</Button>
              </Link>
              <Button onClick={() => authClient.signOut()}>登出</Button>
            </div>
          </div>
        ) : (
          <div>
            <Link to="/auth/login">请先登录</Link>
          </div>
        )}
      </div>
    </>
  )
}
