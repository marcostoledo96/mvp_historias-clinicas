# Sistema de Historias Clínicas — MVP

MVP web para la gestión básica de historias clínicas. Backend en Node.js/Express + PostgreSQL (Neon recomendado) y frontend estático en HTML/CSS/JS.

## Equipo

- Toledo Marcos
- Miszel Verónica
- Buono Marcos

Demo (deploy): https://mvp-historias-clinicas.vercel.app/

Credenciales de demo (solo entorno local/development):
- `doctor@clinica.com` / `password123`
- `admin@clinica.com` / `password123`

## Resumen del alcance (MVP)

- Login con sesiones basadas en cookies (`cookie-session`).
- CRUD de pacientes (soft delete, historial mantenido).
- Registro y consulta de consultas médicas por paciente.
- Endpoints de turnos preparados (UI no incluida en el MVP).
- Recuperación de contraseña mediante pregunta secreta (respuesta hasheada).
- Aislamiento lógico por usuario: todas las tablas incluyen `id_usuario`.

## Requisitos

- Node.js 18+
- PostgreSQL (recomiendo Neon)
- PowerShell (solo si trabajás en Windows; las instrucciones de terminal aquí usan PowerShell)

## Instalación rápida

1) Crear `backend/.env` (usar `vercel-env-template.txt` como referencia):

```env
DATABASE_URL=postgres://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require
SESSION_SECRET=<cadena-aleatoria-larga>
PORT=3000
```

2) Instalar dependencias y ejecutar migraciones:

```powershell
cd backend
npm install
npm run db:migrate
```

3) (Opcional) Crear un admin desde terminal:

```powershell
npm run admin:create -- --email=admin@clinica.com --password=Secreta123 --nombre="Dr. Admin"
```

## Ejecutar en desarrollo

```powershell
cd backend
npm run dev
```

Abrir `http://localhost:3000`.

Si el puerto 3000 está ocupado:

```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
```

## Estructura (vista rápida)

```
backend/
  server.js
  db/connection.js
  routes/
  controllers/
  models/
  middlewares/
  scripts/

frontend/
  *.html
  js/
  css/

database/
  migrations/
  seeds.sql
```

## Endpoints principales

Autenticación:
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verificar
POST /api/auth/registro (admin)
GET/PUT /api/auth/perfil
PUT /api/auth/password
POST /api/auth/pregunta-secreta/configurar
GET /api/auth/pregunta-secreta/obtener
POST /api/auth/pregunta-secreta/recuperar
```

Pacientes:
```
GET /api/pacientes
GET /api/pacientes/:id
POST /api/pacientes
PUT /api/pacientes/:id
DELETE /api/pacientes/:id
```

Consultas:
```
GET /api/consultas
GET /api/consultas/:id
GET /api/consultas/paciente/:id_paciente
GET /api/consultas/fecha/:fecha
POST /api/consultas
PUT /api/consultas/:id
DELETE /api/consultas/:id
```

Turnos (futuro): rutas existentes en la API; UI pendiente.

## Detalles técnicos relevantes

- Autenticación: `cookie-session` (cookie cifrada). Por defecto se crea la cookie con `maxAge` = 24 horas; se puede ampliar para un "Recordarme".
- Contraseñas y respuesta secreta: hasheadas con `bcrypt` (10 salt rounds).
- Multitenancy: todas las tablas relevantes incluyen `id_usuario` y las consultas filtran por ese campo.
- Eliminación de paciente: se aplica soft delete (`activo = false`); las consultas relacionadas se preservan para auditoría y trazabilidad.
- SQL: consultas parametrizadas para evitar inyección.

Nota: en `database/migrations/` existe `20251026_create_session_table.sql` por si se desea almacenar sesiones en BD, pero actualmente la app usa `cookie-session` sin tabla de sesiones por defecto.

## Despliegue (Vercel)

1. Importar el repo en Vercel.
2. Configurar variables de entorno: `DATABASE_URL`, `SESSION_SECRET`.
3. Deploy: el frontend se sirve estático y el backend corre como funciones serverless.

## Notas para demo / defensa

- Demostrar: login, creación y búsqueda de pacientes, perfil del paciente y creación de consultas.
- Recuperación de contraseña: flujo con pregunta secreta (sin email).
- Multitenancy: explicar `id_usuario` y cómo las consultas incluyen ese filtro.
- Turnos: funcionalidad preparada y priorizada fuera del MVP.

## Problemas comunes

- Error conexión PostgreSQL: revisar `DATABASE_URL` y SSL.
- No puedo loguearme: ejecutar `node scripts/check_seed.js` en `backend` para listar usuarios de prueba.

Comandos útiles:
```powershell
cd backend
node scripts\\check_seed.js
```

## Roadmap (fuera del MVP)

- Turnos: UI completa + recordatorios
- Búsqueda avanzada y filtros
- Exportar historias a PDF
- Tests automatizados y monitoreo
- Modo oscuro

## Licencia

MIT — Proyecto académico
# Sistema de Historias Clínicas — MVP

Este repositorio contiene el MVP de un sistema de gestión de historias clínicas: un frontend estático en HTML/CSS/JS y un backend en Node.js/Express que expone una API REST hacia una base de datos PostgreSQL (Neon).

Trabajo en equipo: Toledo Marcos, Miszel Verónica y Buono Marcos.

Demo (ejemplo de despliegue): https://mvp-historias-clinicas.vercel.app/

Usuarios de prueba (solo para demo local):
- Doctor: `doctor@clinica.com` / `password123`
- Admin: `admin@clinica.com` / `password123`

## Qué incluye este MVP

- Login seguro con sesiones basadas en cookies (compatible con Vercel serverless).
- Gestión de pacientes: crear, editar, ver historial y eliminar (soft delete).
- Registro de consultas médicas (historia clínica por paciente).
- Módulo de turnos preparado a nivel de API/DB (UI no incluida en MVP).
- Recuperación de contraseña mediante pregunta secreta.
- Aislamiento por usuario: cada médico solo ve sus propios datos (`id_usuario`).

## Requisitos

- Node.js 18+
- PostgreSQL (recomiendo Neon para desarrollo en la nube)
- PowerShell (solo si trabajás en Windows; las instrucciones de terminal están en PowerShell)

## Instalación rápida

1. Copiá el archivo de ejemplo de variables de entorno a `backend/.env` y completá los valores:

```env
DATABASE_URL=postgres://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require
SESSION_SECRET=<cadena-aleatoria-larga>
PORT=3000
```

2. Instalar dependencias y ejecutar migraciones:

```powershell
cd backend
npm install
npm run db:migrate
```

3. (Opcional) Crear un usuario admin:

```powershell
npm run admin:create -- --email=admin@clinica.com --password=Secreta123 --nombre="Dr. Admin"
```

## Ejecutar en desarrollo

```powershell
cd backend
npm run dev
```

Abrí `http://localhost:3000` en el navegador.

Si el puerto 3000 está ocupado:

```powershell
# Ver qué proceso lo usa
netstat -ano | findstr :3000
# Matar proceso (reemplazar <PID>)
Stop-Process -Id <PID> -Force
```

## Estructura del proyecto (resumen)

```
backend/
  server.js              # Servidor Express principal
  db/                    # Conexión a PostgreSQL (pool)
  routes/                # Rutas de la API (auth, pacientes, consultas, turnos)
  controllers/           # Lógica por recurso
  models/                # Acceso a la base de datos
  middlewares/           # Autenticación y validaciones
  scripts/               # Utilidades (crear admin, check seed)

frontend/
  *.html                 # Pantallas (login, pacientes, consultas, etc.)
  js/                    # Lógica del cliente
  css/                   # Estilos

database/
  migrations/            # Migraciones versionadas
  seeds.sql              # Datos de ejemplo
```

## Endpoints principales (resumen)

Autenticación:
```
POST /api/auth/login | POST /api/auth/logout | GET /api/auth/verificar
POST /api/auth/registro (admin)
GET/PUT /api/auth/perfil | PUT /api/auth/password
POST /api/auth/pregunta-secreta/configurar | /obtener | POST /recuperar
```

Pacientes:
```
GET /api/pacientes (?buscar=...) | GET /api/pacientes/:id
POST /api/pacientes | PUT /api/pacientes/:id | DELETE /api/pacientes/:id
```

Consultas:
```
GET /api/consultas | GET /api/consultas/:id
GET /api/consultas/paciente/:id_paciente | GET /api/consultas/fecha/:fecha
POST /api/consultas | PUT /api/consultas/:id | DELETE /api/consultas/:id
```

Turnos (futuro): rutas disponibles en la API, UI pendiente.

## Detalles técnicos relevantes (breve)

- Autenticación: uso `cookie-session` (cookie cifrada). En el servidor la cookie se crea con `maxAge` por defecto (24 horas). Si necesitás "Recordarme" se puede ampliar la duración al crear la sesión.
- Contraseñas y respuesta secreta: hasheadas con `bcrypt` (10 rounds).
- Multitenancy: usamos `id_usuario` en las consultas SQL para asegurar que cada médico solo acceda a sus propios pacientes y consultas.
- Eliminación de paciente: implementé soft delete (`activo = false`) para preservar la historia clínica y facilitar auditoría.
- SQL: todas las consultas usan parámetros (`$1`, `$2`, ...) para evitar inyección.

Nota sobre migraciones: en `database/migrations/` hay un archivo `20251026_create_session_table.sql`; está incluido por si se desea guardar sesiones en la BD, pero por defecto la app usa `cookie-session` sin tabla.

## Despliegue en Vercel (rápido)

1. Importá el repo en Vercel.
2. Configurá las variables de entorno (`DATABASE_URL`, `SESSION_SECRET`).
3. Deploy: el frontend se sirve como estático y el backend corre como funciones serverless.

## Notas para la demo / defensa

- En la demo muestro: login, creación y búsqueda de pacientes, perfil del paciente y creación de consultas.
- Recuperación de contraseña: flujo con pregunta secreta (sin email).
- El módulo de turnos quedó preparado a nivel backend/DB; es una funcionalidad futura.

## Problemas comunes y soluciones rápidas

- Error de conexión a PostgreSQL: revisá `DATABASE_URL` y la configuración de SSL.
- No puedo loguearme: ejecutá `node scripts/check_seed.js` en `backend` para ver usuarios de prueba.

## Roadmap (no MVP)

- Turnos: UI completa y recordatorios.
- Búsqueda avanzada y filtros.
- Exportación a PDF de historias clínicas.
- Tests automatizados y monitoreo.

## Licencia

MIT — Proyecto académico
# Sistema de Historias Clínicas — MVP

MVP web para gestión de historias clínicas. Backend en Node.js/Express + PostgreSQL y frontend HTML/CSS/JS.

## Equipo de Desarrollo

Trabajo grupal realizado por:
- **Toledo Marcos**
- **Miszel Veronica**
- **Buono Marcos**

## Demo

- Producción: https://mvp-historias-clinicas.vercel.app/
  - Doctor: `doctor@clinica.com` / `password123`
  - Admin: `admin@clinica.com` / `password123`

## Alcance del MVP

Este MVP permite:
- Autenticación segura con sesiones basadas en cookies (compatible con Vercel serverless)
- Gestión completa de pacientes (crear, editar, ver historial, eliminar)
- Registro de consultas médicas (historia clínica de cada paciente)
- Sistema de turnos (no MVP; endpoints disponibles, UI no incluida)
- Recuperación de contraseña mediante pregunta secreta
- Multitenancy: cada usuario ve solo sus propios datos

## Requisitos

- Node.js 18+ 
- PostgreSQL (recomiendo usar Neon que es gratis y en la nube)
- PowerShell (si estás en Windows)

## Instalación rápida

- Variables de entorno (no publiques tu `DATABASE_URL` ni `SESSION_SECRET`):
  - Crear `backend/.env` usando placeholders:
    ```env
    DATABASE_URL=postgres://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require
    SESSION_SECRET=<cadena-aleatoria-larga>
    PORT=3000
    ```
  - También podés usar `vercel-env-template.txt` como referencia.
- Instalar dependencias y migrar BD:
  ```powershell
  cd backend
  npm install
  npm run db:migrate
  ```
- Crear admin opcional:
  ```powershell
  npm run admin:create -- --email=admin@clinica.com --password=Secreta123 --nombre="Dr. Admin"
  ```

## Ejecutar en desarrollo

```powershell
cd backend
npm run dev
```

Abrí `http://localhost:3000` en el navegador.

Si el puerto está ocupado:
```powershell
# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza 12345 por el PID que aparece)
Stop-Process -Id 12345 -Force
```

## Estructura breve

```
backend/
  server.js              # Servidor Express principal
  db/
    connection.js        # Conexión a PostgreSQL (pool)
  routes/
    auth.js              # Rutas de autenticación
    pacientes.js         # CRUD de pacientes
    consultas.js         # CRUD de consultas
    turnos.js            # CRUD de turnos (futuro)
  controllers/
    authController.js    # Lógica de login/registro/recuperación
    pacientesController.js
    consultasController.js
    turnosController.js
  models/
    Usuario.js           # Acceso a tabla usuarios
    Paciente.js          # Acceso a tabla pacientes
    Consulta.js          # Acceso a tabla consultas
    Turno.js             # Acceso a tabla turnos
  middlewares/
    auth.js              # Verificación de sesión
  scripts/
    create_admin.js      # Crear usuarios admin desde terminal
    check_seed.js        # Verificar datos de prueba
  migrate.js             # Script para ejecutar migraciones
  run_sql.js             # Ejecutar archivos SQL individuales

frontend/
  index.html             # Login
  inicio.html            # Inicio (búsqueda rápida)
  pacientes.html         # Lista de pacientes
  paciente_crear.html    # Formulario nuevo paciente
  perfil_paciente.html   # Ver ficha del paciente
  consultas.html         # Lista de consultas
  consulta.html          # Ver/editar consulta
  configuracion.html     # Perfil del usuario
  recuperar.html         # Recuperar contraseña
  js/
    auth.js              # Verificación de sesión en frontend
    utils.js             # Funciones auxiliares
    components.js        # Header y footer compartidos
    (demás archivos específicos por página)
  css/
    styles.css           # Estilos completos del sistema

database/
  scripts.sql            # Esquema inicial de la BD
  seeds.sql              # Datos de ejemplo
  migrations/            # Migraciones incrementales
    20251019_pacientes_telefono_adicional.sql
    20251019_relajar_requeridos_pacientes.sql
    20251019_turnos_paciente_opcional.sql
    20251021_multi_tenant.sql
    20251026_create_session_table.sql
    20251116_pregunta_secreta.sql

docs/
  (diagramas PlantUML de flujos del sistema)
```

## Endpoints principales (resumen)

### Autenticación

```
POST /api/auth/login | POST /api/auth/logout | GET /api/auth/verificar
POST /api/auth/registro (admin)
GET/PUT /api/auth/perfil | PUT /api/auth/password
POST /api/auth/pregunta-secreta/configurar | /obtener | POST /recuperar
```

### Pacientes

```
GET /api/pacientes (?buscar=...) | GET /api/pacientes/:id
POST /api/pacientes | PUT /api/pacientes/:id | DELETE /api/pacientes/:id
```

### Consultas

```
GET /api/consultas | GET /api/consultas/:id
GET /api/consultas/paciente/:id_paciente | GET /api/consultas/fecha/:fecha
POST /api/consultas | PUT /api/consultas/:id | DELETE /api/consultas/:id
```

### Turnos (futuro)

```
GET /api/turnos | GET /api/turnos/hoy | GET /api/turnos/dia/:fecha | GET /api/turnos/paciente/:id_paciente
POST /api/turnos | PUT /api/turnos/:id | PUT /api/turnos/:id/situacion | DELETE /api/turnos/:id
```

## Características técnicas

### Autenticación
 Sesiones: la cookie tiene un `maxAge` configurado por defecto en el servidor (24 horas). Si se implementa "Recordarme" se puede ampliar (por ejemplo a 30 días) ajustando `req.sessionOptions.maxAge` al crear la sesión.

 Eliminación de paciente: se utiliza "soft delete" (campo `activo = false`) para preservar la historia clínica; las consultas asociadas se mantienen para auditoría y trazabilidad.
- Eliminación de paciente: borra el paciente y sus consultas asociadas (cascade)

    20251026_create_session_table.sql  # archivo incluido; opcional: el proyecto usa `cookie-session` por defecto (sin tabla de sesiones)
### Base de datos
- PostgreSQL en Neon (cloud)
- Connection pooling automático
  - Todas las tablas incluyen `id_usuario` para aislar datos (multitenancy por usuario)
- Migraciones versionadas en `/database/migrations/`

### Frontend
- HTML5 + CSS3 vanilla (sin frameworks)
- JavaScript puro con fetch API
- Componentes reutilizables (header/footer)
- Responsive design
- Iconos: Material Symbols de Google

## Deploy rápido (Vercel)

El proyecto está configurado para Vercel con `vercel.json`. 

Pasos:
1. Importá el repo en Vercel (usa `vercel.json`).
2. Configurá variables de entorno: `DATABASE_URL`, `SESSION_SECRET` (no publiques sus valores).
3. Deploy; el frontend se sirve como estático y el backend como función serverless.

El frontend se sirve como archivos estáticos y el backend corre como serverless functions.

## Notas para demo/defensa

1. **Autenticación simplificada**: Usamos cookie-session en lugar de JWT porque es más simple de explicar y funciona perfecto con serverless. Todo el flujo está comentado en español.

2. **Pregunta secreta**: Implementamos recuperación de contraseña sin emails. El usuario configura una pregunta y respuesta (hasheada). Para recuperar: ingresa email → ve su pregunta → responde → resetea contraseña.

3. **Multitenancy**: Cada usuario (doctor) está identificado por `id_usuario`. Todos los pacientes, consultas y turnos se filtran automáticamente por ese campo; un doctor nunca ve datos de otro.

4. 

5. **Turnos como futuro**: La funcionalidad de turnos está preparada (rutas, modelos, vistas) pero marcada como "funcionalidad futura" en los diagramas porque no es prioridad del MVP.

## Problemas comunes

Error de conexión a PostgreSQL:
- Revisar `DATABASE_URL` y SSL en `.env`. Probar `npm run db:check-seed`.

Puerto 3000 ocupado:
```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
```

No puedo logearme:
```powershell
cd backend
node scripts\check_seed.js
```
Esto muestra los usuarios de prueba y verifica sus contraseñas.

Olvidé mi contraseña de prueba:
Usar recuperación con pregunta secreta, o crear un nuevo admin:
```powershell
npm run admin:create -- --email=nuevo@admin.com --password=Pass123 --nombre="Admin Nuevo"
```

## Roadmap (no MVP)

- Turnos (UI completa + recordatorios)
- Búsqueda avanzada de pacientes
- Exportación a PDF
- Estadísticas del consultorio
- Modo oscuro

## Licencia

MIT — Proyecto académico
