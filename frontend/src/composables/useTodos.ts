import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { MOCK_AUTH_ENABLED, mockTodosStore } from '../lib/mock'
import type { Todo, TodoInsert, TodoUpdate, TodoFilter } from '../types/todo'

const todos = ref<Todo[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filter = ref<TodoFilter>('all')

export function useTodos() {
  const { user } = useAuth()

  const filteredTodos = computed(() => {
    if (filter.value === 'pending') return todos.value.filter((t) => !t.is_done)
    if (filter.value === 'completed') return todos.value.filter((t) => t.is_done)
    return todos.value
  })

  const counts = computed(() => ({
    all: todos.value.length,
    pending: todos.value.filter((t) => !t.is_done).length,
    completed: todos.value.filter((t) => t.is_done).length,
  }))

  const isEmpty = computed(() => !loading.value && filteredTodos.value.length === 0)

  async function fetchTodos() {
    if (!user.value) return
    loading.value = true
    error.value = null

    // See src/lib/mock.ts — preview-only bypass, no network calls.
    if (MOCK_AUTH_ENABLED) {
      todos.value = [...mockTodosStore].sort((a, b) => b.created_at.localeCompare(a.created_at))
      loading.value = false
      return
    }

    const { data, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      error.value = 'No se pudieron cargar las tareas. Inténtalo de nuevo.'
      loading.value = false
      return
    }

    todos.value = data ?? []
    loading.value = false
  }

  async function addTodo(input: TodoInsert) {
    if (!user.value) return { success: false as const, error: 'No autenticado' }
    error.value = null

    if (MOCK_AUTH_ENABLED) {
      const now = new Date().toISOString()
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        user_id: user.value.id,
        title: input.title.trim(),
        is_done: false,
        priority: input.priority ?? null,
        due_date: input.due_date ?? null,
        created_at: now,
        updated_at: now,
      }
      mockTodosStore.unshift(newTodo)
      todos.value = [newTodo, ...todos.value]
      return { success: true as const, data: newTodo }
    }

    const { data, error: insertError } = await supabase
      .from('todos')
      .insert({
        user_id: user.value.id,
        title: input.title.trim(),
        priority: input.priority ?? null,
        due_date: input.due_date ?? null,
      })
      .select()
      .single()

    if (insertError) {
      error.value = 'No se pudo crear la tarea. Inténtalo de nuevo.'
      return { success: false as const, error: error.value }
    }

    todos.value = [data, ...todos.value]
    return { success: true as const, data }
  }

  async function updateTodo(id: string, changes: TodoUpdate) {
    error.value = null

    if (MOCK_AUTH_ENABLED) {
      const idx = mockTodosStore.findIndex((t) => t.id === id)
      if (idx === -1) {
        error.value = 'No se pudo actualizar la tarea. Inténtalo de nuevo.'
        return { success: false as const, error: error.value }
      }
      mockTodosStore[idx] = { ...mockTodosStore[idx], ...changes, updated_at: new Date().toISOString() }
      const updated = mockTodosStore[idx]
      const localIdx = todos.value.findIndex((t) => t.id === id)
      if (localIdx !== -1) todos.value[localIdx] = updated
      return { success: true as const, data: updated }
    }

    const { data, error: updateError } = await supabase
      .from('todos')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      error.value = 'No se pudo actualizar la tarea. Inténtalo de nuevo.'
      return { success: false as const, error: error.value }
    }

    const idx = todos.value.findIndex((t) => t.id === id)
    if (idx !== -1) todos.value[idx] = data
    return { success: true as const, data }
  }

  async function toggleDone(todo: Todo) {
    return updateTodo(todo.id, { is_done: !todo.is_done })
  }

  async function deleteTodo(id: string) {
    error.value = null
    const previous = todos.value
    // Optimistic removal, rolled back on failure.
    todos.value = todos.value.filter((t) => t.id !== id)

    if (MOCK_AUTH_ENABLED) {
      const idx = mockTodosStore.findIndex((t) => t.id === id)
      if (idx !== -1) mockTodosStore.splice(idx, 1)
      return { success: true as const }
    }

    const { error: deleteError } = await supabase.from('todos').delete().eq('id', id)

    if (deleteError) {
      todos.value = previous
      error.value = 'No se pudo eliminar la tarea. Inténtalo de nuevo.'
      return { success: false as const, error: error.value }
    }

    return { success: true as const }
  }

  function setFilter(value: TodoFilter) {
    filter.value = value
  }

  function resetState() {
    todos.value = []
    loading.value = false
    error.value = null
    filter.value = 'all'
  }

  return {
    todos,
    filteredTodos,
    counts,
    loading,
    error,
    filter,
    isEmpty,
    fetchTodos,
    addTodo,
    updateTodo,
    toggleDone,
    deleteTodo,
    setFilter,
    resetState,
  }
}
