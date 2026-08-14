<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    role="dialog"
    aria-modal="true"
    :aria-label="title"
    @keydown.esc="emit('cancel')"
  >
    <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
      <p class="mt-2 text-sm text-slate-600">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="emit('cancel')"
        >
          {{ cancelLabel ?? 'Cancelar' }}
        </button>
        <button
          type="button"
          class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          @click="emit('confirm')"
        >
          {{ confirmLabel ?? 'Eliminar' }}
        </button>
      </div>
    </div>
  </div>
</template>
