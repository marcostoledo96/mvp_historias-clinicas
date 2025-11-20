# 🚀 Guía de deploy en Vercel (configuración actualizada)

Esta guía describe el despliegue del proyecto en Vercel con autenticación JWT y función serverless que sirve API y frontend estático.

## 🏗️ Arquitectura

- Frontend: archivos estáticos dentro de `frontend/` (servidos por Express)
- Backend: `backend/server.js` empaquetado como función serverless (@vercel/node)
- Autenticación: JWT (JSON Web Tokens) stateless, sin estado de sesión en servidor
- Base de datos: PostgreSQL en Neon
- Dominio: `tu-proyecto.vercel.app`

## ✅ Requisitos

- Cuenta en Vercel y GitHub
- Node.js 18+

## 🔧 Configuración de Vercel

El repo incluye `vercel.json` ya configurado para:

```json
{
    "version": 2,
    "builds": [
        { "src": "backend/server.js", "use": "@vercel/node", "config": { "includeFiles": ["frontend/**"] } }
    ],
    "routes": [
        { "src": "/(.*)", "dest": "backend/server.js" }
    ]
}
```

No hace falta setear Build Command ni Output Directory manualmente. Dejá Install Command como `npm install` (el postinstall instala dependencias del backend).

## 🔐 Variables de entorno

Configuralas en Vercel > Settings > Environment Variables (ver `vercel-env-template.txt` como referencia):

```
PORT=3000
DATABASE_URL=postgresql://<usuario>:<password>@<host-neon>:5432/<dbname>?sslmode=require
JWT_SECRET=<secreto_largo_aleatorio_para_access_tokens>
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=<secreto_diferente_para_refresh_tokens>
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
NO_SSL=false
PGSSLMODE=require
```

**Importante**: Los secrets de JWT deben ser cadenas largas y aleatorias. Podés generarlos con:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Nota: En Neon, usá SSL. Si es necesario, `PGSSLMODE=no-verify`.

## ▶️ Deploy

1) Importá el repo en Vercel y usá la configuración por defecto (respetando `vercel.json`).
2) Hacé clic en Deploy. La función serverless expondrá:
- Frontend: `/` (sirve `frontend/index.html` y demás estáticos)
- API: `/api/*`

## 👤 Credenciales de prueba

- Doctor: `doctor@clinica.com` / `password123`
- Admin: `admin@clinica.com` / `password123`

Podés ajustar o crear usuarios con los scripts en `backend/scripts/`.

## 🔧 Solución de problemas

- CORS: verificá los orígenes permitidos (en producción se valida contra el dominio de Vercel).
- DB: chequeá `DATABASE_URL` (Neon) y SSL.
- Autenticación: verificá que `JWT_SECRET` y `JWT_REFRESH_SECRET` estén configurados. Los tokens JWT se almacenan en `localStorage` del cliente y se envían en el header `Authorization: Bearer <token>`.
- Tokens expirados: el sistema implementa renovación automática con refresh tokens. Si ambos tokens expiran, el usuario debe volver a iniciar sesión.

## 📁 Archivos relevantes

```
├── vercel.json          # Configuración del deploy
├── package.json         # postinstall para deps del backend
├── backend/
│   ├── server.js        # Express + rutas + estáticos
│   └── ...
└── frontend/
        ├── index.html
        └── ...
```

## 🎉 Listo

Tras el deploy, accedé a `https://tu-proyecto.vercel.app`.