import { authFnMiddleware } from '#/middleware/auth-fn.middleware'
import { TodoService } from '#/service/todo.service'
import {
  CreateTodoSchema,
  DeleteTodoServerFnSchema,
  UpdateTodoServerFnSchema,
  type CreateTodoInput,
  type DeleteTodoServerFnInput,
  type UpdateTodoServerFnInput,
} from '#/types/todo'
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

export const updateTodoFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator((data: UpdateTodoServerFnInput) =>
    UpdateTodoServerFnSchema.parse(data),
  )
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data
    return TodoService.updateTodo(id, context.user.id, payload)
  })

export const deleteTodoFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator((data: DeleteTodoServerFnInput) =>
    DeleteTodoServerFnSchema.parse(data),
  )
  .handler(async ({ data, context }) => {
    return TodoService.deleteTodo(data.id, context.user.id)
  })
