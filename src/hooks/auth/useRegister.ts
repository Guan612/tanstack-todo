import { useMutation } from '@tanstack/react-query'
import { authClient } from '#/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner' // 假设你用 sonner 或其他 toast 库
import type { Register } from '#/types/auth'

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (value: Register) => {
      const { data, error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.username ?? '',
      })

      if (error) {
        // 抛出错误以便触发 onError
        throw error
      }
      return data
    },
    onSuccess: () => {
      toast.success('注册成功！')
      navigate({ to: '/' })
    },
    onError: (error: any) => {
      // 这里可以统一处理 Better-Auth 的错误码
      const message = error.message || '注册失败，请检查输入'
      toast.error(message)
    },
  })
}
