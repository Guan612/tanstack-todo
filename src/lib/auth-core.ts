import { auth } from '@/lib/auth'

// 这个函数是纯净的，只依赖标准的 Web Request
export async function validateUser(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return null
  }

  return session.user
}
