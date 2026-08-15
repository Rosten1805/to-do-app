# To-Do App — P4 MVP

Aplicación de tareas personales full-stack: **Vue 3 + Vite + TypeScript +
Tailwind CSS** en el frontend, **Supabase** (PostgreSQL + Auth + Row Level
Security) como backend, desplegada en **Netlify**.

**🔗 Demo en producción:** https://to-do-app-p4.netlify.app

## Qué hace

Cada usuario se registra con email/contraseña, inicia sesión, y gestiona su
propia lista de tareas — completamente aislada de la de cualquier otro
usuario a nivel de base de datos (no solo en la interfaz).

- Registro, login, logout y persistencia de sesión (con opción "mantener
  sesión iniciada")
- Crear, editar (inline), completar y eliminar tareas (con confirmación)
- Prioridad opcional (baja/media/alta) y fecha límite opcional por tarea
- Filtros Todas / Pendientes / Completadas con contador
- Estados de carga, vacío y error, con reintento
- Validación de formularios (auth y tareas)
- Widgets del panel: reloj en vivo, calendario del mes actual, notas rápidas
  (guardadas solo en el navegador)
- Diseño responsive, tema oscuro con glassmorfismo

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | Vue 3 (Composition API, `<script setup>`) + TypeScript |
| Build tool | Vite |
| Estilos | Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + Auth + REST autogenerada) |
| Seguridad | Supabase Auth + Row Level Security (RLS) |
| Hosting | Netlify |
| Control de versiones | Git / GitHub |

## Estructura del repositorio

```
to-do app/
├── frontend/            # App Vue 3 + Vite + TS
│   ├── src/
│   │   ├── components/   # UI reutilizable (TodoList, TodoItem, TodoForm,
│   │   │                 # TodoFilters, ClockWidget, CalendarWidget, NotesWidget, ...)
│   │   ├── views/        # LoginView, RegisterView, TodosView
│   │   ├── composables/  # useAuth, useTodos (lógica de negocio)
│   │   ├── lib/          # cliente Supabase, modo mock de preview
│   │   ├── types/        # tipos de dominio + tipos de la BD
│   │   └── router/       # rutas y guards de autenticación
│   └── netlify.toml      # config de build + fallback SPA
├── supabase/
│   └── schema.sql        # tabla, índices, RLS y políticas
└── docs/p4/              # documentación del proyecto
```

## Puesta en marcha local

Requiere un proyecto Supabase con el esquema aplicado — pasos exactos en
[`docs/p4/integration_plan.md`](./docs/p4/integration_plan.md). Resumen:

```bash
cd frontend
npm install
cp .env.example .env.local   # rellenar con la URL y la publishable key de tu proyecto Supabase
npm run dev
```

Abre `http://localhost:5173`.

> **Modo preview sin Supabase:** si solo quieres ver la interfaz sin conectar
> una base de datos real, pon `VITE_MOCK_AUTH=true` en `.env.local` y entra
> con `demo@todo.app` / `demo1234` (datos en memoria, no persisten). Ver
> [`frontend/src/lib/mock.ts`](./frontend/src/lib/mock.ts).

## Base de datos y seguridad

La tabla `todos` vive en `public`, referenciada a `auth.users`, con Row
Level Security **activada y forzada**. Las cuatro políticas
(`SELECT`/`INSERT`/`UPDATE`/`DELETE`) se reducen todas a la misma regla:

```sql
auth.uid() = user_id
```

Un usuario nunca puede leer, crear, editar ni borrar tareas de otro usuario
— ni siquiera si manipulara las peticiones desde el navegador — porque la
restricción vive en la base de datos, no en el frontend. Detalle completo en
[`docs/p4/security_rls.md`](./docs/p4/security_rls.md) y el SQL en
[`supabase/schema.sql`](./supabase/schema.sql).

## Scripts (dentro de `frontend/`)

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Typecheck + build de producción a `dist/` |
| `npm run preview` | Sirve `dist/` localmente |
| `npm run typecheck` | Solo typecheck (`vue-tsc`), sin build |
| `npm run lint` | ESLint sobre todo el proyecto |

## Despliegue

Desplegado en Netlify desde `frontend/` (`npm run build` → `dist/`), con
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` configuradas como variables
de entorno del site (nunca en el código). Detalle completo, incluyendo cómo
redesplegar, en [`docs/p4/deploy_netlify.md`](./docs/p4/deploy_netlify.md).

## Documentación

| Documento | Contenido |
| ----------- | ----------- |
| [`docs/p4/scope.md`](./docs/p4/scope.md) | Alcance del MVP: qué está incluido y qué explícitamente no |
| [`docs/p4/data_model.md`](./docs/p4/data_model.md) | Esquema de la tabla `todos`, índices, tipos TypeScript |
| [`docs/p4/security_rls.md`](./docs/p4/security_rls.md) | Row Level Security: políticas y cómo verificarlas |
| [`docs/p4/ui_map.md`](./docs/p4/ui_map.md) | Rutas, vistas y componentes |
| [`docs/p4/integration_plan.md`](./docs/p4/integration_plan.md) | Cómo conectar un proyecto Supabase (propio o nuevo) |
| [`docs/p4/deploy_netlify.md`](./docs/p4/deploy_netlify.md) | Cómo se desplegó y cómo redesplegar |
| [`docs/p4/promptpack.md`](./docs/p4/promptpack.md) | Decisiones de implementación y su porqué |
