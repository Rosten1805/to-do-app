<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  mode: 'login' | 'register'
}>()
</script>

<template>
  <div class="flex min-h-screen bg-brand-bg">
    <!-- Left: brand / product preview. Hidden below lg — the form alone
         carries the page on mobile. -->
    <div class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-bg p-12 lg:flex">
      <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl"></div>
      <div class="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="mb-10 flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-base text-white"
            >✓</span
          >
          <span class="font-mono text-sm font-semibold tracking-wide text-white">TO-DO APP</span>
        </div>

        <h1 class="max-w-xl text-5xl font-bold tracking-tight leading-[1.05] text-white lg:text-6xl">
          Tu día, ordenado <span class="text-brand-link">de un vistazo.</span>
        </h1>
        <p class="mt-4 max-w-sm text-base text-slate-300">
          Crea tareas, prioriza lo importante y sigue tu progreso en un espacio
          privado, pensado para trabajar sin fricción.
        </p>
      </div>

      <!-- Decorative preview card — mirrors the real app's own styling
           (priority badges, filter chips, checkboxes), not a mockup of
           something the app doesn't actually do. -->
      <div class="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-white">Mis tareas</p>
          <span class="text-xs text-slate-400">hoy</span>
        </div>

        <div class="mt-4 flex gap-2">
          <span class="rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">Todas</span>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Pendientes</span>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Completadas</span>
        </div>

        <ul class="mt-4 flex flex-col gap-2.5">
          <li class="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <span class="h-4 w-4 shrink-0 rounded border border-slate-400"></span>
            <span class="flex-1 truncate text-sm text-white">Revisar propuesta de diseño</span>
            <span class="rounded-full bg-red-400/20 px-2 py-0.5 text-[11px] font-medium text-red-300">Alta</span>
          </li>
          <li class="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <span class="h-4 w-4 shrink-0 rounded border border-slate-400"></span>
            <span class="flex-1 truncate text-sm text-white">Enviar informe semanal</span>
            <span class="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-medium text-amber-300"
              >Media</span
            >
          </li>
          <li class="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 opacity-60">
            <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-brand text-[10px] text-white"
              >✓</span
            >
            <span class="flex-1 truncate text-sm text-slate-300 line-through">Planificar la semana</span>
            <span class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-400">Baja</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Right: auth form -->
    <div class="flex w-full flex-1 items-center justify-center bg-slate-50 px-4 py-12 lg:w-1/2">
      <div class="w-full max-w-sm">
        <div class="mb-6 flex items-center justify-center gap-2 lg:hidden">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-sm text-white"
            >✓</span
          >
          <span class="text-sm font-semibold tracking-wide text-slate-900">TO-DO APP</span>
        </div>

        <div class="mb-6 flex rounded-full bg-slate-100 p-1">
          <RouterLink
            to="/login"
            class="flex-1 rounded-full py-2 text-center text-sm font-medium transition-colors"
            :class="mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            Entrar
          </RouterLink>
          <RouterLink
            to="/register"
            class="flex-1 rounded-full py-2 text-center text-sm font-medium transition-colors"
            :class="
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            "
          >
            Crear cuenta
          </RouterLink>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>
