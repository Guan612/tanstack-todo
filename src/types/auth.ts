import { z } from 'zod'
export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6, '密码至少 6 位').max(50, '密码最多 50 位'),
  username: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, '密码至少 6 位').max(50, '密码最多 50 位'),
  username: z.string().optional(),
})

export type Register = z.infer<typeof registerSchema>
export type Login = z.infer<typeof loginSchema>
