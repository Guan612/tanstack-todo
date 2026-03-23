import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getSession } = vi.hoisted(() => ({
  getSession: vi.fn(),
}))

vi.mock('#/lib/auth', () => ({
  auth: {
    api: {
      getSession,
    },
  },
}))

import {
  getUserFromRequest,
  requireSessionFromRequest,
} from '../src/middleware/auth'

describe('auth helpers', () => {
  beforeEach(() => {
    getSession.mockReset()
  })

  it('returns the session when the request is authenticated', async () => {
    const request = new Request('https://example.com/todos', {
      headers: {
        cookie: 'session=abc',
      },
    })
    const session = {
      session: { id: 'session-1' },
      user: { id: 'user-1', email: 'ada@example.com' },
    }

    getSession.mockResolvedValue(session)

    await expect(requireSessionFromRequest(request)).resolves.toEqual(session)
    expect(getSession).toHaveBeenCalledWith({
      headers: request.headers,
    })
  })

  it('derives the user from the shared session helper', async () => {
    const request = new Request('https://example.com/todos')
    const session = {
      session: { id: 'session-2' },
      user: { id: 'user-2', email: 'grace@example.com' },
    }

    getSession.mockResolvedValue(session)

    await expect(getUserFromRequest(request)).resolves.toEqual(session.user)
  })

  it('returns null when no session exists', async () => {
    const request = new Request('https://example.com/todos')

    getSession.mockResolvedValue(null)

    await expect(requireSessionFromRequest(request)).resolves.toBeNull()
    await expect(getUserFromRequest(request)).resolves.toBeNull()
  })
})
