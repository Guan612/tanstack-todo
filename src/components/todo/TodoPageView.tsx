import type { CreateTodoInput } from '#/types/todo'
import { TodoCreateForm } from './TodoCreateForm'
import { TodoFilters } from './TodoFilters'
import { TodoListItem } from './TodoListItem'
import type { TodoFilter, TodoItem } from './types'

type TodoPageViewProps = {
  filteredTodos: TodoItem[]
  keyword: string
  filter: TodoFilter
  createForm: CreateTodoInput
  editingId: number | null
  editingValues: CreateTodoInput
  onCreateTitleChange: (value: string) => void
  onCreateDescriptionChange: (value: string) => void
  onCreateSubmit: () => void
  onKeywordChange: (value: string) => void
  onFilterChange: (value: TodoFilter) => void
  onStartEditing: (todo: TodoItem) => void
  onEditingTitleChange: (value: string) => void
  onEditingDescriptionChange: (value: string) => void
  onSave: (id: number) => void
  onCancelEditing: () => void
  onToggle: (todo: TodoItem) => void
  onDelete: (id: number) => void
}

export function TodoPageView({
  filteredTodos,
  keyword,
  filter,
  createForm,
  editingId,
  editingValues,
  onCreateTitleChange,
  onCreateDescriptionChange,
  onCreateSubmit,
  onKeywordChange,
  onFilterChange,
  onStartEditing,
  onEditingTitleChange,
  onEditingDescriptionChange,
  onSave,
  onCancelEditing,
  onToggle,
  onDelete,
}: TodoPageViewProps) {
  return (
    <div className="page-wrap w-full max-w-5xl px-4 py-10">
      <section className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">代办事项</h1>
          <p className="text-sm text-muted-foreground">
            创建、搜索、筛选并维护你的待办任务。
          </p>
        </div>

        <TodoCreateForm
          createForm={createForm}
          onTitleChange={onCreateTitleChange}
          onDescriptionChange={onCreateDescriptionChange}
          onSubmit={onCreateSubmit}
        />

        <TodoFilters
          keyword={keyword}
          filter={filter}
          onKeywordChange={onKeywordChange}
          onFilterChange={onFilterChange}
        />

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center text-sm text-muted-foreground">
              暂无匹配的任务，试试调整筛选条件或创建新的待办事项。
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                isEditing={editingId === todo.id}
                editingValues={editingValues}
                onStartEditing={onStartEditing}
                onEditingTitleChange={onEditingTitleChange}
                onEditingDescriptionChange={onEditingDescriptionChange}
                onSave={onSave}
                onCancel={onCancelEditing}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
