# P4 — Plan de integración con Supabase

## Estado actual

**Conectado y verificado.** El proyecto Supabase real está creado, el esquema
de [`supabase/schema.sql`](../../supabase/schema.sql) está aplicado, y
`frontend/.env.local` apunta a él con la URL y la `publishable key` (la
variante moderna de la anon key) del proyecto. Se verificó con una petición
REST directa (`GET /rest/v1/todos`) que la tabla existe y que RLS bloquea
correctamente el acceso sin sesión (devuelve `[]` en vez de error o datos).
El modo mock (`VITE_MOCK_AUTH`) está desactivado.

Los pasos de abajo quedan documentados como referencia por si se necesita
recrear el proyecto o conectarlo en otra máquina/entorno.

## Pasos para (re)conectar un proyecto Supabase

### 1. Crear el proyecto en Supabase

1. Entra en https://supabase.com/dashboard y crea un proyecto nuevo (elige
   nombre, contraseña de base de datos y región).
2. Espera a que aprovisione (1-2 min).

### 2. Ejecutar el SQL del esquema

1. En el proyecto, ve a **SQL Editor**.
2. Pega el contenido íntegro de [`supabase/schema.sql`](../../supabase/schema.sql)
   y ejecútalo. Crea la tabla `todos`, sus índices, el trigger de
   `updated_at`, activa RLS y crea las 4 políticas (`SELECT`/`INSERT`/`UPDATE`/`DELETE`).
3. Verifica en **Table Editor → todos** que la tabla existe y en
   **Authentication → Policies** que las 4 políticas aparecen listadas sobre
   `todos`.

### 3. Copiar las credenciales públicas

1. Ve a **Project Settings → API**.
2. Copia:
   - **Project URL** → variable `VITE_SUPABASE_URL`
   - **anon / public key** (proyectos nuevos la llaman `publishable key`,
     empieza por `sb_publishable_...`; en proyectos antiguos es un JWT largo)
     → variable `VITE_SUPABASE_ANON_KEY`
3. **No copies la `secret key` / `service_role key`** (en proyectos nuevos
   empieza por `sb_secret_...`) **a ningún archivo de este proyecto ni la
   compartas fuera del dashboard de Supabase.**

### 4. Configurar las variables de entorno

En `frontend/`:

```bash
cp .env.example .env.local
```

Y edita `.env.local` con los dos valores copiados:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

`.env.local` ya está en `.gitignore` — nunca se subirá al repositorio.

### 5. (Opcional pero recomendado) Confirmación de email

Por defecto Supabase Auth exige confirmar el email antes de poder iniciar
sesión. Para probar más rápido en desarrollo:

- **Authentication → Providers → Email → "Confirm email"**: desactívalo si
  quieres poder loguearte inmediatamente tras registrarte, o déjalo activado
  para un comportamiento más realista (en ese caso, tras registrarse el
  usuario verá el mensaje "revisa tu email para confirmar la cuenta").

### 6. Arrancar la app

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`, regístrate, y deberías ver el listado de
tareas vacío (empty state) listo para usar.

## Qué ya está hecho automáticamente

- Cliente Supabase tipado ([`src/lib/supabase.ts`](../../frontend/src/lib/supabase.ts))
  leyendo las variables `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
- Persistencia de sesión y refresco automático de token
  (`persistSession: true`, `autoRefreshToken: true`).
- Todo el CRUD de tareas implementado contra la tabla `todos` vía
  `supabase-js`, respetando las políticas RLS.
- `.env.example` con los nombres de variable exactos y comentarios de
  seguridad.
