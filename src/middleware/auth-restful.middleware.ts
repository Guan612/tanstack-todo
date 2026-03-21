import { createMiddleware } from '@tanstack/react-start'
import { requireSessionFromRequest } from './auth'

export const authRouteMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await requireSessionFromRequest(request)

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return next({
      context: {
        user: session.user,
        session,
      },
    })
  },
)
