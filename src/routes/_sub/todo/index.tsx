import { authBefore } from '#/lib/auth-before'
import { TodoPageView } from '#/components/todo/TodoPageView'
import type { TodoItem } from '#/components/todo/types'
import { useTodoPage } from '#/hooks/todo/useTodoPage'
import { createPageHead } from '#/lib/page-head'
import { getTodoFn } from '#/serverfn/todo/todo.serverfn'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sub/todo/')({
  beforeLoad: authBefore,
  head: createPageHead('代办事项'),
  component: RouteComponent,
})

export function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: () => getTodoFn(),
  })

  return <TodoView todos={(data ?? []) as TodoItem[]} />
}

export function TodoView({ todos }: { todos: TodoItem[] }) {
  const todoPage = useTodoPage(todos)

  return (
    <TodoPageView
      filteredTodos={todoPage.filteredTodos}
      keyword={todoPage.keyword}
      filter={todoPage.filter}
      createForm={todoPage.createForm}
      editingId={todoPage.editingId}
      editingValues={todoPage.editingValues}
      onCreateTitleChange={todoPage.setCreateTitle}
      onCreateDescriptionChange={todoPage.setCreateDescription}
      onCreateSubmit={todoPage.handleCreate}
      onKeywordChange={todoPage.setKeyword}
      onFilterChange={todoPage.setFilter}
      onStartEditing={todoPage.startEditing}
      onEditingTitleChange={todoPage.setEditingTitle}
      onEditingDescriptionChange={todoPage.setEditingDescription}
      onSave={todoPage.handleSave}
      onCancelEditing={todoPage.cancelEditing}
      onToggle={todoPage.toggleTodo}
      onDelete={todoPage.deleteTodo}
    />
  )
}
