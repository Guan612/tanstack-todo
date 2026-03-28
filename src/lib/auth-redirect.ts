export type RedirectSearch = {
  redirect?: string
}

export type RouteLocationLike = {
  pathname: string
  search?: Record<string, unknown>
}

function createSearchString(search?: Record<string, unknown>) {
  if (!search) {
    return ''
  }

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    params.set(key, String(value))
  }

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

export function normalizeRedirect(redirect?: string) {
  if (!redirect) {
    return '/'
  }

  if (!redirect.startsWith('/')) {
    return '/'
  }

  if (redirect.startsWith('//')) {
    return '/'
  }

  return redirect
}

export function getSafeRedirect(search: RedirectSearch) {
  return normalizeRedirect(search.redirect)
}

export function buildLoginRedirect(location: RouteLocationLike) {
  const redirect = `${location.pathname}${createSearchString(location.search)}`
  return `/auth/login?redirect=${encodeURIComponent(normalizeRedirect(redirect))}`
}

export function buildLoginRedirectTarget(location: RouteLocationLike) {
  const redirect = `${location.pathname}${createSearchString(location.search)}`
  return normalizeRedirect(redirect)
}
