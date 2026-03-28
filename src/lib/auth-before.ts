import { requireAuth } from '#/lib/require-auth'

type BeforeLoadContext = {
  location: {
    href: string
  }
}

export async function authBefore({ location }: BeforeLoadContext) {
  await requireAuth(location.href)
}
