# Sistema de Historias Clínicas - MVP

Sistema web para gestión de historias clínicas que desarrollamos como proyecto académico. Backend en Node.js/Express con PostgreSQL (Neon) y frontend en HTML/CSS/JavaScript vanilla.

## Equipo de Desarrollo

Trabajo grupal realizado por:
- **Toledo Marcos**
- **Miszel Veronica**
- **Buono Marcos**

## Demo en Vivo

Desplegado en: **[https://tu-proyecto.vercel.app](https://tu-proyecto.vercel.app)**

Credenciales de prueba:
```
Doctor: doctor@clinica.com / password123
Admin:  admin@clinica.com / password123
```

## Qué hace el sistema

Este MVP permite:
- Autenticación segura con sesiones basadas en cookies (compatible con Vercel serverless)
- Gestión completa de pacientes (crear, editar, ver historial, eliminar)
- Registro de consultas médicas (historia clínica de cada paciente)
- Sistema de turnos (preparado pero marcado como funcionalidad futura)
- Recuperación de contraseña mediante pregunta secreta
- Multitenancy: cada usuario ve solo sus propios datos

## Requisitos

- Node.js 18+ 
- PostgreSQL (recomiendo usar Neon que es gratis y en la nube)
- PowerShell (si estás en Windows)

## Configuración inicial

### 1. Variables de entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# Base de datos PostgreSQL (ejemplo con Neon)
DATABASE_URL=postgres://usuario:password@ep-algo.us-east-2.aws.neon.tech/neondb?sslmode=require

# Clave secreta para las sesiones (cambiala por algo único)
SESSION_SECRET=mi_clave_super_secreta_12345

# Opcionales
PORT=3000
AUTO_OPEN=0
```

Notas:
- Usamos Neon como base de datos (PostgreSQL gestionado, gratis hasta 512 MB)
- La conexión usa SSL por defecto
- Si el puerto 3000 está ocupado, el servidor intenta 3001, 3002, etc.

### 2. Instalar dependencias

```powershell
cd backend
npm install
```

### 3. Inicializar base de datos

Ejecutar migraciones y datos de prueba:

```powershell
cd backend
npm run db:migrate
```

Esto crea las tablas y agrega usuarios/pacientes de ejemplo.

### 4. Crear usuario administrador

Si necesitas un admin nuevo:

```powershell
npm run admin:create -- --email=admin@clinica.com --password=Secreta123 --nombre="Dr. Admin"
```

## Ejecutar en desarrollo

```powershell
cd backend
npm run dev
```

Abre http://localhost:3000 en el navegador.

Si el puerto está ocupado:
```powershell
# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza 12345 por el PID que aparece)
Stop-Process -Id 12345 -Force
```

## Estructura del proyecto

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
  index.html             # Página de login
  inicio.html            # Dashboard principal
  pacientes.html         # Lista de pacientes
  paciente_crear.html    # Formulario nuevo paciente
  perfil_paciente.html   # Ver ficha del paciente
  consultas.html         # Lista de consultas
  consulta.html          # Ver/editar consulta
  turnos.html            # Calendario de turnos (futuro)
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

## Endpoints principales de la API

### Autenticación

```
POST   /api/auth/login                    # Iniciar sesión
POST   /api/auth/logout                   # Cerrar sesión
GET    /api/auth/verificar                # Verificar si hay sesión activa
POST   /api/auth/registro                 # Crear usuario (solo admin)
GET    /api/auth/perfil                   # Obtener datos del usuario logueado
PUT    /api/auth/perfil                   # Actualizar nombre/email
PUT    /api/auth/password                 # Cambiar contraseña
POST   /api/auth/pregunta-secreta/configurar    # Guardar pregunta secreta
POST   /api/auth/pregunta-secreta/obtener       # Obtener pregunta por email
POST   /api/auth/recuperar                # Recuperar contraseña con pregunta secreta
```

### Pacientes

```
GET    /api/pacientes                     # Listar pacientes (con búsqueda ?q=)
GET    /api/pacientes/:id                 # Ver paciente específico
POST   /api/pacientes                     # Crear paciente
PUT    /api/pacientes/:id                 # Editar paciente
DELETE /api/pacientes/:id                 # Eliminar paciente (soft delete)
```

### Consultas

```
GET    /api/consultas                     # Listar todas las consultas
GET    /api/consultas/:id                 # Ver consulta específica
GET    /api/consultas/paciente/:id        # Consultas de un paciente
POST   /api/consultas                     # Crear consulta
PUT    /api/consultas/:id                 # Editar consulta
DELETE /api/consultas/:id                 # Eliminar consulta
```

### Turnos (preparado para futuro)

```
GET    /api/turnos                        # Listar turnos
GET    /api/turnos/hoy                    # Turnos de hoy
GET    /api/turnos/dia/:fecha             # Turnos de una fecha
POST   /api/turnos                        # Crear turno
PUT    /api/turnos/:id                    # Editar turno
DELETE /api/turnos/:id                    # Eliminar turno
```

## Características técnicas

### Autenticación
- Usamos `cookie-session` en lugar de JWT (más simple para Vercel serverless)
- Las contraseñas se hashean con bcrypt (10 rounds)
- La recuperación de contraseña usa pregunta secreta (también hasheada)
- Sesiones de 7 días por defecto, 30 días si marcas "Recordarme"

### Seguridad
- Todas las consultas filtran por `tenant_id` (multitenancy)
- Los pacientes tienen DNI único por usuario
- Middleware `verificarAuth` protege rutas privadas
- Middleware `verificarAdmin` protege acciones de administrador
- Soft delete en pacientes (se marcan inactivos en lugar de borrar)

### Base de datos
- PostgreSQL en Neon (cloud)
- Connection pooling automático
- Todas las tablas tienen `tenant_id` para aislar datos
- Migraciones versionadas en `/database/migrations/`

### Frontend
- HTML5 + CSS3 vanilla (sin frameworks)
- JavaScript puro con fetch API
- Componentes reutilizables (header/footer)
- Responsive design
- Iconos: Material Symbols de Google

## Deploy en Vercel

El proyecto está configurado para Vercel con `vercel.json`. 

Pasos:
1. Crear cuenta en Vercel
2. Conectar el repositorio
3. Configurar variables de entorno:
   - `DATABASE_URL`
   - `SESSION_SECRET`
4. Deploy automático en cada push a main

El frontend se sirve como archivos estáticos y el backend corre como serverless functions.

## Cosas a recordar para defender/presentar

1. **Autenticación simplificada**: Usamos cookie-session en lugar de JWT porque es más simple de explicar y funciona perfecto con serverless. Todo el flujo está comentado en español.

2. **Pregunta secreta**: Implementamos recuperación de contraseña sin emails. El usuario configura una pregunta y respuesta (hasheada). Para recuperar: ingresa email → ve su pregunta → responde → resetea contraseña.

3. **Multitenancy**: Cada usuario (doctor) tiene su `tenant_id`. Todos los pacientes, consultas y turnos se filtran automáticamente por este ID. Un doctor nunca ve datos de otro.

4. **Comentarios en español**: Todo el código backend tiene comentarios detallados en español pensados para que yo pueda explicar cada parte en la defensa.

5. **Turnos como futuro**: La funcionalidad de turnos está preparada (rutas, modelos, vistas) pero marcada como "funcionalidad futura" en los diagramas porque no es prioridad del MVP.

## Solución de problemas comunes

**Error de conexión a PostgreSQL:**
- Verificar que `DATABASE_URL` esté correcta en `.env`
- Verificar que Neon esté activo (a veces se suspende por inactividad)
- Probar conexión: `npm run db:check-seed`

**Puerto 3000 ocupado:**
```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
```

**No puedo logearme:**
```powershell
cd backend
node scripts\check_seed.js
```
Esto muestra los usuarios de prueba y verifica sus contraseñas.

**Olvidé mi contraseña de prueba:**
Usar recuperación con pregunta secreta, o crear un nuevo admin:
```powershell
npm run admin:create -- --email=nuevo@admin.com --password=Pass123 --nombre="Admin Nuevo"
```

## Próximos pasos / Mejoras futuras

- Implementar completamente el módulo de turnos
- Agregar búsqueda avanzada de pacientes (por obra social, edad, etc)
- Exportar historias clínicas a PDF
- Notificaciones de turnos
- Gráficos y estadísticas del consultorio
- Modo oscuro (ya preparado en CSS pero deshabilitado)

## Licencia

MIT - Proyecto académico
