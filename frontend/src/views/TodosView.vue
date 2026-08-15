<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTodos } from '../composables/useTodos'
import TodoForm from '../components/TodoForm.vue'
import TodoFilters from '../components/TodoFilters.vue'
import TodoList from '../components/TodoList.vue'
import ClockWidget from '../components/ClockWidget.vue'
import CalendarWidget from '../components/CalendarWidget.vue'
import NotesWidget from '../components/NotesWidget.vue'
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
  <div class="relative min-h-screen overflow-x-hidden bg-brand-bg">
    <div class="pointer-events-none fixed -left-24 -top-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl"></div>
    <div class="pointer-events-none fixed -right-16 bottom-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl"></div>

    <header class="relative z-10 border-b border-white/10">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg text-white"
            >✓</span
          >
          <div>
            <p class="font-mono text-base font-semibold tracking-wide text-white">TO-DO APP</p>
            <p class="truncate text-sm text-slate-400">{{ user?.email }}</p>
          </div>
        </div>
        <button
          type="button"
          class="rounded-xl bg-[#232027] px-4 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-colors hover:bg-brand-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-link"
          @click="handleSignOut"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    <main class="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <div
          class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl lg:col-span-3 lg:p-10"
        >
          <h1 class="text-3xl font-bold tracking-tight text-white">Mis tareas</h1>
          <p class="mt-1 text-sm text-slate-400">Organiza tu día y sigue tu progreso.</p>

          <div class="mt-8">
            <TodoForm :submitting="adding" @submit="handleAdd" />
          </div>

          <div class="mt-8 mb-5">
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
        </div>

        <div class="flex flex-col gap-5 lg:col-span-2">
          <ClockWidget />
          <CalendarWidget />
          <NotesWidget />
        </div>
      </div>
    </main>
  </div>
</template>
