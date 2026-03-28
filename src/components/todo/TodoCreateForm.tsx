import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { CreateTodoInput } from '#/types/todo'

type TodoCreateFormProps = {
  createForm: CreateTodoInput
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSubmit: () => void
}

export function TodoCreateForm({
  createForm,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
}: TodoCreateFormProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:grid-cols-[1.2fr_1.8fr_auto] sm:items-end">
      <div className="space-y-2">
        <label htmlFor="todo-title" className="text-sm font-medium">
          任务标题
        </label>
        <Input
          id="todo-title"
          value={createForm.title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="todo-description" className="text-sm font-medium">
          任务描述
        </label>
        <Input
          id="todo-description"
          value={createForm.description ?? ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <Button onClick={onSubmit}>添加任务</Button>
    </div>
  )
}
