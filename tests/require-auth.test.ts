import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getCurrentSessionFnMock } = vi.hoisted(() => ({
  getCurrentSessionFnMock: vi.fn(),
}))

vi.mock('#/serverfn/auth/session.serverfn', () => ({
  getCurrentSessionFn: (...args: unknown[]) => getCurrentSessionFnMock(...args),
}))

import { requireAuth } from '../src/lib/require-auth'

describe('requireAuth', () => {
  beforeEach(() => {
    getCurrentSessionFnMock.mockReset()
  })

  it('resolves when the server confirms a logged-in session', async () => {
    getCurrentSessionFnMock.mockResolvedValue({
      user: { id: 'user-1', email: 'ada@example.com' },
    })

    await expect(requireAuth('/todo')).resolves.toBeUndefined()
  })

  it('redirects to login when the server returns no session', async () => {
    getCurrentSessionFnMock.mockResolvedValue(null)

    await expect(requireAuth('/todo')).rejects.toMatchObject({
      options: {
        to: '/auth/login',
        search: {
          redirect: '/todo',
        },
      },
    })
  })
})
