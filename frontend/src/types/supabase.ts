// Minimal typed schema for the Supabase database used by this app.
// Kept hand-written and in sync with docs/p4/data_model.md; regenerate with
// `supabase gen types typescript` if the schema evolves.
//
// NOTE: these must be `type` aliases, not `interface`s. supabase-js checks
// `Row/Insert/Update extends Record<string, unknown>` internally, and
// TypeScript only synthesizes an implicit index signature for that check on
// type-literal aliases, not on interfaces — using `interface` here silently
// breaks all query typing (everything resolves to `never`).
import type { Todo, TodoPriority } from './todo'

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '13'
  }
  public: {
    Tables: {
      todos: {
        Row: Todo
        Insert: {
          id?: string
          user_id: string
          title: string
          is_done?: boolean
          priority?: TodoPriority | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          is_done?: boolean
          priority?: TodoPriority | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
