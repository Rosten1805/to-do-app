export type TodoPriority = 'low' | 'medium' | 'high'

export type Todo = {
  id: string
  user_id: string
  title: string
  is_done: boolean
  priority: TodoPriority | null
  due_date: string | null
  created_at: string
  updated_at: string
}

export type TodoInsert = {
  title: string
  priority?: TodoPriority | null
  due_date?: string | null
}

export type TodoUpdate = {
  title?: string
  is_done?: boolean
  priority?: TodoPriority | null
  due_date?: string | null
}

export type TodoFilter = 'all' | 'pending' | 'completed'
