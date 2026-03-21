import z from "zod"

export const CreateTodoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100),
  context: z.string().optional(),
})

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>