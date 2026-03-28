import { describe, expect, it } from 'vitest'

import { CreateTodoSchema } from '../src/types/todo'

function parseTodoInput(input: { title: string; description?: string }) {
  return CreateTodoSchema.safeParse({
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
  })
}

describe('parseTodoInput', () => {
  it('trims incoming values and returns parsed data', () => {
    const result = parseTodoInput({
      title: '  买牛奶  ',
      description: '  便利店  ',
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data).toEqual({
        title: '买牛奶',
        description: '便利店',
      })
    }
  })

  it('reuses zod validation errors for invalid input', () => {
    const result = parseTodoInput({
      title: '   ',
      description: 'anything',
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('标题不能为空')
    }
  })
})
