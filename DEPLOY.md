# 🚀 Guía para deploy en Vercel (configuración actual)

Esta guía refleja la configuración vigente del proyecto para desplegar en Vercel con una función serverless que sirve API y frontend estático.

## 🏗️ Arquitectura

- Frontend: archivos estáticos dentro de `frontend/` (servidos por Express)
- Backend: `backend/server.js` empaquetado como función serverless (@vercel/node)
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

Configuralas en Vercel > Settings > Environment Variables:

```
PORT=3000
DATABASE_URL=postgresql://<usuario>:<password>@<host-neon>:5432/<dbname>?sslmode=require
SESSION_SECRET=un_secreto_largo_y_aleatorio
NODE_ENV=production
NO_SSL=false
PGSSLMODE=require
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

## � Solución de problemas

- CORS: verificá los orígenes permitidos (en prod se valida contra el dominio de Vercel).
- DB: chequeá `DATABASE_URL` (Neon) y SSL.
- Sesiones: `SESSION_SECRET` definido y cookies habilitadas. En serverless se usa cookie-session.

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