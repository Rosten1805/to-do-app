<script setup lang="ts">
import { ref } from 'vue'
import type { Todo, TodoPriority } from '../types/todo'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps<{
  todo: Todo
  updating?: boolean
}>()

const emit = defineEmits<{
  toggle: [todo: Todo]
  update: [id: string, changes: { title: string; priority: TodoPriority | null; due_date: string | null }]
  delete: [id: string]
}>()

const isEditing = ref(false)
const editTitle = ref(props.todo.title)
const editPriority = ref<TodoPriority | ''>(props.todo.priority ?? '')
const editDueDate = ref(props.todo.due_date ?? '')
const editError = ref<string | null>(null)
const confirmingDelete = ref(false)

const priorityStyles: Record<TodoPriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
}

const priorityLabels: Record<TodoPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

function startEdit() {
  editTitle.value = props.todo.title
  editPriority.value = props.todo.priority ?? ''
  editDueDate.value = props.todo.due_date ?? ''
  editError.value = null
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  editError.value = null
}

function saveEdit() {
  const trimmed = editTitle.value.trim()
  if (!trimmed) {
    editError.value = 'El título es obligatorio.'
    return
  }
  emit('update', props.todo.id, {
    title: trimmed,
    priority: editPriority.value || null,
    due_date: editDueDate.value || null,
  })
  isEditing.value = false
}

function requestDelete() {
  confirmingDelete.value = true
}

function confirmDelete() {
  confirmingDelete.value = false
  emit('delete', props.todo.id)
}
</script>

<template>
  <li
    class="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md sm:flex-row sm:items-start"
  >
    <input
      type="checkbox"
      :checked="todo.is_done"
      :disabled="updating"
      aria-label="Marcar como completada"
      class="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
      @change="emit('toggle', todo)"
    />

    <div v-if="!isEditing" class="min-w-0 flex-1">
      <p
        class="break-words text-sm font-medium text-slate-900"
        :class="{ 'text-slate-400 line-through': todo.is_done }"
      >
        {{ todo.title }}
      </p>
      <div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span
          v-if="todo.priority"
          class="rounded-full px-2 py-0.5 font-medium"
          :class="priorityStyles[todo.priority]"
        >
          {{ priorityLabels[todo.priority] }}
        </span>
        <span v-if="todo.due_date">Vence: {{ todo.due_date }}</span>
      </div>
    </div>

    <div v-else class="flex min-w-0 flex-1 flex-col gap-2">
      <input
        v-model="editTitle"
        type="text"
        maxlength="200"
        class="w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
      />
      <div class="flex flex-wrap gap-2">
        <select
          v-model="editPriority"
          class="rounded-lg border-0 bg-slate-50 px-2 py-1.5 text-xs ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Prioridad</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <input
          v-model="editDueDate"
          type="date"
          class="rounded-lg border-0 bg-slate-50 px-2 py-1.5 text-xs ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <p v-if="editError" class="text-xs text-red-600">{{ editError }}</p>
    </div>

    <div class="flex shrink-0 gap-1.5 sm:mt-0">
      <template v-if="isEditing">
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          @click="saveEdit"
        >
          Guardar
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="cancelEdit"
        >
          Cancelar
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="startEdit"
        >
          Editar
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          @click="requestDelete"
        >
          Eliminar
        </button>
      </template>
    </div>
  </li>

  <ConfirmDialog
    :open="confirmingDelete"
    title="Eliminar tarea"
    :message="`¿Seguro que quieres eliminar '${todo.title}'? Esta acción no se puede deshacer.`"
    @confirm="confirmDelete"
    @cancel="confirmingDelete = false"
  />
</template>
