// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { navigateMock, successMock, errorMock, signInEmailMock } = vi.hoisted(
  () => ({
    navigateMock: vi.fn(),
    successMock: vi.fn(),
    errorMock: vi.fn(),
    signInEmailMock: vi.fn(),
  }),
)

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  )

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('sonner', () => ({
  toast: {
    success: successMock,
    error: errorMock,
  },
}))

vi.mock('#/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: signInEmailMock,
    },
  },
}))

import { useLogin } from '../src/hooks/auth/useLogin'

function createWrapper() {
  const queryClient = new QueryClient()

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useLogin', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    successMock.mockReset()
    errorMock.mockReset()
    signInEmailMock.mockReset()
  })

  it('redirects to the provided path after successful login', async () => {
    signInEmailMock.mockResolvedValue({ data: { ok: true }, error: null })

    const { result } = renderHook(() => useLogin('/todo?keyword=milk'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      email: 'ada@example.com',
      password: 'password123',
    })

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: '/todo?keyword=milk' })
    })

    expect(successMock).toHaveBeenCalledWith('登录成功！')
  })

  it('falls back to the home page when no redirect is provided', async () => {
    signInEmailMock.mockResolvedValue({ data: { ok: true }, error: null })

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      email: 'grace@example.com',
      password: 'password123',
    })

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
    })
  })
})
