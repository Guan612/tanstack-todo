import { createServerFn } from '@tanstack/react-start'
import { getCurrentSession } from '#/middleware/auth'
import { getRequest } from '@tanstack/react-start/server'

export const getCurrentSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await getCurrentSession(request)

    return session
  },
)
