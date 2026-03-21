import { authClient } from '#/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner' // 假设你用 sonner 或其他 toast 库
import type { Login } from '#/types/auth'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (value: Login) => {
      const { data, error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      })

      if (error) {
        // 抛出错误以便触发 onError
        throw error
      }
      return data
    },
    onSuccess: () => {
      toast.success('登录成功！')
      navigate({ to: '/' })
    },
    onError: (error: any) => {
      // 这里可以统一处理 Better-Auth 的错误码
      const message = error.message || '登录失败，请检查输入'
      toast.error(message)
    },
  })
}
