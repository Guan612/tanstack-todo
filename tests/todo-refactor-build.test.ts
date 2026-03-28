import { describe, expect, it } from 'vitest'

describe('todo refactor file structure', () => {
  it('keeps todo ui and hooks split into dedicated modules', async () => {
    const hookModule = await import('../src/hooks/todo/useTodoPage')
    const viewModule = await import('../src/components/todo/TodoPageView')

    expect(typeof hookModule.useTodoPage).toBe('function')
    expect(typeof viewModule.TodoPageView).toBe('function')
  })
})
