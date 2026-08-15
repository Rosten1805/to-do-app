<script setup lang="ts">
// Dynamic single-month calendar, computed from the real Date object (no
// hardcoded dates), navigable month by month, today highlighted.
import { ref, computed } from 'vue'

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]
const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-11

type DayCell = { day: number; isToday: boolean } | null

const cells = computed<DayCell[]>(() => {
  const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1)
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  // getDay() is 0=Sunday..6=Saturday; shift so the week starts on Monday.
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7

  const result: DayCell[] = Array.from({ length: leadingBlanks }, () => null)
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      viewYear.value === today.getFullYear() && viewMonth.value === today.getMonth() && day === today.getDate()
    result.push({ day, isToday })
  }
  return result
})

const monthLabel = computed(() => `${MONTH_NAMES[viewMonth.value]} ${viewYear.value}`)

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
}
function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
}
function goToToday() {
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
}
</script>

<template>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
    <div class="flex items-center justify-between">
      <p class="font-mono text-sm font-semibold capitalize text-white">{{ monthLabel }}</p>
      <div class="flex items-center gap-1">
        <button
          type="button"
          aria-label="Mes anterior"
          class="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-link"
          @click="prevMonth"
        >
          ‹
        </button>
        <button
          type="button"
          class="rounded-lg border border-white/10 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-link"
          @click="goToToday"
        >
          Hoy
        </button>
        <button
          type="button"
          aria-label="Mes siguiente"
          class="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-link"
          @click="nextMonth"
        >
          ›
        </button>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-7 gap-y-1.5 text-center text-[11px] text-slate-500">
      <span v-for="wd in WEEKDAY_LABELS" :key="wd">{{ wd }}</span>
    </div>
    <div class="grid grid-cols-7 gap-y-1.5 text-center text-sm">
      <span
        v-for="(cell, idx) in cells"
        :key="idx"
        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full font-mono"
        :class="cell ? (cell.isToday ? 'bg-brand font-semibold text-white' : 'text-slate-300') : ''"
      >
        {{ cell?.day ?? '' }}
      </span>
    </div>
  </div>
</template>
