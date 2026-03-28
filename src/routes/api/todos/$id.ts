import { createFileRoute } from '@tanstack/react-router'
import { TodoService } from '#/service/todo.service'
import { TodoIdParamSchema, UpdateTodoBodySchema } from '#/types/todo'
import { authRouteMiddleware } from '#/middleware/auth-restful.middleware'

export const Route = createFileRoute('/api/todos/$id')({
  server: {
    middleware: [authRouteMiddleware],
    handlers: {
      GET: async ({ params, context }) => {
        const { id } = TodoIdParamSchema.parse(params)

        const todo = await TodoService.getTodoById(id, context.user.id)
        if (!todo) {
          return Response.json({ error: 'Not found' }, { status: 404 })
        }

        return Response.json({ data: todo })
      },

      PATCH: async ({ request, params, context }) => {
        const { id } = TodoIdParamSchema.parse(params)

        const body = await request.json()
        const parsed = UpdateTodoBodySchema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { error: 'Validation failed', details: parsed.error.flatten() },
            { status: 400 },
          )
        }

        try {
          const todo = await TodoService.updateTodo(
            id,
            context.user.id,
            parsed.data,
          )
          return Response.json({ data: todo })
        } catch {
          return Response.json({ error: 'Not found' }, { status: 404 })
        }
      },

      DELETE: async ({ params, context }) => {
        const { id } = TodoIdParamSchema.parse(params)

        try {
          await TodoService.deleteTodo(id, context.user.id)
          return Response.json({ data: null }, { status: 204 })
        } catch {
          return Response.json({ error: 'Not found' }, { status: 404 })
        }
      },
    },
  },
})
