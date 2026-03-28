import { prisma } from '#/db'
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { bearer } from 'better-auth/plugins'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [tanstackStartCookies(), bearer()],
})
