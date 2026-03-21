// @vitest-environment jsdom

import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RouteComponent } from '../src/routes/_sub/auth/register'

vi.mock('#/hooks/auth/useRegister', () => ({
  useRegister: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  )

  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: React.ComponentProps<'a'> & { to: string }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    createFileRoute: () => () => ({}),
  }
})

afterEach(() => {
  cleanup()
})

describe('register route', () => {
  it('renders field descriptions accessibly and aligns password helper copy with validation', () => {
    const { container } = render(<RouteComponent />)

    expect(
      screen.getByRole('heading', { name: '欢迎注册', level: 1 }),
    ).toBeTruthy()
    expect(
      screen.getByText('创建账号后即可开始管理你的任务与计划。'),
    ).toBeTruthy()

    const emailInput = screen.getByLabelText('邮箱地址')
    const passwordInput = screen.getByLabelText('登录密码')
    const usernameInput = screen.getByLabelText('用户名')
    const inputs = Array.from(container.querySelectorAll('input'))

    expect(inputs).toEqual([emailInput, passwordInput, usernameInput])
    expect(emailInput.getAttribute('type')).toBe('email')
    expect(emailInput.getAttribute('autocomplete')).toBe('email')
    expect(passwordInput.getAttribute('type')).toBe('password')
    expect(passwordInput.getAttribute('autocomplete')).toBe('new-password')
    expect(usernameInput.getAttribute('autocomplete')).toBe('nickname')

    const emailHelper = screen.getByText('用于接收登录通知和重要提醒。')
    const passwordHelper = screen.getByText('建议至少使用 6 位字符。')
    const usernameHelper = screen.getByText('这会显示在你的任务协作页面。')

    expect(emailHelper.id).toBe('email-description')
    expect(passwordHelper.id).toBe('password-description')
    expect(usernameHelper.id).toBe('username-description')

    expect(emailInput.getAttribute('aria-describedby')).toBe(emailHelper.id)
    expect(passwordInput.getAttribute('aria-describedby')).toBe(
      passwordHelper.id,
    )
    expect(usernameInput.getAttribute('aria-describedby')).toBe(
      usernameHelper.id,
    )

    const loginLink = screen.getByRole('link', { name: '去登录' })
    expect(loginLink.getAttribute('href')).toBe('/auth/login')
  })

  it('resets typed field values back to defaults', () => {
    render(<RouteComponent />)

    const emailInput = screen.getByLabelText('邮箱地址') as HTMLInputElement
    const passwordInput = screen.getByLabelText('登录密码') as HTMLInputElement
    const usernameInput = screen.getByLabelText('用户名') as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'ada@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(usernameInput, { target: { value: 'ada' } })

    expect(emailInput.value).toBe('ada@example.com')
    expect(passwordInput.value).toBe('password123')
    expect(usernameInput.value).toBe('ada')

    fireEvent.click(screen.getByRole('button', { name: '重置' }))

    expect(emailInput.value).toBe('')
    expect(passwordInput.value).toBe('')
    expect(usernameInput.value).toBe('')
  })
})
