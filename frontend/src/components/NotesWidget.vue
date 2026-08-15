<script setup lang="ts">
// Quick scratch notes. Persisted only in this browser's localStorage — not
// synced through Supabase, so they don't follow the user across devices.
// A conscious scope choice: adding a synced/per-user notes table would need
// its own schema + RLS policies, out of proportion for a "quick notes" pad.
import { ref, watch } from 'vue'

const STORAGE_KEY = 'todo-app-notes'

const notes = ref(localStorage.getItem(STORAGE_KEY) ?? '')
const savedAt = ref<string | null>(null)

let saveTimeout: ReturnType<typeof setTimeout> | undefined

watch(notes, (value) => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, value)
    savedAt.value = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }, 400)
})
</script>

<template>
  <div class="flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
    <div class="flex items-center justify-between">
      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Notas rápidas</p>
      <span v-if="savedAt" class="font-mono text-[11px] text-slate-500">Guardado {{ savedAt }}</span>
    </div>
    <textarea
      v-model="notes"
      rows="4"
      placeholder="Escribe algo para recordar…"
      class="mt-3 w-full flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand"
    ></textarea>
    <p class="mt-2 text-[11px] text-slate-500">Solo se guardan en este navegador.</p>
  </div>
</template>
