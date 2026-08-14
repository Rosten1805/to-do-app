# P4 — Mapa de UI y componentes

## Rutas ([`src/router/index.ts`](../../frontend/src/router/index.ts))

| Ruta         | Vista            | Guard                                             |
| ------------ | ---------------- | -------------------------------------------------- |
| `/login`     | `LoginView`      | `guestOnly` — redirige a `/` si ya hay sesión        |
| `/register`  | `RegisterView`   | `guestOnly` — redirige a `/` si ya hay sesión        |
| `/`          | `TodosView`      | `requiresAuth` — redirige a `/login` si no hay sesión |
| `/:pathMatch(.*)*` | —          | redirige a `/`                                        |

El guard espera a que `useAuth().initialized` sea `true` (primera resolución
de `supabase.auth.getSession()`) antes de decidir, para no expulsar a un
usuario autenticado durante un refresco de página.

## Vistas

- **`LoginView.vue`** — formulario email/contraseña, validación básica,
  mensaje de error mapeado desde Supabase Auth, enlace a registro.
- **`RegisterView.vue`** — formulario email/contraseña/confirmación,
  validación (email válido, contraseña ≥ 6 caracteres, coincidencia),
  gestiona el caso de confirmación de email pendiente.
- **`TodosView.vue`** — pantalla principal tras login: cabecera con email del
  usuario y botón de logout, formulario de alta, filtros y listado.

## Componentes ([`src/components/`](../../frontend/src/components/))

| Componente        | Responsabilidad                                                        |
| ------------------ | ------------------------------------------------------------------------ |
| `TodoForm.vue`      | Alta de tarea nueva (título, prioridad, fecha límite) + validación         |
| `TodoFilters.vue`   | Selector Todas/Pendientes/Completadas con contador por filtro              |
| `TodoList.vue`      | Orquesta los estados loading / error / empty / lista y delega en `TodoItem` |
| `TodoItem.vue`      | Una tarea: checkbox, edición inline, badge de prioridad, fecha, borrado    |
| `ConfirmDialog.vue` | Modal de confirmación genérico (usado antes de eliminar una tarea)          |

## Composables ([`src/composables/`](../../frontend/src/composables/))

- **`useAuth.ts`** — estado de sesión (singleton a nivel de módulo),
  `signUp` / `signIn` / `signOut`, mapeo de mensajes de error de Supabase a
  español.
- **`useTodos.ts`** — estado de tareas (singleton a nivel de módulo):
  `fetchTodos`, `addTodo`, `updateTodo`, `toggleDone`, `deleteTodo`,
  `setFilter`, contadores derivados (`counts`), lista filtrada
  (`filteredTodos`), estado `loading` / `error` / `isEmpty`.

Separación deliberada: los composables solo hablan con `lib/supabase.ts` y
exponen datos/acciones; los componentes no importan `supabase` directamente
en ningún punto — toda la lógica de negocio vive en `composables/`.

## Estados cubiertos en `TodoList.vue`

1. **Loading** — spinner + texto mientras `fetchTodos()` está en curso.
2. **Error** — mensaje + botón "Reintentar" si la query falla.
3. **Empty** — mensaje distinto según el filtro activo (sin tareas / sin
   pendientes / sin completadas).
4. **Lista** — tarjetas de tarea con acciones.

## Responsive

- Layout centrado con ancho máximo (`max-w-2xl`) y padding lateral.
- `TodoForm` pasa de columna (móvil) a fila (`sm:flex-row`) para
  título/prioridad/fecha/botón.
- `TodoItem` apila checkbox/contenido/acciones en móvil y las alinea en fila
  a partir de `sm:`.
- Estados hover/focus-visible con anillos de foco (`focus-visible:ring-*`)
  en todos los elementos interactivos para accesibilidad de teclado.
