// -----------------------------------------------------------------------------
// TEMPORARY preview mode — simulates auth + the todos backend entirely in the
// browser, with NO network calls to Supabase. Exists only so the UI can be
// reviewed before a real Supabase project is connected.
//
// Enabled via VITE_MOCK_AUTH=true in .env.local (see .env.example — this flag
// is intentionally NOT part of the example file, so it's opt-in only).
//
// Remove this file and its usages in useAuth.ts / useTodos.ts once the real
// Supabase project is wired up — it is not meant to ship to production.
// -----------------------------------------------------------------------------
import type { Session, User } from '@supabase/supabase-js'
import type { Todo } from '../types/todo'

export const MOCK_AUTH_ENABLED = import.meta.env.VITE_MOCK_AUTH === 'true'

export const MOCK_CREDENTIALS = {
  email: 'demo@todo.app',
  password: 'demo1234',
}

const MOCK_USER_ID = '00000000-0000-4000-8000-000000000001'

export function createMockUser(email: string): User {
  const now = new Date().toISOString()
  return {
    id: MOCK_USER_ID,
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: now,
    phone: '',
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: { provider: 'mock' },
    user_metadata: {},
    identities: [],
    created_at: now,
    updated_at: now,
  } as unknown as User
}

export function createMockSession(email: string): Session {
  const user = createMockUser(email)
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user,
  } as unknown as Session
}

function seedTodos(): Todo[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'mock-1',
      user_id: MOCK_USER_ID,
      title: 'Revisar el diseño del panel',
      is_done: false,
      priority: 'high',
      due_date: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'mock-2',
      user_id: MOCK_USER_ID,
      title: 'Conectar el proyecto Supabase real',
      is_done: false,
      priority: 'medium',
      due_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      created_at: now,
      updated_at: now,
    },
    {
      id: 'mock-3',
      user_id: MOCK_USER_ID,
      title: 'Probar el filtro de completadas',
      is_done: true,
      priority: 'low',
      due_date: null,
      created_at: now,
      updated_at: now,
    },
  ]
}

// Local, in-memory "database" for the todos while mock mode is active.
export const mockTodosStore: Todo[] = seedTodos()
