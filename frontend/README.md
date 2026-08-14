# To-Do App — Frontend

Vue 3 + Vite + TypeScript + Tailwind CSS, con Supabase (Postgres + Auth +
RLS) como backend. Ver [`docs/p4/`](../docs/p4/) para la documentación
completa del proyecto (alcance, modelo de datos, seguridad, UI, integración
y despliegue).

## Requisitos previos

Un proyecto Supabase con el esquema de [`supabase/schema.sql`](../supabase/schema.sql)
aplicado. Pasos detallados en [`docs/p4/integration_plan.md`](../docs/p4/integration_plan.md).

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y rellena las dos variables con tus datos de Supabase
npm run dev
```

## Scripts

| Comando            | Qué hace                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`         | Servidor de desarrollo con hot-reload         |
| `npm run build`        | Typecheck + build de producción a `dist/`     |
| `npm run preview`       | Sirve `dist/` localmente                        |
| `npm run typecheck`      | Solo typecheck (`vue-tsc`), sin build           |
| `npm run lint`            | ESLint sobre todo el proyecto                     |

## Variables de entorno

Ver [`.env.example`](./.env.example). Ambas son valores públicos (anon key),
nunca la `service_role` key de Supabase.
