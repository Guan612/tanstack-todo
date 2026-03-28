import type { TodoFilter, TodoItem } from '#/components/todo/types'
import {
  createTodoFn,
  deleteTodoFn,
  updateTodoFn,
} from '#/serverfn/todo/todo.serverfn'
import { CreateTodoSchema, type CreateTodoInput } from '#/types/todo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

function parseTodoInput(input: CreateTodoInput) {
  return CreateTodoSchema.safeParse({
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
  })
}

export function useTodoPage(todos: TodoItem[]) {
  const queryClient = useQueryClient()
  const [createForm, setCreateForm] = useState<CreateTodoInput>({
    title: '',
    description: '',
  })
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingValues, setEditingValues] = useState<CreateTodoInput>({
    title: '',
    description: '',
  })

  const refreshTodos = async () => {
    await queryClient.invalidateQueries({ queryKey: ['todos'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateTodoInput) =>
      createTodoFn({ data: payload } as never),
    onSuccess: async () => {
      toast.success('添加成功')
      setCreateForm({ title: '', description: '' })
      await refreshTodos()
    },
    onError: (error: any) => {
      toast.error(error?.message ?? '添加失败')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: {
      id: number
      title?: string
      description?: string
      done?: boolean
    }) => updateTodoFn({ data: payload } as never),
    onSuccess: async () => {
      toast.success('更新成功')
      setEditingId(null)
      setEditingValues({ title: '', description: '' })
      await refreshTodos()
    },
    onError: (error: any) => {
      toast.error(error?.message ?? '更新失败')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodoFn({ data: { id } } as never),
    onSuccess: async () => {
      toast.success('删除成功')
      await refreshTodos()
    },
    onError: (error: any) => {
      toast.error(error?.message ?? '删除失败')
    },
  })

  const filteredTodos = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return todos.filter((todo) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        todo.title.toLowerCase().includes(normalizedKeyword) ||
        (todo.description ?? '').toLowerCase().includes(normalizedKeyword)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.done) ||
        (filter === 'done' && todo.done)

      return matchesKeyword && matchesFilter
    })
  }, [filter, keyword, todos])

  const handleCreate = () => {
    const result = parseTodoInput(createForm)

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? '表单校验失败')
      return
    }

    createMutation.mutate(result.data)
  }

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id)
    setEditingValues({
      title: todo.title,
      description: todo.description ?? '',
    })
  }

  const handleSave = (id: number) => {
    const result = parseTodoInput(editingValues)

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? '表单校验失败')
      return
    }

    updateMutation.mutate({
      id,
      ...result.data,
    })
  }

  const toggleTodo = (todo: TodoItem) => {
    updateMutation.mutate({
      id: todo.id,
      done: !todo.done,
    })
  }

  return {
    createForm,
    keyword,
    filter,
    editingId,
    editingValues,
    filteredTodos,
    setKeyword,
    setFilter,
    setCreateTitle: (value: string) =>
      setCreateForm((current) => ({ ...current, title: value })),
    setCreateDescription: (value: string) =>
      setCreateForm((current) => ({ ...current, description: value })),
    setEditingTitle: (value: string) =>
      setEditingValues((current) => ({ ...current, title: value })),
    setEditingDescription: (value: string) =>
      setEditingValues((current) => ({ ...current, description: value })),
    handleCreate,
    startEditing,
    handleSave,
    cancelEditing: () => setEditingId(null),
    toggleTodo,
    deleteTodo: (id: number) => deleteMutation.mutate(id),
  }
}
