import { describe, expect, it } from 'vitest'

import {
  buildLoginRedirect,
  buildLoginRedirectTarget,
  getSafeRedirect,
  normalizeRedirect,
} from '../src/lib/auth-redirect'

describe('auth redirect helpers', () => {
  it('builds a login redirect that preserves the current pathname and search', () => {
    const location = {
      pathname: '/todo',
      search: {
        status: 'done',
        keyword: 'abc',
      },
    }

    expect(buildLoginRedirect(location)).toBe(
      '/auth/login?redirect=%2Ftodo%3Fstatus%3Ddone%26keyword%3Dabc',
    )
    expect(buildLoginRedirectTarget(location)).toBe(
      '/todo?status=done&keyword=abc',
    )
  })

  it('normalizes safe in-app redirects and falls back for unsafe targets', () => {
    expect(normalizeRedirect('/todo?status=open')).toBe('/todo?status=open')
    expect(normalizeRedirect('https://evil.example.com')).toBe('/')
    expect(normalizeRedirect('//evil.example.com')).toBe('/')
    expect(normalizeRedirect('javascript:alert(1)')).toBe('/')
  })

  it('reads redirect values from the login search params safely', () => {
    expect(getSafeRedirect({ redirect: '/todo?keyword=milk' })).toBe(
      '/todo?keyword=milk',
    )
    expect(getSafeRedirect({ redirect: 'https://evil.example.com' })).toBe('/')
    expect(getSafeRedirect({})).toBe('/')
  })
})
