<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const submitting = ref(false)
const formError = ref<string | null>(null)

const { signIn } = useAuth()
const router = useRouter()
const route = useRoute()

function validate(): string | null {
  if (!email.value.trim()) return 'El email es obligatorio.'
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return 'Introduce un email válido.'
  if (!password.value) return 'La contraseña es obligatoria.'
  return null
}

async function handleSubmit() {
  formError.value = validate()
  if (formError.value) return

  submitting.value = true
  const result = await signIn(email.value.trim(), password.value)
  submitting.value = false

  if (!result.success) {
    formError.value = result.error
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push(redirect)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 class="text-xl font-semibold text-slate-900">Inicia sesión</h1>
      <p class="mt-1 text-sm text-slate-500">Accede a tus tareas.</p>

      <form class="mt-6 flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full rounded-lg border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-lg border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

        <button
          type="submit"
          class="mt-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?
        <RouterLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-700"
          >Regístrate</RouterLink
        >
      </p>
    </div>
  </div>
</template>
