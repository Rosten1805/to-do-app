<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const submitting = ref(false)
const formError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const { signUp } = useAuth()
const router = useRouter()

function validate(): string | null {
  if (!email.value.trim()) return 'El email es obligatorio.'
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return 'Introduce un email válido.'
  if (password.value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  if (password.value !== confirmPassword.value) return 'Las contraseñas no coinciden.'
  return null
}

async function handleSubmit() {
  formError.value = validate()
  if (formError.value) return

  submitting.value = true
  const result = await signUp(email.value.trim(), password.value)
  submitting.value = false

  if (!result.success) {
    formError.value = result.error
    return
  }

  // If email confirmation is required, Supabase returns a user but no
  // active session yet; otherwise the auth listener will pick up the
  // session and the router guard sends the user straight to /.
  if (result.data.session) {
    router.push('/')
  } else {
    successMessage.value = 'Cuenta creada. Revisa tu email para confirmar la cuenta antes de iniciar sesión.'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 class="text-xl font-semibold text-slate-900">Crea tu cuenta</h1>
      <p class="mt-1 text-sm text-slate-500">Organiza tus tareas en segundos.</p>

      <form v-if="!successMessage" class="mt-6 flex flex-col gap-4" @submit.prevent="handleSubmit">
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
            autocomplete="new-password"
            class="w-full rounded-lg border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="confirm-password" class="mb-1 block text-sm font-medium text-slate-700"
            >Confirmar contraseña</label
          >
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            class="w-full rounded-lg border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

        <button
          type="submit"
          class="mt-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Creando cuenta…' : 'Crear cuenta' }}
        </button>
      </form>

      <div v-else class="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-100">
        {{ successMessage }}
      </div>

      <p class="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-700"
          >Inicia sesión</RouterLink
        >
      </p>
    </div>
  </div>
</template>
