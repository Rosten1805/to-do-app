# P4 — Modelo de datos

## Tabla `public.todos`

Definida en [`supabase/schema.sql`](../../supabase/schema.sql).

| Columna      | Tipo         | Constraints                                              |
| ------------ | ------------ | --------------------------------------------------------- |
| `id`         | `uuid`       | PK, `default gen_random_uuid()`                            |
| `user_id`    | `uuid`       | `not null`, FK → `auth.users(id)` `on delete cascade`      |
| `title`      | `text`       | `not null`, `check (char_length(trim(title)) between 1 and 200)` |
| `is_done`    | `boolean`    | `not null default false`                                    |
| `priority`   | `text`       | opcional, `check (priority in ('low','medium','high'))`     |
| `due_date`   | `date`       | opcional                                                     |
| `created_at` | `timestamptz`| `not null default now()`                                     |
| `updated_at` | `timestamptz`| `not null default now()`, actualizado por trigger             |

### Decisiones de diseño

- **UUID como PK**: `gen_random_uuid()` (extensión `pgcrypto`, disponible por
  defecto en Supabase) evita IDs predecibles y permite generarlos también en
  el cliente si hiciera falta.
- **`user_id` referencia `auth.users`**: es la única forma soportada de
  vincular una fila a un usuario de Supabase Auth. `on delete cascade`
  asegura que si se borra un usuario, sus tareas se eliminan con él (no
  quedan huérfanas).
- **`priority` como `text` + `check`** en vez de un `enum` de Postgres: más
  simple de migrar/extender sin `ALTER TYPE`, con la misma garantía de
  integridad a nivel de fila. En el frontend se tipa como el literal union
  `'low' | 'medium' | 'high'` ([`src/types/todo.ts`](../../frontend/src/types/todo.ts)).
- **`updated_at` automático**: un trigger `before update` (`set_updated_at`)
  reescribe `updated_at = now()` en cada `UPDATE`, para no depender de que el
  cliente lo mande correctamente.
- **Validación de `title` a nivel de base de datos**: además de la validación
  en el formulario (frontend), un `check` en la columna impide títulos vacíos
  o excesivamente largos aunque la petición no pase por la UI.

### Índices

```sql
create index todos_user_id_created_at_idx on public.todos (user_id, created_at desc);
create index todos_user_id_is_done_idx    on public.todos (user_id, is_done);
```

- `(user_id, created_at desc)`: cubre la consulta principal del listado
  (`select * from todos where user_id = ? order by created_at desc`).
- `(user_id, is_done)`: acelera los filtros "Pendientes" / "Completadas".

## Tipos TypeScript

- [`src/types/todo.ts`](../../frontend/src/types/todo.ts) — tipos de dominio
  (`Todo`, `TodoInsert`, `TodoUpdate`, `TodoFilter`).
- [`src/types/supabase.ts`](../../frontend/src/types/supabase.ts) — tipado
  del cliente `supabase-js` (`Database`), usado por
  `createClient<Database>(...)` en [`src/lib/supabase.ts`](../../frontend/src/lib/supabase.ts)
  para tener autocompletado y chequeo de tipos en cada `.from('todos')`.

> Nota técnica: estos tipos están declarados como `type`, no como
> `interface`. `supabase-js` comprueba internamente que `Row/Insert/Update`
> sean asignables a `Record<string, unknown>`; TypeScript solo sintetiza una
> index signature implícita para ese chequeo en alias de tipo (`type`), no en
> `interface`. Usar `interface` ahí rompe silenciosamente el tipado de todas
> las queries (todo resuelve a `never`).

Si el esquema evoluciona, estos tipos pueden regenerarse con:

```bash
npx supabase gen types typescript --project-id <project-ref> > src/types/supabase-generated.ts
```
