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
  <div class="flex flex-wrap gap-2.5" role="tablist" aria-label="Filtrar tareas">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === opt.value"
      class="rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-link"
      :class="
        modelValue === opt.value
          ? 'bg-brand text-white'
          : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
      "
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
      <span
        class="ml-1 font-mono text-xs"
        :class="modelValue === opt.value ? 'text-white/80' : 'text-slate-400'"
        >{{ counts[opt.value] }}</span
      >
    </button>
  </div>
</template>
