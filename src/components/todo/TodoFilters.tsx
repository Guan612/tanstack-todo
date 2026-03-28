import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { TodoFilter } from './types'

type TodoFiltersProps = {
  keyword: string
  filter: TodoFilter
  onKeywordChange: (value: string) => void
  onFilterChange: (value: TodoFilter) => void
}

export function TodoFilters({
  keyword,
  filter,
  onKeywordChange,
  onFilterChange,
}: TodoFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="space-y-2">
        <label htmlFor="todo-search" className="text-sm font-medium">
          搜索任务
        </label>
        <Input
          id="todo-search"
          value={keyword}
          placeholder="按标题或描述搜索"
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => onFilterChange('all')}
        >
          全部
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => onFilterChange('active')}
        >
          未完成
        </Button>
        <Button
          variant={filter === 'done' ? 'default' : 'outline'}
          onClick={() => onFilterChange('done')}
        >
          已完成
        </Button>
      </div>
    </div>
  )
}
