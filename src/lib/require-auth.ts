import { normalizeRedirect } from '#/lib/auth-redirect'
import { getCurrentSessionFn } from '#/serverfn/auth/session.serverfn'
import { redirect } from '@tanstack/react-router'

export async function requireAuth(locationHref: string) {
  const session = await getCurrentSessionFn()

  if (!session?.user) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: normalizeRedirect(locationHref),
      },
    })
  }
}
