# Guía para la Defensa Oral del Proyecto

Este documento lo escribí para tener claro qué decir en la defensa. Es un resumen de cómo está organizado todo y cómo funciona el sistema.

## Información del Proyecto

**Título:** Sistema de Gestión de Historias Clínicas - MVP

**Equipo:**
- Toledo Marcos
- Miszel Veronica
- Buono Marcos

**Tecnologías:** Node.js, Express, PostgreSQL (Neon), HTML/CSS/JavaScript vanilla

---

## Estructura del Proyecto (Para explicar en la presentación)

Cuando nos pregunten cómo organizamos el código, podemos mostrar esto:

```
Historias_clinicas/
│
├── backend/                    # Todo el servidor
│   ├── server.js              # Punto de entrada, acá arranca Express
│   ├── db/
│   │   └── connection.js      # Conexión a PostgreSQL con pool
│   ├── routes/                # Definimos los endpoints de la API
│   │   ├── auth.js            # Login, logout, recuperar contraseña
│   │   ├── pacientes.js       # CRUD de pacientes
│   │   ├── consultas.js       # CRUD de consultas (historias clínicas)
│   │   └── turnos.js          # CRUD de turnos (futuro)
│   ├── controllers/           # Lógica de negocio
│   │   ├── authController.js
│   │   ├── pacientesController.js
│   │   ├── consultasController.js
│   │   └── turnosController.js
│   ├── models/                # Acceso directo a la base de datos
│   │   ├── Usuario.js
│   │   ├── Paciente.js
│   │   ├── Consulta.js
│   │   └── Turno.js
│   ├── middlewares/           # Funciones que se ejecutan antes de las rutas
│   │   └── auth.js            # Verificar que el usuario esté logueado
│   └── scripts/               # Utilidades
│       ├── create_admin.js    # Crear usuarios admin
│       └── check_seed.js      # Verificar datos de prueba
│
├── frontend/                   # Todo lo visual
│   ├── index.html             # Pantalla de login
│   ├── inicio.html            # Dashboard después de loguearse
│   ├── pacientes.html         # Lista de pacientes
│   ├── paciente_crear.html    # Formulario para nuevo paciente
│   ├── perfil_paciente.html   # Ficha completa del paciente
│   ├── consultas.html         # Historial de consultas
│   ├── consulta.html          # Ver/editar una consulta
│   ├── configuracion.html     # Perfil del usuario
│   ├── recuperar.html         # Recuperar contraseña
│   ├── js/                    # JavaScript por página
│   │   ├── auth.js            # Verificar sesión en el frontend
│   │   ├── utils.js           # Funciones reutilizables
│   │   └── components.js      # Header y footer compartidos
│   └── css/
│       └── styles.css         # Todos los estilos
│
├── database/                   # Scripts de base de datos
│   ├── scripts.sql            # Crear las tablas
│   ├── seeds.sql              # Datos de ejemplo
│   └── migrations/            # Cambios incrementales
│
└── docs/                       # Diagramas de flujos (PlantUML)
    ├── 01_login.puml
    ├── 02_recuperar_contrasena.puml
    └── ... (18 diagramas en total)
```

---

## Flujo General del Sistema (Para explicar verbalmente)

### 1. Inicio del Sistema

"Cuando levantamos el servidor con `npm run dev`, lo que pasa es esto:"

1. **server.js** se ejecuta y crea la aplicación Express
2. Configura las sesiones con `cookie-session` (elegimos esto en lugar de JWT porque es más simple para serverless)
3. Conecta a PostgreSQL usando el pool de conexiones en `connection.js`
4. Registra todas las rutas (`/api/auth/*`, `/api/pacientes/*`, etc.)
5. Configura Express para servir los archivos estáticos del frontend
6. El servidor escucha en el puerto 3000 (o el siguiente disponible)

### 2. Autenticación (Login)

"El flujo de login es bastante directo:"

1. Usuario ingresa email y contraseña en `index.html`
2. El frontend hace `POST /api/auth/login` con los datos
3. En el backend:
   - `routes/auth.js` recibe la petición
   - Llama a `authController.login()`
   - El controlador usa `Usuario.obtenerPorEmail()` para buscar al usuario
   - Verifica la contraseña con `bcrypt.compare()` (hasheamos con 10 rounds)
   - Si todo está bien, guarda el usuario en la sesión: `req.session.usuario = {...}`
   - Envía la cookie de sesión al navegador
4. El frontend guarda que está logueado y redirige a `inicio.html`

**Por qué usamos cookie-session:**
- Es más simple que JWT
- Funciona perfecto con Vercel serverless
- No necesitamos blacklist de tokens
- La sesión dura 7 días (30 si marcás "Recordarme")

### 3. Recuperación de Contraseña (Pregunta Secreta)

"Acá implementamos algo distinto a lo común:"

En lugar de enviar emails con códigos, usamos preguntas secretas:

1. **Configurar pregunta** (en configuracion.html):
   - Usuario logueado ingresa una pregunta y respuesta
   - `POST /api/auth/pregunta-secreta/configurar`
   - La respuesta se hashea con bcrypt igual que la contraseña
   - Se guarda en la BD: `pregunta_secreta` y `respuesta_secreta_hash`

2. **Recuperar contraseña** (en recuperar.html):
   - Usuario ingresa su email
   - `POST /api/auth/pregunta-secreta/obtener` → recibe su pregunta
   - Usuario responde + ingresa nueva contraseña
   - `POST /api/auth/recuperar` → verifica respuesta con bcrypt.compare
   - Si es correcta, actualiza la contraseña

**Ventajas:**
- No necesitamos configurar email
- Es simple de explicar
- Seguro (respuesta hasheada)
- Perfecto para un MVP

### 4. Gestión de Pacientes

"El CRUD de pacientes tiene multitenancy integrado:"

**Crear paciente:**
1. Doctor completa formulario en `paciente_crear.html`
2. `POST /api/pacientes` con los datos
3. El middleware `verificarAuth` verifica que haya sesión
4. El controlador agrega automáticamente el `tenant_id` del usuario logueado
5. Se guarda en la BD con: `INSERT INTO pacientes (..., tenant_id) VALUES (..., $tenant_id)`

**Listar pacientes:**
- `GET /api/pacientes`
- Siempre filtra por `WHERE tenant_id = $tenant_id`
- Cada doctor ve solo SUS pacientes

**Por qué multitenancy:**
- Cada doctor tiene sus propios datos
- Un doctor nunca ve pacientes de otro
- Usamos `tenant_id` en todas las tablas (pacientes, consultas, turnos)

### 5. Consultas (Historias Clínicas)

"Las consultas son las entradas de la historia clínica:"

1. Desde `perfil_paciente.html` → clic en "Nueva consulta"
2. Se abre `consulta.html` con formulario
3. `POST /api/consultas` con:
   - id_paciente
   - fecha
   - motivo
   - diagnóstico
   - prescripciones
   - estudios
   - observaciones
4. Se valida que el paciente pertenezca al tenant del doctor
5. Se guarda la consulta

**Visualizar historial:**
- `GET /api/consultas/paciente/:id`
- Devuelve todas las consultas ordenadas por fecha (más reciente primero)
- Se muestran en el perfil del paciente como un timeline

### 6. Sistema de Turnos

"Los turnos están preparados pero marcados como funcionalidad futura:"

- Tenemos las rutas, modelos, controladores y vistas
- En los diagramas UML los marcamos con banner rojo "FUNCIONALIDAD FUTURA"
- No es prioridad del MVP pero el código está listo para extender

---

## Decisiones Técnicas Importantes (Para justificar)

### 1. PostgreSQL en Neon

**Por qué:**
- Es gratis hasta 512 MB (perfecto para MVP)
- PostgreSQL es más robusto que SQLite para producción
- Neon maneja backups automáticos
- Tiene connection pooling integrado

### 2. Cookie-session en lugar de JWT

**Por qué:**
- Más simple de implementar
- Compatible con Vercel serverless (stateless)
- No necesitamos lógica de refresh tokens
- No necesitamos blacklist
- La sesión se cifra con `SESSION_SECRET`

### 3. Bcrypt para contraseñas

**Por qué:**
- Estándar de la industria
- Hasheamos con 10 rounds (balance entre seguridad y performance)
- Usamos el mismo sistema para las respuestas secretas

### 4. Soft Delete en pacientes

**Por qué:**
- No perdemos datos históricos
- Las consultas del paciente se preservan
- Solo marcamos `activo = false`
- Si borráramos permanentemente, perderíamos el historial

### 5. Frontend Vanilla (sin frameworks)

**Por qué:**
- Más fácil de entender el código
- No hay complejidad extra de React/Vue
- Carga más rápida
- Perfecto para demostrar conocimientos fundamentales

---

## Características de Seguridad (Para destacar)

1. **Contraseñas hasheadas:** Nunca guardamos contraseñas en texto plano
2. **Sesiones cifradas:** La cookie se cifra con SESSION_SECRET
3. **Middlewares de protección:**
   - `verificarAuth`: Solo usuarios logueados acceden a rutas privadas
   - `verificarAdmin`: Solo admins pueden crear usuarios
4. **Multitenancy:** Aislamiento total de datos entre usuarios
5. **Validación de entrada:** Verificamos campos requeridos antes de guardar
6. **SQL con parámetros:** Usamos `$1, $2` en lugar de concatenar strings (evita SQL injection)

---

## Demostración en Vivo (Flujo recomendado)

### 1. Login (2 minutos)
- Mostrar `index.html`
- Ingresar con `doctor@clinica.com` / `password123`
- Explicar que verifica con bcrypt y crea sesión
- Mostrar redirección a `inicio.html`

### 2. Gestión de Pacientes (3 minutos)
- Ir a "Pacientes"
- Crear un paciente nuevo
- Mostrar que se guarda con el `tenant_id`
- Buscar un paciente
- Ver su perfil completo

### 3. Consultas (3 minutos)
- Desde el perfil de un paciente, crear nueva consulta
- Llenar motivo, diagnóstico, prescripciones
- Guardar y mostrar que aparece en el historial
- Editar una consulta existente

### 4. Pregunta Secreta (2 minutos)
- Ir a Configuración
- Configurar pregunta: "¿Nombre de tu primera mascota?" → "Firulais"
- Cerrar sesión
- Ir a "Recuperar contraseña"
- Ingresar email → mostrar pregunta
- Responder y cambiar contraseña
- Loguearse con la nueva contraseña

### 5. Multitenancy (1 minuto)
- Cerrar sesión
- Loguearse con otro usuario
- Mostrar que ve solo sus propios pacientes

---

## Preguntas Frecuentes que Pueden Hacer

### "¿Por qué no usaron React o Angular?"

"Preferimos JavaScript vanilla porque queríamos enfocarnos en entender bien los conceptos fundamentales sin agregar complejidad extra. Además, para un MVP, el frontend vanilla es más rápido de cargar y más fácil de mantener."

### "¿Por qué cookie-session y no JWT?"

"Cookie-session es más simple para arquitecturas serverless como Vercel. No necesitamos manejar refresh tokens, blacklist, ni nada complejo. La sesión se cifra automáticamente con nuestro SECRET y funciona perfecto para el alcance del proyecto."

### "¿Cómo manejan la seguridad?"

"Implementamos varias capas: contraseñas hasheadas con bcrypt, sesiones cifradas, middlewares que verifican autenticación, queries con parámetros para evitar SQL injection, y multitenancy que aísla completamente los datos de cada usuario."

### "¿Por qué PostgreSQL en lugar de MySQL?"

"PostgreSQL es más robusto para datos estructurados como historias clínicas. Además, Neon nos da hosting gratuito con backups automáticos y connection pooling, que nos facilita mucho el desarrollo."

### "¿Qué falta para que sea un sistema completo?"

"Para un sistema de producción faltaría: implementar completamente el módulo de turnos, agregar exportación a PDF de las historias clínicas, sistema de búsqueda avanzada, notificaciones, y un panel de estadísticas. Pero como MVP, cubre las funcionalidades core que un consultorio necesita."

### "¿Probaron el sistema?"

"Sí, hicimos pruebas manuales de todos los flujos: login, registro, CRUD de pacientes, CRUD de consultas, recuperación de contraseña, cambio de contraseña, y verificamos el multitenancy creando varios usuarios."

---

## Código Importante para Mostrar

### 1. authController.js - Login
```javascript
// Ejemplo de cómo hasheamos y verificamos contraseñas
const esValida = await bcrypt.compare(password, usuario.password_hash);
if (esValida) {
  req.session.usuario = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    tenant_id: usuario.tenant_id
  };
}
```

### 2. middlewares/auth.js - Verificar sesión
```javascript
// Middleware que protege rutas privadas
function verificarAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}
```

### 3. Paciente.js - Multitenancy
```javascript
// Siempre filtramos por tenant_id
static async obtenerPorUsuario(idUsuario) {
  const query = 'SELECT * FROM pacientes WHERE tenant_id = $1 AND activo = true';
  const { rows } = await pool.query(query, [idUsuario]);
  return rows;
}
```

---

## Diagramas para Mostrar

Los diagramas están en `/docs/` y explican visualmente cada flujo:

- **01_login.puml:** Flujo completo de autenticación
- **02_recuperar_contrasena.puml:** Sistema de pregunta secreta
- **04_crear_paciente.puml:** Cómo se crea un paciente con multitenancy
- **Arquitectura.puml:** Vista general del sistema (Vercel + Neon + Frontend)

Podemos abrirlos con la extensión PlantUML en VS Code durante la presentación.

---

## Cierre de la Presentación

"En resumen, desarrollamos un MVP funcional que cubre las necesidades básicas de un consultorio médico: gestión de pacientes, registro de consultas, y un sistema de autenticación seguro. Usamos tecnologías modernas como PostgreSQL en la nube, arquitectura serverless-ready, y aplicamos buenas prácticas de seguridad como multitenancy y hasheo de contraseñas. El código está completamente comentado y listo para escalar con nuevas funcionalidades."

---

## Contacto del Equipo

- Toledo Marcos
- Miszel Veronica
- Buono Marcos

**Repositorio:** github.com/marcostoledo96/mvp_historias-clinicas

---

_Este documento fue creado como guía de estudio para la defensa oral. Repasar antes de la presentación._
