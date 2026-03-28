import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { CreateTodoInput } from '#/types/todo'
import type { TodoItem } from './types'

type TodoListItemProps = {
  todo: TodoItem
  isEditing: boolean
  editingValues: CreateTodoInput
  onStartEditing: (todo: TodoItem) => void
  onEditingTitleChange: (value: string) => void
  onEditingDescriptionChange: (value: string) => void
  onSave: (id: number) => void
  onCancel: () => void
  onToggle: (todo: TodoItem) => void
  onDelete: (id: number) => void
}

export function TodoListItem({
  todo,
  isEditing,
  editingValues,
  onStartEditing,
  onEditingTitleChange,
  onEditingDescriptionChange,
  onSave,
  onCancel,
  onToggle,
  onDelete,
}: TodoListItemProps) {
  return (
    <article
      data-testid={`todo-item-${todo.id}`}
      className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 gap-3">
          <input
            aria-label={`切换 ${todo.title} 完成状态`}
            type="checkbox"
            checked={todo.done}
            onChange={() => onToggle(todo)}
          />
          <div className="flex-1 space-y-3">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor={`edit-title-${todo.id}`}
                    className="text-sm font-medium"
                  >
                    编辑任务标题
                  </label>
                  <Input
                    id={`edit-title-${todo.id}`}
                    value={editingValues.title}
                    onChange={(e) => onEditingTitleChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`edit-description-${todo.id}`}
                    className="text-sm font-medium"
                  >
                    编辑任务描述
                  </label>
                  <Input
                    id={`edit-description-${todo.id}`}
                    value={editingValues.description ?? ''}
                    onChange={(e) => onEditingDescriptionChange(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <h2
                  className={`text-lg font-medium ${
                    todo.done ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {todo.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {todo.description || '暂无描述'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {isEditing ? (
            <>
              <Button size="sm" onClick={() => onSave(todo.id)}>
                保存
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                取消
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartEditing(todo)}
            >
              编辑
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(todo.id)}
          >
            删除
          </Button>
        </div>
      </div>
    </article>
  )
}
