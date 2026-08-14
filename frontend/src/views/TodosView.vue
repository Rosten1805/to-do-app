<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTodos } from '../composables/useTodos'
import TodoForm from '../components/TodoForm.vue'
import TodoFilters from '../components/TodoFilters.vue'
import TodoList from '../components/TodoList.vue'
import type { Todo, TodoInsert, TodoPriority } from '../types/todo'

const { user, signOut } = useAuth()
const {
  filteredTodos,
  counts,
  loading,
  error,
  filter,
  fetchTodos,
  addTodo,
  updateTodo,
  toggleDone,
  deleteTodo,
  setFilter,
  resetState,
} = useTodos()

const router = useRouter()
const adding = ref(false)

onMounted(() => {
  fetchTodos()
})

async function handleAdd(input: TodoInsert) {
  adding.value = true
  await addTodo(input)
  adding.value = false
}

function handleUpdate(
  id: string,
  changes: { title: string; priority: TodoPriority | null; due_date: string | null },
) {
  updateTodo(id, changes)
}

function handleToggle(todo: Todo) {
  toggleDone(todo)
}

function handleDelete(id: string) {
  deleteTodo(id)
}

async function handleSignOut() {
  await signOut()
  resetState()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h1 class="text-lg font-semibold text-slate-900">Mis tareas</h1>
          <p class="truncate text-xs text-slate-500">{{ user?.email }}</p>
        </div>
        <button
          type="button"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="handleSignOut"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <TodoForm :submitting="adding" @submit="handleAdd" />

      <div class="mt-6 mb-4">
        <TodoFilters :model-value="filter" :counts="counts" @update:model-value="setFilter" />
      </div>

      <TodoList
        :todos="filteredTodos"
        :loading="loading"
        :error="error"
        :filter="filter"
        @toggle="handleToggle"
        @update="handleUpdate"
        @delete="handleDelete"
        @retry="fetchTodos"
      />
    </main>
  </div>
</template>
