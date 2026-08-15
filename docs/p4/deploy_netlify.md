# P4 — Despliegue en Netlify

## Estado actual

**Desplegado y verificado en producción.**

- **URL de producción:** https://to-do-app-p4.netlify.app
- **Site (equipo `highhopes1805`):** https://app.netlify.com/projects/to-do-app-p4
- **Repositorio:** https://github.com/Rosten1805/to-do-app

Se usó como alternativa a Vercel porque la cuenta de Vercel del usuario está
bloqueada por límites de uso ("fair use") — ver
[`deploy_vercel.md`](./deploy_vercel.md).

## Configuración aplicada

[`frontend/netlify.toml`](../../frontend/netlify.toml):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- `command`/`publish`: Netlify ejecuta `npm run build` (que a su vez corre
  `vue-tsc -b && vite build`) y sirve el contenido de `dist/`.
- El redirect `/* → /index.html` (200, no 301/302) es el fallback SPA
  necesario para que `vue-router` en modo `history` resuelva cualquier ruta
  (`/login`, `/`, etc.) tanto en la navegación interna como al refrescar o
  entrar por URL directa — verificado con una petición HTTP directa a una
  ruta profunda inexistente, que devuelve 200 en vez de 404.

## Variables de entorno

Configuradas como variables de entorno del site en Netlify (contexto `all`),
no en ningún archivo del repositorio:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (la `publishable key`, nunca la `secret key`)

## Cómo se desplegó

Vía Netlify CLI, con un Personal Access Token del usuario (usado solo en
memoria para las órdenes de despliegue, no guardado en el repositorio):

```bash
cd frontend
netlify sites:create --account-slug highhopes1805 --name to-do-app-p4
netlify env:set VITE_SUPABASE_URL "https://tu-proyecto.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "tu-publishable-key"
netlify deploy --prod
```

## Redeploys posteriores

Para volver a desplegar tras nuevos cambios (con el CLI ya vinculado, ver
`frontend/.netlify/state.json` que guarda el `siteId` — está en
`.gitignore`, no se sube):

```bash
cd frontend
netlify deploy --prod
```

O conectar el repositorio de GitHub desde el dashboard de Netlify
(**Site settings → Build & deploy → Link repository**) para que cada
`git push` a `main` dispare un deploy automático — no configurado aún en
este despliegue inicial (se hizo directamente desde el CLI).

## Notas de seguridad

- `frontend/.gitignore` excluye `.netlify/`, `.env`, `.env.*` (excepto
  `.env.example`) — ninguna credencial se sube al repositorio.
- Las variables de entorno viven únicamente en la configuración del site de
  Netlify, no en el código.
