import { prisma } from '#/db'
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prismaAdapter } from 'better-auth/adapters/prisma'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // 或 "mysql", "postgresql", ...等
  }),
  plugins: [tanstackStartCookies()],
})
