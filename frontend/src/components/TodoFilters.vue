<script setup lang="ts">
import type { TodoFilter } from '../types/todo'

defineProps<{
  modelValue: TodoFilter
  counts: { all: number; pending: number; completed: number }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TodoFilter]
}>()

const options: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]
</script>

<template>
  <div class="flex gap-2" role="tablist" aria-label="Filtrar tareas">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === opt.value"
      class="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      :class="
        modelValue === opt.value
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'
      "
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
      <span
        class="ml-1 text-xs"
        :class="modelValue === opt.value ? 'text-indigo-100' : 'text-slate-400'"
        >{{ counts[opt.value] }}</span
      >
    </button>
  </div>
</template>
