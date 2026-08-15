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
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    :aria-label="title"
    @keydown.esc="emit('cancel')"
  >
    <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
      <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
      <p class="mt-2 text-sm text-slate-400">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl bg-[#232027] px-4 py-2 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] hover:bg-brand-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          @click="emit('cancel')"
        >
          {{ cancelLabel ?? 'Cancelar' }}
        </button>
        <button
          type="button"
          class="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          @click="emit('confirm')"
        >
          {{ confirmLabel ?? 'Eliminar' }}
        </button>
      </div>
    </div>
  </div>
</template>
