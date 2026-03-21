import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireSessionFromRequest } from './auth'

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const request = getRequest()
    const session = await requireSessionFromRequest(request)

    if (!session) {
      throw new Error('Unauthorized')
    }

    return next({
      context: {
        user: session.user,
        session,
      },
    })
  },
)
