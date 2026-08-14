import { ref, computed } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Module-level (singleton) state so every component sees the same session.
const session = ref<Session | null>(null)
const user = ref<User | null>(null)
const initialized = ref(false)
const authError = ref<string | null>(null)

let listenerStarted = false

function startListener() {
  if (listenerStarted) return
  listenerStarted = true

  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    user.value = data.session?.user ?? null
    initialized.value = true
  })

  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    user.value = newSession?.user ?? null
    initialized.value = true
  })
}

function mapAuthError(message: string): string {
  const known: Record<string, string> = {
    'Invalid login credentials': 'Email o contraseña incorrectos.',
    'User already registered': 'Ya existe una cuenta con ese email.',
    'Email not confirmed': 'Debes confirmar tu email antes de iniciar sesión.',
  }
  return known[message] ?? message
}

export function useAuth() {
  startListener()

  const isAuthenticated = computed(() => !!session.value)

  async function signUp(email: string, password: string) {
    authError.value = null
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      authError.value = mapAuthError(error.message)
      return { success: false as const, error: authError.value }
    }
    return { success: true as const, data }
  }

  async function signIn(email: string, password: string) {
    authError.value = null
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      authError.value = mapAuthError(error.message)
      return { success: false as const, error: authError.value }
    }
    return { success: true as const, data }
  }

  async function signOut() {
    authError.value = null
    const { error } = await supabase.auth.signOut()
    if (error) {
      authError.value = mapAuthError(error.message)
      return { success: false as const, error: authError.value }
    }
    return { success: true as const }
  }

  return {
    session,
    user,
    initialized,
    authError,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
  }
}
