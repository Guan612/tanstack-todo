import z from 'zod'

// base
export const TodoIdSchema = z.coerce.number().int().positive()

// body
export const CreateTodoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100),
  description: z.string().optional(),
})

export const UpdateTodoBodySchema = CreateTodoSchema.partial().extend({
  done: z.boolean().optional(),
})

export const UpdateTodoServerFnSchema = UpdateTodoBodySchema.extend({
  id: TodoIdSchema,
})

export const DeleteTodoServerFnSchema = z.object({
  id: TodoIdSchema,
})

// params
export const TodoIdParamSchema = z.object({
  id: TodoIdSchema,
})

export const DeleteTodoParamSchema = TodoIdParamSchema

// types
export type TodoIdInput = z.infer<typeof TodoIdSchema>
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>
export type UpdateTodoBodyInput = z.infer<typeof UpdateTodoBodySchema>
export type UpdateTodoServerFnInput = z.infer<typeof UpdateTodoServerFnSchema>
export type DeleteTodoServerFnInput = z.infer<typeof DeleteTodoServerFnSchema>
export type TodoIdParamInput = z.infer<typeof TodoIdParamSchema>
export type DeleteTodoParamInput = z.infer<typeof DeleteTodoParamSchema>
