# P4 — Seguridad y Row Level Security

## Principio

Cada fila de `public.todos` solo es visible/editable por su propietario. La
regla se aplica **en la base de datos**, no confiando en el frontend:

```sql
auth.uid() = user_id
```

`auth.uid()` es la función de Supabase que devuelve el UUID del usuario
autenticado a partir del JWT enviado en la petición (vía `anon key` +
sesión). Si no hay sesión válida, `auth.uid()` es `null` y ninguna fila
cumple la condición.

## RLS activado

```sql
alter table public.todos enable row level security;
alter table public.todos force row level security;
```

`force row level security` asegura que las políticas se apliquen incluso
para el propietario/owner de la tabla, no solo para roles externos.

## Políticas (definidas en [`supabase/schema.sql`](../../supabase/schema.sql))

| Política             | Operación | Regla                                                    |
| --------------------- | --------- | ---------------------------------------------------------- |
| `todos_select_own`    | `SELECT`  | `using (auth.uid() = user_id)`                              |
| `todos_insert_own`    | `INSERT`  | `with check (auth.uid() = user_id)`                          |
| `todos_update_own`    | `UPDATE`  | `using (auth.uid() = user_id) with check (auth.uid() = user_id)` |
| `todos_delete_own`    | `DELETE`  | `using (auth.uid() = user_id)`                                |

Todas se aplican al rol `authenticated` (usuarios con sesión válida). Los
usuarios anónimos (`anon`) no tienen ninguna política que les conceda acceso,
por lo que quedan bloqueados por defecto.

- **SELECT**: solo se devuelven filas donde `user_id` coincide con el usuario
  autenticado. Un usuario nunca puede leer tareas de otro, ni siquiera
  conociendo el `id` de la fila.
- **INSERT**: `with check` obliga a que la fila insertada tenga
  `user_id = auth.uid()`. El frontend siempre manda `user_id: user.value.id`
  explícitamente ([`useTodos.ts`](../../frontend/src/composables/useTodos.ts)),
  pero aunque no lo hiciera o intentara falsificarlo, la base de datos
  rechazaría el insert.
- **UPDATE**: `using` filtra qué filas son visibles para actualizar, `with
  check` impide que la actualización "reasigne" la tarea a otro `user_id`.
- **DELETE**: mismo criterio que `SELECT`.

## Frontend: ninguna credencial privilegiada expuesta

- El cliente ([`src/lib/supabase.ts`](../../frontend/src/lib/supabase.ts))
  se inicializa únicamente con `VITE_SUPABASE_URL` y
  `VITE_SUPABASE_ANON_KEY` — la **anon key pública**, diseñada para vivir en
  el navegador. Su alcance está limitado exactamente por las políticas RLS
  descritas arriba.
- La **service role key** (que evita RLS) **no se usa en ningún punto del
  frontend** y no debe copiarse jamás en `.env` de este proyecto ni en el
  dashboard de Vercel del sitio público.
- Todas las queries de tareas pasan por `supabase-js` desde el navegador
  (no hay backend intermedio en este MVP), por lo que RLS es la única y
  verdadera barrera de aislamiento entre usuarios.

## Verificación manual recomendada

1. Crear dos usuarios (A y B) vía `/register`.
2. Con A, crear un par de tareas.
3. Iniciar sesión como B: el listado debe aparecer vacío (empty state), no
   debe ver las tareas de A.
4. (Opcional, para probar el bloqueo a nivel de API) con la sesión de B,
   intentar un `PATCH`/`DELETE` manual contra el `id` de una tarea de A desde
   la consola del navegador usando el cliente `supabase` ya inicializado —
   debe devolver `0 rows` afectadas, nunca un error de "no autorizado"
   explícito ni datos de otro usuario.
