import { auth } from '#/lib/auth'

export async function requireSessionFromRequest(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  return session ?? null
}

export async function getUserFromRequest(request: Request) {
  const session = await requireSessionFromRequest(request)

  return session?.user ?? null
}
