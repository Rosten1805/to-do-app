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
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-start">
      <div class="flex-1">
        <label for="todo-title" class="sr-only">Título de la tarea</label>
        <input
          id="todo-title"
          v-model="title"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          maxlength="200"
          class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white ring-0 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand"
          :disabled="props.submitting"
        />
      </div>

      <div class="flex flex-wrap gap-2.5">
        <select
          v-model="priority"
          aria-label="Prioridad"
          class="rounded-xl border border-white/10 bg-white/5 px-3.5 py-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand [color-scheme:dark]"
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
          class="rounded-xl border border-white/10 bg-white/5 px-3.5 py-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand [color-scheme:dark]"
          :disabled="props.submitting"
        />

        <button
          type="submit"
          class="shrink-0 rounded-xl bg-brand px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-link disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="props.submitting"
        >
          {{ props.submitting ? 'Añadiendo…' : 'Añadir' }}
        </button>
      </div>
    </div>

    <p v-if="validationError" role="alert" class="mt-2 text-sm text-red-300">
      {{ validationError }}
    </p>
  </form>
</template>
