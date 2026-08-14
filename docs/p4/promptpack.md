# P4 — Prompt pack / decisiones de implementación

Registro de las decisiones tomadas durante la construcción del MVP, para que
quede trazado por qué el proyecto quedó como quedó.

## Encargo original

Construir directamente (sin tutorial, sin solo documentación) una To-Do App
MVP funcional con Vue 3 + Vite + TypeScript + Tailwind + Supabase (Postgres +
Auth + RLS) + Vercel + Git, con CRUD completo de tareas, filtros, estados de
loading/vacío/error, confirmación de borrado, validación básica y RLS
estricta (`auth.uid() = user_id`).

## Decisiones técnicas relevantes

- **Vite scaffold**: `create-vite@latest frontend --template vue-ts` (Vue 3 +
  TypeScript "no-router" base), sobre el que se añadió `vue-router`,
  `@supabase/supabase-js`, Tailwind v4 y ESLint manualmente.
- **Tailwind v4** (no v3): el scaffold instaló `tailwindcss@4` por defecto.
  Se usó el flujo v4 (`@import "tailwindcss"` en `style.css` +
  `@tailwindcss/postcss` en `postcss.config.js`), sin `tailwind.config.js`
  (v4 no lo requiere para un uso estándar de utilidades).
- **Estado global vía composables singleton**, no Pinia/Vuex: `useAuth()` y
  `useTodos()` guardan su estado en variables a nivel de módulo (`ref(...)`
  fuera de la función exportada), así todos los componentes comparten la
  misma sesión/lista sin añadir una librería de estado para un MVP de este
  tamaño.
- **Edición inline en `TodoItem`** en vez de un modal/formulario separado:
  menos fricción de UX para un caso de uso tan simple (cambiar título,
  prioridad o fecha).
- **Borrado optimista** en `useTodos.deleteTodo`: la tarea se quita de la
  lista inmediatamente y se revierte si Supabase devuelve error, para que la
  UI se sienta instantánea sin sacrificar consistencia.
- **`type` en vez de `interface`** para los tipos de dominio y de base de
  datos ([`data_model.md`](./data_model.md)): necesario para que
  `supabase-js` infiera correctamente los tipos de `.insert()` / `.update()`
  — con `interface` todas las queries tipaban como `never` de forma
  silenciosa. Documentado también como comentario en
  `src/types/supabase.ts`.
- **RLS como única barrera de aislamiento**: no hay backend intermedio; todas
  las queries van del navegador a Supabase con la `anon key`, así que la
  seguridad real vive en las políticas de `supabase/schema.sql`, no en el
  frontend.
- **Mensajes de error en español y "traducidos"**: `useAuth.mapAuthError`
  convierte mensajes técnicos de Supabase Auth (en inglés) a mensajes
  legibles para el usuario final.

## Lo que NO se inventó / no se implementó

Ver la sección "Explícitamente fuera de alcance" en
[`scope.md`](./scope.md) — recuperación de contraseña, OAuth social,
subtareas/etiquetas, notificaciones y tests automatizados no están en el
código y no se documentan como si existieran en ninguna otra parte de
`docs/p4/`.

## Bloqueos que requirieron intervención manual

1. **Creación del proyecto Supabase real** — este entorno no tiene sesión de
   `supabase` CLI ni acceso al dashboard; ver
   [`integration_plan.md`](./integration_plan.md) para los pasos exactos.
2. **Deploy en Vercel** — este entorno no tiene sesión de `vercel` CLI; ver
   [`deploy_vercel.md`](./deploy_vercel.md).
3. **Push a GitHub** — no autorizado automáticamente por instrucción
   explícita del encargo ("NO hagas push automáticamente si no tienes
   autorización explícita").
