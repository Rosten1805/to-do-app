<script setup lang="ts">
import { ref } from 'vue'
import type { TodoInsert, TodoPriority } from '../types/todo'

const emit = defineEmits<{
  submit: [value: TodoInsert]
}>()

const props = defineProps<{
  submitting?: boolean
}>()

const title = ref('')
const priority = ref<TodoPriority | ''>('')
const dueDate = ref('')
const validationError = ref<string | null>(null)

function handleSubmit() {
  const trimmed = title.value.trim()

  if (!trimmed) {
    validationError.value = 'El título es obligatorio.'
    return
  }
  if (trimmed.length > 200) {
    validationError.value = 'El título no puede superar los 200 caracteres.'
    return
  }

  validationError.value = null
  emit('submit', {
    title: trimmed,
    priority: priority.value || null,
    due_date: dueDate.value || null,
  })

  title.value = ''
  priority.value = ''
  dueDate.value = ''
}
</script>

<template>
  <form
    class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div class="flex-1">
        <label for="todo-title" class="sr-only">Título de la tarea</label>
        <input
          id="todo-title"
          v-model="title"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          maxlength="200"
          class="w-full rounded-lg border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :disabled="props.submitting"
        />
      </div>

      <div class="flex gap-2">
        <select
          v-model="priority"
          aria-label="Prioridad"
          class="rounded-lg border-0 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-700 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :disabled="props.submitting"
        >
          <option value="">Prioridad</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>

        <input
          v-model="dueDate"
          type="date"
          aria-label="Fecha límite"
          class="rounded-lg border-0 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-700 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :disabled="props.submitting"
        />

        <button
          type="submit"
          class="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="props.submitting"
        >
          {{ props.submitting ? 'Añadiendo…' : 'Añadir' }}
        </button>
      </div>
    </div>

    <p v-if="validationError" class="mt-2 text-sm text-red-600">
      {{ validationError }}
    </p>
  </form>
</template>
