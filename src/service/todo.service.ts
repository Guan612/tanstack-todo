import { prisma } from '#/db'
import type { CreateTodoInput } from '#/types/todo'

export const TodoService = {
  async getUserTodos(userId: string) {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async createTodo(userId: string, data: CreateTodoInput) {
    return prisma.todo.create({
      data: { ...data, userId },
    })
  },
}
