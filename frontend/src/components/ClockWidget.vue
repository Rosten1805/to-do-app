<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const timeLabel = computed(() =>
  now.value.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
)
const dateLabel = computed(() =>
  now.value.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
)
</script>

<template>
  <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
    <div>
      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Hora actual</p>
      <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">{{ timeLabel }}</p>
    </div>
    <p class="text-right text-sm capitalize text-slate-400">{{ dateLabel }}</p>
  </div>
</template>
