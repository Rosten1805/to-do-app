# P4 — To-Do App MVP — Alcance

## Objetivo

MVP funcional y desplegable de una aplicación de tareas personales, con
autenticación de usuarios y aislamiento de datos por usuario (RLS).

## Stack implementado

| Capa            | Tecnología                                    |
| ---------------- | ---------------------------------------------- |
| Frontend         | Vue 3 (Composition API, `<script setup>`) + TypeScript |
| Build tool        | Vite                                           |
| Estilos          | Tailwind CSS v4                                |
| Backend          | Supabase (PostgreSQL + Auth + REST autogenerada) |
| Seguridad        | Supabase Auth + Row Level Security (RLS)       |
| Hosting          | Vercel                                         |
| Control de versiones | Git / GitHub                                |

## Funcionalidades incluidas (MVP)

- Registro de usuario (email + contraseña)
- Login
- Logout
- Persistencia de sesión (refresco de página mantiene sesión)
- Listado de tareas del usuario autenticado
- Crear tarea (título, prioridad opcional, fecha límite opcional)
- Editar tarea (inline, en el propio listado)
- Marcar/desmarcar tarea como completada
- Eliminar tarea, con diálogo de confirmación
- Filtros: Todas / Pendientes / Completadas (con contador por filtro)
- Estado de carga (loading) al listar tareas
- Estado vacío (empty state) diferenciado por filtro
- Estado de error con botón "Reintentar"
- Validación básica de formularios (título obligatorio, longitud máxima,
  formato de email, longitud mínima de contraseña, confirmación de contraseña)
- Diseño responsive (mobile-first, breakpoints con Tailwind)

## Explícitamente fuera de alcance (no implementado)

- Recuperación de contraseña / magic links
- Login social (OAuth con Google, GitHub, etc.)
- Subtareas, etiquetas, listas múltiples o compartición de tareas
- Notificaciones push o recordatorios
- Tests automatizados (unitarios/e2e)
- Paginación del listado de tareas (Supabase limita a 1000 filas por defecto,
  suficiente para el uso de un MVP personal)

## Estructura del repositorio

```
to-do app/
├── frontend/           # App Vue 3 + Vite + TS
│   └── src/
│       ├── components/  # UI reutilizable (TodoList, TodoItem, TodoForm, TodoFilters, ConfirmDialog)
│       ├── views/        # LoginView, RegisterView, TodosView
│       ├── composables/  # useAuth, useTodos
│       ├── lib/           # cliente Supabase
│       ├── types/         # tipos de dominio + tipos de la BD
│       └── router/        # rutas y guards
├── supabase/
│   └── schema.sql        # tabla, índices, RLS y políticas
└── docs/p4/               # esta documentación
```
