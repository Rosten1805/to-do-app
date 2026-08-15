<script setup lang="ts">
import type { Todo, TodoPriority, TodoFilter } from '../types/todo'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
  todos: Todo[]
  loading: boolean
  error: string | null
  filter: TodoFilter
}>()

const emit = defineEmits<{
  toggle: [todo: Todo]
  update: [id: string, changes: { title: string; priority: TodoPriority | null; due_date: string | null }]
  delete: [id: string]
  retry: []
}>()

const emptyMessages: Record<TodoFilter, string> = {
  all: 'Todavía no tienes tareas. Añade la primera arriba.',
  pending: 'No tienes tareas pendientes. ¡Buen trabajo!',
  completed: 'Todavía no has completado ninguna tarea.',
}
</script>

<template>
  <div>
    <div v-if="props.loading" class="flex flex-col items-center gap-3 py-16 text-slate-400">
      <svg class="h-6 w-6 animate-spin text-brand-link" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p class="text-sm">Cargando tareas…</p>
    </div>

    <div
      v-else-if="props.error"
      role="alert"
      class="flex flex-col items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/10 py-12 text-center"
    >
      <p class="text-sm font-medium text-red-300">{{ props.error }}</p>
      <button
        type="button"
        class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        @click="emit('retry')"
      >
        Reintentar
      </button>
    </div>

    <div
      v-else-if="props.todos.length === 0"
      class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 py-16 text-center"
    >
      <p class="text-3xl">📝</p>
      <p class="text-sm text-slate-400">{{ emptyMessages[props.filter] }}</p>
    </div>

    <ul v-else class="flex flex-col gap-3">
      <TodoItem
        v-for="todo in props.todos"
        :key="todo.id"
        :todo="todo"
        @toggle="emit('toggle', $event)"
        @update="(id, changes) => emit('update', id, changes)"
        @delete="emit('delete', $event)"
      />
    </ul>
  </div>
</template>
