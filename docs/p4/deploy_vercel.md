# P4 — Despliegue en Vercel

## Estado actual

El proyecto está preparado para Vercel (`frontend/vercel.json` con rewrite de
SPA para `vue-router` en modo `history`), pero **no se ha desplegado**
porque este entorno no tiene sesión de Vercel CLI (`vercel whoami` →
"Logged out") ni credenciales de la cuenta.

## Opción A — Despliegue vía dashboard de Vercel (recomendado)

1. Sube el repositorio a GitHub (ver `git remote add ...` / `git push` — no
   se ha hecho automáticamente, ver más abajo).
2. En https://vercel.com/new, importa el repositorio.
3. **Root Directory**: selecciona `frontend` (el proyecto Vite vive en ese
   subdirectorio, no en la raíz del repo).
4. Framework Preset: Vercel debería detectar **Vite** automáticamente
   (build command `npm run build`, output `dist`).
5. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL` = tu Project URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key de Supabase
6. Deploy.

## Opción B — Vercel CLI

```bash
cd frontend
npx vercel login        # abre flujo de login interactivo/navegador
npx vercel link         # vincula la carpeta al proyecto (root directory = frontend)
npx vercel env add VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_ANON_KEY
npx vercel --prod
```

## Notas

- `frontend/.gitignore` excluye `.vercel/`, `.env`, `.env.*` (excepto
  `.env.example`) — nunca se sube ninguna credencial.
- El `vercel.json` incluido reescribe cualquier ruta a `index.html` para que
  `vue-router` (modo `history`) resuelva rutas como `/` correctamente al
  refrescar o entrar por URL directa.
- Tras el primer deploy, cualquier `git push` a la rama conectada
  desplegará automáticamente (comportamiento por defecto de Vercel + GitHub).
