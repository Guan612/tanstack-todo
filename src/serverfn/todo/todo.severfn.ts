import { authFnMiddleware } from '#/middleware/auth-fn.middleware'
import { TodoService } from '#/service/todo.service'
import { CreateTodoSchema, type CreateTodoInput } from '#/types/todo'
import { createServerFn } from '@tanstack/react-start'

export const getTodoFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    return TodoService.getUserTodos(context.user.id)
  })

export const createTodoFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator((data: CreateTodoInput) => CreateTodoSchema.parse(data))
  .handler(async ({ data, context }) => {
    return TodoService.createTodo(context.user.id, data)
  })

