import { getSafeRedirect } from '#/lib/auth-redirect'
import { createFileRoute, Link } from '@tanstack/react-router'

import { createPageHead } from '../../../lib/page-head'
import {
  revalidateLogic,
  useForm,
  type AnyFieldApi,
} from '@tanstack/react-form'
import { useLogin } from '#/hooks/auth/useLogin'
import { loginSchema, type Login } from '#/types/auth'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_sub/auth/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  head: createPageHead('登录'),
  component: RouteComponent,
})

function FieldInfo({
  field,
  helperText,
}: {
  field: AnyFieldApi
  helperText: string
}) {
  const errors =
    field.state.meta.isTouched && !field.state.meta.isValid
      ? field.state.meta.errors.map((err) => err.message)
      : []

  return (
    <p
      className={
        errors.length > 0
          ? 'text-sm font-medium text-destructive'
          : 'text-xs leading-5 text-muted-foreground'
      }
    >
      {errors[0] ?? (field.state.meta.isValidating ? '校验中...' : helperText)}
    </p>
  )
}

function RouteComponent() {
  const search = Route.useSearch()
  const { mutate, isPending } = useLogin(getSafeRedirect(search))
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as Login,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: loginSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
  })

  return (
    <div className="page-wrap min-h-[calc(100vh-5rem)] w-full px-4 py-10 sm:py-14">
      <section className="mx-auto w-full max-w-md">
        <div className="rounded-[2rem] border border-border/50 bg-gradient-to-b from-background/20 via-background/55 to-background/70 p-3 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-4">
          <div className="w-full rounded-2xl border border-border/70 bg-card/95 p-6 shadow-xl shadow-black/5 sm:p-8">
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                欢迎登录
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                登录后即可开始管理你的任务与计划。
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div className="space-y-2.5">
                <form.Field
                  name="email"
                  children={(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className="text-sm font-medium text-foreground"
                      >
                        邮箱地址
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        autoComplete="email"
                        aria-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                        className="h-11 bg-background/60"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo
                        field={field}
                        helperText="用于接收登录通知和重要提醒。"
                      />
                    </>
                  )}
                />
              </div>
              <div className="space-y-2.5">
                <form.Field
                  name="password"
                  children={(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className="text-sm font-medium text-foreground"
                      >
                        登录密码
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                        className="h-11 bg-background/60"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo
                        field={field}
                        helperText="建议至少使用 8 位字符。"
                      />
                    </>
                  )}
                />
              </div>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      className="h-11 w-full"
                      disabled={!canSubmit || isPending || isSubmitting}
                    >
                      {isPending || isSubmitting ? '登录中...' : '登录'}
                    </Button>
                    <Button
                      type="reset"
                      variant="outline"
                      className="h-11 w-full text-muted-foreground"
                      onClick={(e) => {
                        e.preventDefault()
                        form.reset()
                      }}
                    >
                      重置
                    </Button>
                  </div>
                )}
              />
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground/80">
              还没有账号？{' '}
              <Link
                to="/auth/register"
                className="font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                去注册
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
