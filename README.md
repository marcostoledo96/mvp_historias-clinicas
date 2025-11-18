# Sistema de Historias Clínicas — MVP

MVP web para gestión de historias clínicas. Backend en Node.js/Express + PostgreSQL y frontend HTML/CSS/JS.

## Equipo de Desarrollo

Trabajo grupal realizado por:
- **Toledo Marcos**
- **Miszel Veronica**
- **Buono Marcos**

## Demo

- Producción: `https://tu-proyecto.vercel.app` (ejemplo)
- Usuarios demo (solo para pruebas locales; en producción cambiarlos):
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
- Usamos `cookie-session` en lugar de JWT (más simple para Vercel serverless)
- Las contraseñas se hashean con bcrypt (10 rounds)
- La recuperación de contraseña usa pregunta secreta (también hasheada)
- Sesiones de 7 días por defecto, 30 días si marcas "Recordarme"

### Seguridad
- Multitenancy: aislamiento por usuario (filtro por `id_usuario` en consultas)
- DNI único por usuario
- Middlewares `verificarAuth` y `verificarAdmin`
- Eliminación de paciente: borra el paciente y sus consultas asociadas (cascade)

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

4. **Comentarios en español**: Todo el código backend tiene comentarios detallados en español pensados para que yo pueda explicar cada parte en la defensa.

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
