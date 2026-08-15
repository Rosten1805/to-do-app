<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../components/AuthLayout.vue'

const email = ref('')
const password = ref('')
const submitting = ref(false)
const formError = ref<string | null>(null)

const { signIn, getRememberMe } = useAuth()
const rememberMe = ref(getRememberMe())
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
  const result = await signIn(email.value.trim(), password.value, rememberMe.value)
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
  <AuthLayout mode="login">
    <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 class="text-xl font-semibold text-slate-900">Bienvenido de nuevo</h2>
      <p class="mt-1 text-sm text-slate-500">Accede a tus tareas.</p>

      <form class="mt-6 flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full rounded-lg border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-lg border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-brand focus:outline-none focus:ring-2 focus:ring-brand"
          />
          Mantener sesión iniciada
        </label>

        <p v-if="formError" role="alert" class="text-sm text-red-600">{{ formError }}</p>

        <button
          type="submit"
          class="mt-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_rgba(168,85,247,0.25)] hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-link disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>
    </div>
  </AuthLayout>
</template>
