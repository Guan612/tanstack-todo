import { createFileRoute } from '@tanstack/react-router'
import { TodoService } from '#/service/todo.service'
import { CreateTodoSchema } from '#/types/todo'
import { authRouteMiddleware } from '#/middleware/auth-restful.middleware'

export const Route = createFileRoute('/api/todos/')({
  server: {
    middleware: [authRouteMiddleware],
    handlers: {
      GET: async ({ context }) => {
        const todos = await TodoService.getUserTodos(context.user.id)
        return Response.json({ data: todos })
      },

      POST: async ({ request, context }) => {
        const body = await request.json()
        const parsed = CreateTodoSchema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { error: 'Validation failed', details: parsed.error.flatten() },
            { status: 400 },
          )
        }

        const todo = await TodoService.createTodo(context.user.id, parsed.data)
        return Response.json({ data: todo }, { status: 201 })
      },
    },
  },
})
