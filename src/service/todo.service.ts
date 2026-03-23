import { prisma } from '#/db'
import type { CreateTodoInput, UpdateTodoInput } from '#/types/todo'

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

  async updateTodo(id: number, userId: string, data: UpdateTodoInput) {
    return prisma.todo.update({
      where: { id: id, userId: userId },
      data: { ...data },
    })
  },

  async deleteTodo(id: number, userId: string) {
    return prisma.todo.delete({
      where: { id: id, userId: userId },
    })
  },
}
