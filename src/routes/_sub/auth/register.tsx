import { createPageHead } from '#/lib/page-head'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  revalidateLogic,
  useForm,
  type AnyFieldApi,
} from '@tanstack/react-form'
import { registerSchema, type Register } from '#/types/auth'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { useRegister } from '#/hooks/auth/useRegister'

function getFieldDescriptionId(fieldName: string) {
  return `${fieldName}-description`
}

export const Route = createFileRoute('/_sub/auth/register')({
  head: createPageHead('注册'),
  component: RouteComponent,
})

function FieldInfo({
  field,
  helperText,
  id,
}: {
  field: AnyFieldApi
  helperText: string
  id: string
}) {
  const errors =
    field.state.meta.isTouched && !field.state.meta.isValid
      ? field.state.meta.errors.map((err) => err.message)
      : []

  return (
    <p
      id={id}
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

export function RouteComponent() {
  const { mutate, isPending } = useRegister()
  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
    } as Register,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: registerSchema,
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
              <p className="text-sm font-medium text-muted-foreground">
                创建你的账户
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                欢迎注册
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                创建账号后即可开始管理你的任务与计划。
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
                  children={(field) => {
                    const descriptionId = getFieldDescriptionId(field.name)

                    return (
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
                          aria-describedby={descriptionId}
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
                          id={descriptionId}
                        />
                      </>
                    )
                  }}
                />
              </div>
              <div className="space-y-2.5">
                <form.Field
                  name="password"
                  children={(field) => {
                    const descriptionId = getFieldDescriptionId(field.name)

                    return (
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
                          aria-describedby={descriptionId}
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
                          helperText="建议至少使用 6 位字符。"
                          id={descriptionId}
                        />
                      </>
                    )
                  }}
                />
              </div>
              <div className="space-y-2.5">
                <form.Field
                  name="username"
                  children={(field) => {
                    const descriptionId = getFieldDescriptionId(field.name)

                    return (
                      <>
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium text-foreground"
                        >
                          用户名
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="nickname"
                          aria-describedby={descriptionId}
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
                          helperText="这会显示在你的任务协作页面。"
                          id={descriptionId}
                        />
                      </>
                    )
                  }}
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
                      {isPending || isSubmitting ? '注册中...' : '注册'}
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
              已有账号？{' '}
              <Link
                to="/auth/login"
                className="font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                去登录
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
