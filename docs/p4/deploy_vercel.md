# P4 — Despliegue en Vercel

## Estado actual

El proyecto está preparado para Vercel (`frontend/vercel.json` con rewrite de
SPA para `vue-router` en modo `history`) y el repositorio ya está en GitHub
(https://github.com/Rosten1805/to-do-app). **No se llegó a completar el
despliegue en Vercel**: al vincular el proyecto (`vercel link`) con un token
de acceso, la API devolvió:

```
Error: Your Team exceeded our fair use limits and has been blocked. (402)
```

Esto es un bloqueo a nivel de cuenta/equipo de Vercel (facturación / uso),
no un problema del proyecto — no depende de la configuración ni del código.
El despliegue en producción real de este MVP se hizo en **Netlify** en su
lugar (ver [`deploy_netlify.md`](./deploy_netlify.md)).

Estos pasos quedan documentados por si se resuelve el bloqueo de la cuenta y
se quiere desplegar también (o en su lugar) en Vercel.

## Opción A — Despliegue vía dashboard de Vercel (recomendado)

1. El repositorio ya está en GitHub: https://github.com/Rosten1805/to-do-app
2. En https://vercel.com/new, importa el repositorio.
3. **Root Directory**: selecciona `frontend` (el proyecto Vite vive en ese
   subdirectorio, no en la raíz del repo).
4. Framework Preset: Vercel debería detectar **Vite** automáticamente
   (build command `npm run build`, output `dist`).
5. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL` = tu Project URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon/publishable key de Supabase
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
