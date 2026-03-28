export type TodoItem = {
  id: number
  title: string
  description?: string | null
  done: boolean
}

export type TodoFilter = 'all' | 'active' | 'done'
