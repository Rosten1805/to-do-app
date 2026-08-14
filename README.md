# P4 — To-Do App MVP

To-Do App con Vue 3, Vite, TypeScript, Tailwind CSS, Supabase (PostgreSQL +
Auth + Row Level Security) y despliegue en Vercel.

- App: [`frontend/`](./frontend/) — ver [`frontend/README.md`](./frontend/README.md) para arrancar en local.
- Base de datos: [`supabase/schema.sql`](./supabase/schema.sql) — esquema, índices y políticas RLS.
- Documentación completa: [`docs/p4/`](./docs/p4/).

## Quickstart

```bash
cd frontend
npm install
cp .env.example .env.local   # rellenar con las credenciales de tu proyecto Supabase
npm run dev
```

Requiere un proyecto Supabase con el esquema aplicado — pasos exactos en
[`docs/p4/integration_plan.md`](./docs/p4/integration_plan.md).
