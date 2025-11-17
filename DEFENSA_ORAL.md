# Guía para la defensa oral del proyecto

Este documento lo armé para tener claro qué decir en la defensa. La idea es poder contar, de forma ordenada y en mis palabras:
- cómo está armado el sistema,
- cómo lo relaciono con la consigna del TP,
- cómo se conectan las historias de usuario, los diagramas UML y el código,
- y tener un guion de diálogo para explicar el backend línea por línea.

---

## 1. Información general del proyecto

**Título del proyecto:** Sistema de Gestión de Historias Clínicas – MVP  
**Tipo de trabajo:** Trabajo práctico integrador (aplicación web full‑stack)  

**Equipo de desarrollo:**
- Toledo Marcos
- Miszel Verónica
- Buono Marcos

**Tecnologías principales:**
- Backend: Node.js, Express, cookie‑session, bcrypt, pg
- Base de datos: PostgreSQL en la nube (Neon)
- Frontend: HTML5, CSS3 y JavaScript vanilla (sin frameworks)
- Deploy: Vercel (frontend estático + funciones serverless para la API)

**Repositorio del proyecto:**  
`github.com/marcostoledo96/mvp_historias-clinicas`

---

## 2. Relación con la consigna del TP

En `TP.md` tengo la consigna original (sistema de historias clínicas). A partir de eso definimos este alcance concreto para el MVP:

- Que un profesional médico pueda:
  - Iniciar sesión de forma segura.
  - Gestionar pacientes (crear, buscar, editar y dar de baja).
  - Registrar y consultar la historia clínica de cada paciente (consultas médicas).
  - Recuperar su contraseña de forma segura, sin depender de correo electrónico (pregunta secreta).
- Que toda la información quede persistida en una base de datos relacional.
- Que el sistema pueda crecer con un módulo de turnos (dejado como **funcionalidad futura**).
- Que la arquitectura y los principales flujos estén documentados con diagramas UML en `docs/`.

Frase para usar en la defensa:

> “La consigna pedía un sistema de historias clínicas. Nosotros lo bajamos a un MVP realista: login seguro, gestión de pacientes, registro de consultas, recuperación de contraseña y un diseño preparado para turnos y futuras extensiones. Todo eso respaldado por PostgreSQL y documentado con UML en la carpeta `docs`.”

---

## 3. Historias de usuario y alcance funcional

Primero armamos historias de usuario (PDF `docs/Historias_usuarios.pdf`, y `HU.md`). Las principales:

- **HU1 – Autenticación del profesional**  
  “Como médico quiero iniciar sesión con mi usuario y contraseña para acceder a mis pacientes y consultas.”

- **HU2 – Gestión de pacientes**  
  “Como médico quiero registrar los datos personales y de cobertura de mis pacientes para poder consultarlos fácilmente.”

- **HU3 – Historia clínica (consultas)**  
  “Como médico quiero registrar las consultas de cada paciente para tener su historia clínica completa en un solo lugar.”

- **HU4 – Recuperación de contraseña**  
  “Como médico quiero poder recuperar mi contraseña de forma segura para no perder acceso al sistema.”

- **HU5 – Turnos del día (futuro)**  
  “Como médico quiero ver y administrar mis turnos del día para organizar mi agenda.”

- **HU6 – Perfil del usuario**  
  “Como médico quiero actualizar mis datos personales y contraseña para mantener mi cuenta al día.”

Alcance del MVP:

- **Implementado completamente:** autenticación, gestión de pacientes, registro de consultas, perfil de usuario y recuperación de contraseña.
- **Diseñado pero no completo en UI:** módulo de turnos (modelo/tabla/rutas listos; faltan pantallas).

---

## 4. Arquitectura general del sistema

Uso el diagrama `docs/Arquitectura.puml` como soporte visual. A grandes rasgos:

### 4.1. Frontend (cliente web)

- HTML + CSS + JavaScript vanilla.
- Páginas principales:
  - `index.html` → login
  - `inicio.html` → búsqueda rápida tras el login
  - `pacientes.html` / `paciente_crear.html` / `perfil_paciente.html`
  - `consultas.html` / `consulta.html`
  - `configuracion.html` → perfil + pregunta secreta
  - `recuperar.html` → recuperación de contraseña
- JS organizado:
  - `js/auth.js` → verifica sesión en el frontend.
  - `js/utils.js` → funciones auxiliares (fetch, manejo de errores, etc.).
  - `js/components.js` → header y footer reutilizables.
- Comunicación con backend vía `fetch` a rutas `/api/...`.

### 4.2. Backend (API REST con Node.js / Express)

Todo en `backend/`:

- `server.js`  
  Configura Express, CORS con credenciales, sesiones con cookie‑session, registros de rutas, healthcheck `/api/health` y servicio de estáticos para `frontend/`. Está preparado para correr local y en Vercel.

- Carpetas:
  - `db/connection.js` → conexión a PostgreSQL con pool.
  - `routes/`
    - `auth.js` → login, logout, perfil, pregunta secreta, recuperación de contraseña.
    - `pacientes.js` → CRUD de pacientes.
    - `consultas.js` → CRUD de consultas.
    - `turnos.js` → CRUD de turnos (pensado como futuro).
  - `controllers/`
    - `authController.js`
    - `pacientesController.js`
    - `consultasController.js`
    - `turnosController.js`
  - `models/`
    - `Usuario.js`
    - `Paciente.js`
    - `Consulta.js`
    - `Turno.js`
  - `middlewares/`
    - `auth.js` → verificar sesión, rol admin, logging, validación de campos.
  - `scripts/`
    - `create_admin.js` → crear usuario admin desde terminal.
    - `check_seed.js` → verificar datos de prueba.

Flujo básico: **Rutas → Middlewares → Controladores → Modelos → Base de datos**.

### 4.3. Base de datos (PostgreSQL en Neon)

Definición base en `database/scripts.sql` + migraciones en `database/migrations/`.

Tablas principales:

- `usuarios`
  - Email (único), nombre completo, `password_hash`, `rol`, `activo`.
  - Campos adicionales: `pregunta_secreta`, `respuesta_secreta_hash`.

- `pacientes`
  - Datos personales (nombre, apellido, DNI, etc.) y de cobertura.
  - `id_usuario` → médico dueño del paciente (**multitenancy por usuario**).
  - Campo `activo` para soft delete.

- `consultas`
  - Historia clínica: motivo, diagnóstico, tratamiento, estudios, archivo adjunto.
  - Relacionada con `id_usuario` e `id_paciente`.

- `turnos`
  - Diseñado para agenda (día, horario, situación, etc.).
  - Relacionado con usuario y paciente; preparado para futura UI.

---

## 5. Estructura del proyecto (para mostrar)

```text
Historias_clinicas/
  backend/              # Backend Node.js/Express
    server.js           # Servidor principal
    db/connection.js    # Conexión a PostgreSQL
    routes/             # Endpoints de la API
    controllers/        # Lógica de negocio
    models/             # Acceso a la base de datos
    middlewares/        # Autenticación, validación, logging
    scripts/            # Scripts auxiliares (admin, seeds)

  frontend/             # Interfaz web
    *.html              # Pantallas del sistema
    js/                 # Lógica de frontend
    css/styles.css      # Estilos

  database/             # Base de datos
    scripts.sql         # Esquema inicial
    seeds.sql           # Datos de ejemplo
    migrations/         # Cambios incrementales

  docs/                 # Diagramas PlantUML y PDFs
    01_login.puml
    ...
    18_perfil_usuario.puml
    Arquitectura.puml
    Historias_usuarios.pdf
```

---

## 6. Flujo general del sistema (para explicar de corrido)

### 6.1. Inicio del sistema

Cuando corro `npm run dev` dentro de `backend/`:

1. Se ejecuta `server.js` y se crea la aplicación Express.
2. Se configuran CORS con credenciales y sesiones con `cookie-session`.
3. Se inicializan los parsers para JSON y formularios.
4. Se registran las rutas:
   - `/api/auth/*`
   - `/api/pacientes/*`
   - `/api/consultas/*`
   - `/api/turnos/*` (preparadas para futuro).
5. Se sirven los archivos estáticos de `frontend/`.
6. El servidor escucha en el puerto 3000 (o el siguiente libre).

### 6.2. Autenticación (login)

Flujo (diagrama `docs/01_login.puml`):

1. Usuario ingresa email y contraseña en `index.html`.
2. Frontend hace `POST /api/auth/login` con esos datos.
3. En backend:
   - `routes/auth.js` recibe la petición.
   - Llama a `authController.login()`.
   - El controlador usa `Usuario.buscarPorEmail()` para buscar en la BD.
   - Compara contraseña con `bcrypt.compare()` (10 rondas).
   - Si es válida, crea la sesión: `req.session.usuario = {...}`.
4. Express envía cookie de sesión al navegador.
5. El frontend redirige a `inicio.html` y usa `auth.js` para verificar sesión en cada página.

### 6.3. Recuperación de contraseña (pregunta secreta)

Flujo (diagrama `docs/02_recuperar_contrasena.puml`):

1. En `configuracion.html` el usuario logueado configura una pregunta y respuesta secreta.
2. Se manda `POST /api/auth/pregunta-secreta/configurar`.
3. En el backend:
   - Se normaliza la respuesta (minúsculas, trim).
   - Se hashea con bcrypt y se guardan `pregunta_secreta` y `respuesta_secreta_hash`.
4. Para recuperar contraseña:
   - En `recuperar.html` se ingresa email.
   - `POST /api/auth/pregunta-secreta/obtener` devuelve la pregunta.
   - El usuario responde y propone nueva contraseña.
   - `POST /api/auth/recuperar` verifica respuesta con `bcrypt.compare`.
   - Si es correcta, se actualiza `password_hash`.

### 6.4. Gestión de pacientes

- Crear paciente:
  1. Formulario en `paciente_crear.html`.
  2. `POST /api/pacientes`.
  3. Middlewares `verificarAuth` y `verificarDoctor`.
  4. Controlador llama a `Paciente.crear(datos, idUsuario)`.
  5. Se inserta paciente en BD asociado a `id_usuario` del médico.

- Listar / buscar:
  - `GET /api/pacientes?buscar=...`.
  - Siempre filtra por `id_usuario` y `activo = true`.
  - Cada médico ve sólo sus pacientes (**multitenancy**).

- Editar / eliminar (soft delete):
  - Editar: `PUT /api/pacientes/:id`.
  - Eliminar: `DELETE /api/pacientes/:id` → se marca `activo = false`.
  - Las consultas del paciente no se pierden.

### 6.5. Consultas (historia clínica)

- Desde `perfil_paciente.html` se abre `consulta.html`.
- El formulario envía `POST /api/consultas` con:
  - `id_paciente`, fecha, hora, motivo, diagnóstico, tratamiento, estudios, observaciones.
- El controlador valida:
  - Usuario logueado.
  ￼- Paciente pertenece a ese usuario (multitenancy).
- Se guarda la consulta.
- Historial: `GET /api/consultas/paciente/:id_paciente` (ordenado por fecha y hora).

### 6.6. Turnos (módulo preparado, no MVP)

- Tablas, modelos y rutas de turnos creados.
- Situaciones: programado, en espera, atendido, ausente, cancelado.
- El frontend aún no usa estos endpoints, pero la arquitectura ya está lista para agregarlos sin romper nada.

---

## 7. Decisiones técnicas importantes

### 7.1. PostgreSQL en Neon

- Servicio administrado en la nube (no instalo nada local).
- Plan gratuito suficiente para un MVP.
- Conexión segura con `DATABASE_URL`.
- Compatible con `pg` y connection pooling.

### 7.2. Sesiones con cookie-session (no JWT)

- Más simple que JWT para este caso.
- Funciona muy bien en Vercel (serverless).
- No necesito manejar refresh tokens ni listas negras.
- Cookie cifrada con `SESSION_SECRET`, con expiración configurable.

### 7.3. Bcrypt para contraseñas y respuestas secretas

- Estándar de la industria.
- 10 rondas (balance entre seguridad y performance).
- Tanto contraseñas como respuestas secretas se guardan hasheadas (nunca en texto plano).

### 7.4. Multitenancy por usuario

- Una sola base de datos, pero datos aislados por `id_usuario`.
- Tablas `pacientes`, `consultas`, `turnos` relacionados con `usuarios`.
- Todas las consultas filtran por usuario; un médico no ve pacientes de otro.

### 7.5. Soft delete para pacientes

- Al eliminar un paciente se marca `activo = false`, no se borra físicamente.
- Se preserva la historia clínica y se facilita auditoría.

### 7.6. Frontend sin frameworks

- JavaScript + HTML/CSS puros → más fácil de leer y explicar en una defensa.
- Bundle liviano, sin dependencias pesadas.
- Para el alcance del trabajo práctico no era necesario React/Vue.

---

## 8. Características de seguridad

Puntos para destacar:

1. **Contraseñas hasheadas** con bcrypt (y respuestas secretas), nunca en texto plano.
2. **Sesiones cifradas** con `cookie-session` y `SESSION_SECRET`.
3. **Middlewares de protección:**
   - `verificarAuth`: sólo usuarios logueados acceden a rutas privadas.
   - `verificarAdmin`: sólo admins pueden crear nuevos usuarios.
4. **Multitenancy**: cada médico ve sólo sus pacientes y consultas.
5. **Validación de entrada** con middlewares y controladores (campos requeridos).
6. **SQL con parámetros** (`$1, $2, ...`) para evitar SQL injection.

---

## 9. Plan de demostración en la defensa

Orden sugerido (10–12 minutos):

1. **Login (2 minutos)**
   - Mostrar `index.html`.
   - Loguearse con usuario demo.
   - Explicar cómo valida bcrypt y cómo se crea la sesión.

2. **Gestión de pacientes (3 minutos)**
   - `pacientes.html`: listar pacientes.
   - Crear un paciente nuevo.
   - Buscar por nombre/DNI.
   - Abrir `perfil_paciente.html`.

3. **Consultas (3 minutos)**
   - Desde el perfil, crear una nueva consulta.
   - Cargar motivo, diagnóstico y tratamiento.
   - Guardar y ver cómo aparece en el historial.
   - Editar una consulta existente.

4. **Pregunta secreta y recuperación (2–3 minutos)**
   - En `configuracion.html`, configurar pregunta y respuesta secreta.
   - Cerrar sesión.
   - Ir a `recuperar.html`, ingresar email, responder y cambiar contraseña.
   - Volver a loguearse con la nueva contraseña.

5. **Multitenancy (1–2 minutos)**
   - (Opcional) mostrar con dos usuarios que cada uno ve sólo sus pacientes.

---

## 10. Código clave del backend (comentado)

Aquí dejo los bloques de código más importantes del backend, muy comentados para poder explicarlos línea por línea.

### 10.1. Login con bcrypt y cookie-session (`backend/controllers/authController.js`)

```javascript
const passwordValido = await bcrypt.compare(password, usuario.password_hash);

if (!passwordValido) {
  return res.status(401).json({ error: 'Credenciales inválidas' });
}

req.session = req.session || {};
req.session.usuarioId = usuario.id_usuario;

req.session.usuario = {
  id: usuario.id_usuario,
  email: usuario.email,
  nombre: usuario.nombre_completo,
  rol: usuario.rol
};
```

### 10.2. Middleware de autenticación (`backend/middlewares/auth.js`)

```javascript
function verificarAuth(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  return res.status(401).json({ error: 'No autenticado. Debes iniciar sesión.' });
}
```

### 10.3. Multitenancy en pacientes (`backend/models/Paciente.js`)

```javascript
static async obtenerTodos(idUsuario) {
  const query = `
    SELECT id_paciente, nombre, apellido
    FROM pacientes
    WHERE activo = true
      AND id_usuario = $1
    ORDER BY apellido, nombre
  `;

  const { rows } = await conexionBD.query(query, [idUsuario]);

  return rows;
}
```

### 10.4. Ruta de login en Express (`backend/routes/auth.js`)

```javascript
router.post(
  '/login',
  validarCamposRequeridos(['email', 'password']),
  authController.login
);
```

### 10.5. Recuperar contraseña con pregunta secreta (`backend/controllers/authController.js`)

```javascript
authController.recuperarConPreguntaSecreta = async (req, res) => {
  try {
    const { email, respuesta, nueva_password } = req.body;

    if (!email || !respuesta || !nueva_password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const usuario = await Usuario.obtenerUsuarioConRespuestaHash(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!usuario.respuesta_secreta_hash) {
      return res.status(400).json({
        error: 'Este usuario no tiene pregunta secreta. Contacta al administrador.'
      });
    }

    const respuestaCorrecta = await bcrypt.compare(
      respuesta.toLowerCase().trim(),
      usuario.respuesta_secreta_hash
    );

    if (!respuestaCorrecta) {
      return res.status(401).json({ error: 'Respuesta incorrecta' });
    }

    const saltRounds = 10;
    const nuevaPasswordHash = await bcrypt.hash(nueva_password, saltRounds);
    await Usuario.actualizarPassword(usuario.id_usuario, nuevaPasswordHash);

    res.json({ mensaje: 'Contraseña recuperada exitosamente' });
  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    res.status(500).json({ error: 'Error al recuperar contraseña' });
  }
};
```

### 10.6. Crear una consulta médica (`backend/models/Consulta.js`)

```javascript
static async crear(datosConsulta, idUsuario) {
  try {
    const {
      id_paciente,
      fecha,
      hora,
      motivo_consulta,
      informe_medico,
      diagnostico,
      tratamiento,
      estudios,
      archivo_adjunto
    } = datosConsulta;

    const ahora = new Date();
    const fechaVal = fecha || ahora.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const horaVal = hora || ahora.toTimeString().slice(0, 8);   // "HH:MM:SS"

    const result = await pool.query(
      `INSERT INTO consultas (
         id_usuario,
         id_paciente,
         fecha,
         hora,
         motivo_consulta,
         informe_medico,
         diagnostico,
         tratamiento,
         estudios,
         archivo_adjunto
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id_consulta`,
      [
        idUsuario,
        id_paciente,
        fechaVal,
        horaVal,
        motivo_consulta,
        informe_medico,
        diagnostico,
        tratamiento,
        estudios,
        archivo_adjunto
      ]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}
```

### 10.7. Crear consulta desde el controlador (`backend/controllers/consultasController.js`)

```javascript
crearConsulta: async (req, res) => {
  try {
    const idUsuario = req.session?.usuario?.id;
    if (!idUsuario) return res.status(401).json({ error: 'No autenticado' });

    const {
      id_paciente, fecha, hora, motivo_consulta, informe_medico,
      diagnostico, tratamiento, estudios, archivo_adjunto
    } = req.body;

    if (!id_paciente || !motivo_consulta) {
      return res.status(400).json({
        error: 'ID del paciente y motivo de consulta son requeridos'
      });
    }

    const nuevaConsulta = await Consulta.crear({
      id_paciente, fecha, hora, motivo_consulta, informe_medico,
      diagnostico, tratamiento, estudios, archivo_adjunto
    }, idUsuario);

    res.status(201).json({
      mensaje: 'Consulta creada exitosamente',
      id_consulta: nuevaConsulta.id_consulta
    });

  } catch (error) {
    console.error('Error al crear consulta:', error);
    res.status(500).json({ error: error.message });
  }
}
```

### 10.8. Crear paciente desde el controlador (`backend/controllers/pacientesController.js`)

```javascript
crearPaciente: async (req, res) => {
  try {
    const idUsuario = req.session?.usuario?.id;
    if (!idUsuario) return res.status(401).json({ error: 'No autenticado' });

    const {
      nombre, apellido, dni, fecha_nacimiento, sexo, telefono, telefono_adicional, email,
      cobertura, plan, numero_afiliado, localidad, direccion, ocupacion,
      enfermedades_preexistentes, alergias, observaciones
    } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
    }

    const normalizar = (v) => (v === undefined || v === null || String(v).trim() === '' ? null : v);
    const dniNorm = normalizar(dni);
    const fechaNacNorm = normalizar(fecha_nacimiento);

    if (dniNorm) {
      const pacienteExistente = await Paciente.buscarPorDni(dniNorm, idUsuario);
      if (pacienteExistente) {
        return res.status(409).json({ error: 'Paciente ya registrado con este DNI' });
      }
    }

    const nuevoPaciente = await Paciente.crear({
      nombre, apellido, dni: dniNorm, fecha_nacimiento: fechaNacNorm, sexo, telefono, telefono_adicional, email,
      cobertura, plan, numero_afiliado, localidad, direccion, ocupacion,
      enfermedades_preexistentes, alergias, observaciones
    }, idUsuario);

    res.status(201).json({
      mensaje: 'Paciente creado exitosamente',
      id_paciente: nuevoPaciente.id_paciente
    });

  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ error: error.message });
  }
}
```

### 10.9. Modelo de usuarios (`backend/models/Usuario.js`)

```javascript
const pool = require('../db/connection');

class Usuario {
  static async buscarPorEmail(email) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
      [email]
    );
    return result.rows[0];
  }

  static async crear(email, nombreCompleto, passwordHash, rol = 'doctor') {
    const result = await pool.query(
      'INSERT INTO usuarios (email, nombre_completo, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario, email, nombre_completo, rol',
      [email, nombreCompleto, passwordHash, rol]
    );
    return result.rows[0];
  }
}
```

---

## 11. Diagramas UML preparados

En la carpeta `docs/` tengo los diagramas PlantUML que respaldan la implementación. Algunos importantes:

- `01_login.puml` → flujo completo de autenticación.
- `02_recuperar_contrasena.puml` → proceso de recuperación con pregunta secreta.
- `04_crear_paciente.puml` → alta de paciente con relación al usuario.
- `08_crear_consulta.puml` → creación de una consulta en la historia clínica.
- `12_visualizar_turnos_del_dia.puml` → diseño del módulo de turnos.
- `Arquitectura.puml` → arquitectura general (cliente, Vercel, Neon, capas del backend).

Estos diagramas conectan las historias de usuario con las pantallas y los endpoints de la API.

---

## 12. Posibles preguntas del profesor y cómo responderlas

### 12.1. “¿Cómo pasaste de la consigna a las historias de usuario?”

> “Primero leí la consigna del TP y anoté qué actores aparecían (principalmente el médico) y qué acciones debía poder hacer. Con eso armé historias de usuario del estilo ‘Como médico quiero…’. Después agrupé esas historias en módulos: autenticación, pacientes, consultas, turnos y perfil. Cada módulo tiene su diagrama UML en `docs`. A partir de esas historias definimos pantallas, rutas de la API y diseño de la base de datos.”

### 12.2. “¿Cómo refleja la base de datos esas historias de usuario?”

> “Cada historia de usuario se tradujo en una tabla o relación. Por ejemplo, la historia de registrar consultas se refleja en la tabla `consultas`, relacionada con `usuarios` y `pacientes`. La historia de gestión de pacientes se refleja en `pacientes`, que tiene un `id_usuario` para garantizar que cada médico vea sólo sus pacientes. Así, la estructura de la BD sigue directamente lo que pedían las historias.”

### 12.3. “¿Por qué usaste cookie-session y no JWT?”

> “Elegí `cookie-session` porque para este proyecto es más simple y encaja bien con Vercel serverless. No tengo que manejar tokens de refresco ni listas negras; la sesión va cifrada en la cookie con un `SESSION_SECRET` y tiene fecha de expiración. Desde el frontend sólo tengo que enviar las cookies con `credentials: 'include'` y listo.”

### 12.4. “¿Qué medidas de seguridad implementaste?”

> “A nivel seguridad implementé varias cosas: todas las contraseñas y respuestas secretas se guardan con bcrypt, nunca en texto plano; uso `cookie-session` con un secret para cifrar la cookie; tengo middlewares que revisan si el usuario está autenticado y si es admin; todas las consultas SQL usan parámetros para evitar inyección; y el diseño de multitenancy por `id_usuario` asegura que un médico no pueda ver pacientes de otro.”

### 12.5. “¿Por qué PostgreSQL y no MySQL u otra base?”

> “PostgreSQL es muy fuerte para datos estructurados y tiene buen soporte en Node con la librería `pg`. Además, Neon ofrece PostgreSQL administrado con un plan gratuito suficiente para el MVP y manejo automático de conexiones. Podría haber usado MySQL, pero ya tenía experiencia con PostgreSQL y me resultó más natural para este tipo de proyecto.”

### 12.6. “¿Qué ventajas tiene el soft delete en pacientes?”

> “La ventaja es que nunca pierdo la historia clínica. Si borrara físicamente el paciente, perdería el contexto de todas las consultas asociadas. Con el soft delete marco `activo = false`, lo excluyo de los listados normales, pero si necesito auditar o revisar algo, la información sigue estando. En un entorno médico eso es clave.”

### 12.7. “¿Qué te faltaría para llevar esto a producción real?”

> “Para un entorno de producción real agregaría: el módulo de turnos completo con UI, logs de auditoría más finos (quién modificó qué y cuándo), exportación de historias clínicas a PDF, controles de permisos más detallados por rol, tests automatizados y un sistema de backups y monitoreo más formal. Pero para el alcance de este trabajo práctico, el MVP cumple las funcionalidades básicas que un consultorio necesita.”

### 12.8. “¿Cómo probaste el sistema?”

> “Hicimos pruebas manuales de todos los flujos principales: login, logout, cambio de contraseña, configuración y uso de la pregunta secreta, CRUD de pacientes y de consultas, y algunos escenarios de error (campos faltantes, credenciales incorrectas, usuario sin pregunta secreta). La ventaja de tener los endpoints bien separados es que se pueden probar fácil con Postman o directamente con el frontend.”

### 12.9. “Si mañana tuvieras que agregar otra funcionalidad, ¿cómo la incorporarías?”

> “La incorporaría siguiendo la misma estructura que ya tengo: primero escribiría la historia de usuario, luego el diagrama UML del flujo, después agregaría la tabla o columnas necesarias en la base de datos (con una nueva migración), crearía el modelo, el controlador, las rutas y finalmente las pantallas o componentes de frontend. Esa forma de trabajo hace que el código se mantenga ordenado y alineado con las historias de usuario.”

---

## 13. Guion de diálogo para explicar el código (resumen)

En esta sección resumí los puntos clave de la sección 10 en formato pregunta‑respuesta (profe / yo). Es lo mismo que ya expliqué arriba, pero escrito como guion para practicar la defensa.

- **Login (10.1):** explicar `bcrypt.compare`, el `if (!passwordValido)`, cómo se arma `req.session.usuario`, por qué nunca guardo la contraseña en sesión.
- **Middleware `verificarAuth` (10.2):** explicar `req`, `res`, `next`, qué significa revisar `req.session && req.session.usuario`, y por qué devuelvo 401 cuando no hay sesión.
- **Multitenancy en `Paciente.obtenerTodos` (10.3):** explicar el `idUsuario`, el `WHERE activo = true AND id_usuario = $1`, y qué significa `rows` como array de pacientes.
- **Crear paciente (10.8):** explicar por qué leo `idUsuario` de la sesión, por qué valido nombre/apellido, cómo funciona la función `normalizar`, por qué chequeo DNI duplicado y cómo llamo a `Paciente.crear`.
- **Crear consulta (10.7 y 10.6):** explicar campos mínimos (`id_paciente`, `motivo_consulta`), cómo el modelo completa fecha/hora por defecto, qué son los placeholders `$1..$10` en SQL y qué devuelve `result.rows[0]`.
- **Modelo `Usuario` (10.9):** explicar `buscarPorEmail` como base del login y `crear` como alta de usuarios con contraseña hasheada.

---

_Este documento es mi guía personal para la defensa oral. La idea es repasarlo antes de la presentación y usarlo como soporte para explicar el proyecto de forma clara y ordenada._

