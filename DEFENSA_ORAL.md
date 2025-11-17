# Guía para la defensa oral del proyecto

Este documento lo armé para tener claro qué decir en la defensa. La idea es poder contar, de forma ordenada y en mis palabras, cómo está armado el sistema, cómo lo relaciono con las consignas del trabajo práctico, con las historias de usuario y con los diagramas UML que hice en `/docs`.

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

En el archivo `TP.md` tengo la consigna original del trabajo (sistema de historias clínicas). A partir de esa consigna, nosotros nos propusimos este alcance concreto para el MVP:

- Que un profesional médico pueda:
  - Iniciar sesión de forma segura.
  - Gestionar pacientes (crear, buscar, editar y dar de baja).
  - Registrar y consultar la historia clínica de cada paciente (consultas médicas).
  - Recuperar su contraseña sin depender de correo electrónico, usando una pregunta secreta.
- Que la información quede persistida en una base de datos relacional.
- Que el sistema pueda crecer más adelante con un módulo de turnos (que dejamos preparado como **funcionalidad futura**).
- Que la arquitectura y los principales flujos estén documentados con diagramas UML (casos de uso / secuencia / arquitectura) en la carpeta `docs/`.

En la defensa yo puedo explicarlo así:

> _“La consigna nos pedía un sistema de historias clínicas. Nosotros lo bajamos a un MVP realista: login seguro, gestión de pacientes, registro de consultas, recuperación de contraseña y un diseño preparado para turnos y futuras extensiones. Todo eso está soportado por una base de datos en PostgreSQL y documentado con diagramas UML en la carpeta `docs`.”_

---

## 3. Historias de usuario y alcance funcional

Antes de ponernos a programar, lo que hicimos fue escribir historias de usuario (archivo `HU.md` y PDF `docs/Historias_usuarios.pdf`). Las principales que guiaron el diseño son:

- **HU1 – Autenticación del profesional**  
  _“Como médico quiero iniciar sesión con mi usuario y contraseña para acceder a mis pacientes y consultas.”_

- **HU2 – Gestión de pacientes**  
  _“Como médico quiero registrar los datos personales y de cobertura de mis pacientes para poder consultarlos fácilmente.”_

- **HU3 – Historia clínica (consultas)**  
  _“Como médico quiero registrar las consultas de cada paciente para tener su historia clínica completa en un solo lugar.”_

- **HU4 – Recuperación de contraseña**  
  _“Como médico quiero poder recuperar mi contraseña de forma segura para no perder acceso al sistema.”_

- **HU5 – Turnos del día (futuro)**  
  _“Como médico quiero ver y administrar mis turnos del día para organizar mi agenda.”_

- **HU6 – Perfil del usuario**  
  _“Como médico quiero actualizar mis datos personales y contraseña para mantener mi cuenta al día.”_

Con esas historias definimos el alcance del MVP:

- Lo que está **totalmente implementado**: autenticación, gestión de pacientes, registro de consultas, perfil de usuario y recuperación de contraseña.
- Lo que está **diseñado pero no terminado en UI**: módulo de turnos. El backend (rutas, modelos y controladores) existe, y en los diagramas UML lo marcamos como **“FUNCIONALIDAD FUTURA”**.

En la defensa yo puedo decir:

> _“A partir de la consigna, primero escribimos historias de usuario. Cada pantalla y cada endpoint del sistema responde a una de esas historias. Los diagramas `.puml` en la carpeta `docs` representan justamente esos flujos.”_

---

## 4. Arquitectura general del sistema

Para explicar la arquitectura, uso el diagrama `docs/Arquitectura.puml` como soporte visual. A grandes rasgos, el sistema se divide en tres partes:

### 4.1. Frontend (cliente web)

- HTML + CSS + JavaScript vanilla.
- Páginas principales:
  - `index.html` → login
  - `inicio.html` → búsqueda rápida tras el login
  - `pacientes.html` / `paciente_crear.html` / `perfil_paciente.html` → módulo de pacientes
  - `consultas.html` / `consulta.html` → módulo de consultas
  - `configuracion.html` → perfil del usuario + pregunta secreta
  - `recuperar.html` → recuperación de contraseña
- JavaScript organizado por página (`frontend/js`) más utilidades:
  - `auth.js` → verifica la sesión en el frontend.
  - `utils.js` → funciones auxiliares (fetch, manejo de errores, etc.).
  - `components.js` → header y footer reutilizables.
- El frontend se comunica con el backend usando `fetch` hacia la API REST (`/api/...`).

### 4.2. Backend (API REST en Node.js / Express)

Toda la parte de servidor está en `backend/`:

- `server.js`  
  Configura Express, CORS con credenciales, sesiones basadas en cookies, rutas de la API y servicio de archivos estáticos del frontend. Además está preparado para correr tanto localmente como en Vercel (modo serverless).

- Carpetas principales:
  - `routes/` → define los endpoints HTTP:
    - `auth.js` (login, logout, perfil, pregunta secreta, recuperación)
    - `pacientes.js` (CRUD de pacientes)
    - `consultas.js` (CRUD de consultas)
    - `turnos.js` (endpoints listos pero no usados en el MVP)
  - `controllers/` → lógica de negocio:
    - `authController.js`
    - `pacientesController.js`
    - `consultasController.js`
    - `turnosController.js`
  - `models/` → acceso a la base de datos (Active Record con `pg`):
    - `Usuario.js`
    - `Paciente.js`
    - `Consulta.js`
    - `Turno.js`
  - `middlewares/` → funciones que se ejecutan antes de las rutas:
    - `auth.js` (verificar sesión, rol admin, logging y validación de campos).
  - `db/connection.js` → conexión a PostgreSQL usando pool.
  - `scripts/` → utilidades:
    - `create_admin.js` (crear un usuario administrador desde terminal).
    - `check_seed.js` (verificar datos de prueba).

La organización que explico al profesor es: **Rutas → Middlewares → Controladores → Modelos → Base de datos**.

### 4.3. Base de datos (PostgreSQL en Neon)

La estructura base está en `database/scripts.sql` y luego se complementa con migraciones en `database/migrations/`.

Tablas principales:

- `usuarios`  
  - Guarda credenciales (email, password_hash, rol), fecha de registro, estado `activo`.  
  - Tiene campos añadidos por migraciones, como la pregunta y respuesta secreta para recuperación.

- `pacientes`  
  - Contiene todos los datos personales y de cobertura del paciente.  
  - Tiene una relación fuerte con `usuarios` vía `id_usuario`:  
    cada médico solo ve los pacientes que él mismo creó (esto implementa **multitenancy por usuario**).
  - Campo `activo` para hacer **soft delete** (no borramos definitivamente).

- `consultas`  
  - Representa cada entrada de la historia clínica.  
  - Relacionada con `usuarios` (quién atendió) y `pacientes` (a quién se atendió).  
  - Incluye motivo de consulta, diagnóstico, tratamiento, estudios, etc.

- `turnos`  
  - Estructura pensada para el módulo de turnos (día, horario, situación, etc.).  
  - Ya está lista a nivel de base de datos y API, aunque la interfaz del MVP no la usa todavía.

También hay índices para rendimiento y triggers para actualizar automáticamente `fecha_modificacion` en consultas y turnos.

---

## 5. Estructura del proyecto (para mostrar en la defensa)

Si el profesor me pregunta cómo organicé el código, puedo resumir así:

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
2. Se configuran CORS con credenciales y las sesiones con `cookie-session`.
3. Se inicializan los parsers de JSON y formularios.
4. Se registran las rutas:
   - `/api/auth/*`
   - `/api/pacientes/*`
   - `/api/consultas/*`
   - `/api/turnos/*` (preparadas para futuro).
5. Se exponen los archivos estáticos del frontend.
6. El servidor empieza a escuchar en el puerto 3000 (o el siguiente disponible si está ocupado).

### 6.2. Autenticación (login)

El flujo de login se ve en el diagrama `docs/01_login.puml` y es así:

1. El usuario ingresa email y contraseña en `index.html`.
2. El frontend hace `POST /api/auth/login` con esos datos.
3. En el backend:
   - `routes/auth.js` recibe la petición.
   - Llama a `authController.login()`.
   - El controlador usa `Usuario.buscarPorEmail()` para buscar al usuario.
   - Compara la contraseña con `bcrypt.compare()` (hash con 10 rondas).
   - Si es válida, guarda al usuario en la sesión (`req.session.usuario = {...}`).
4. Express envía la cookie de sesión al navegador.
5. El frontend redirige a `inicio.html` y a partir de ahí todas las pantallas usan `auth.js` para verificar que haya sesión.

### 6.3. Recuperación de contraseña (pregunta secreta)

El flujo está detallado en `docs/02_recuperar_contrasena.puml`:

1. En `configuracion.html` el usuario logueado configura una pregunta y respuesta secreta.
2. El frontend envía `POST /api/auth/pregunta-secreta/configurar`.
3. En el backend:
   - El controlador toma la respuesta, la normaliza y la hashea con bcrypt.
   - Guarda `pregunta_secreta` y `respuesta_secreta_hash` en la tabla `usuarios`.
4. Para recuperar contraseña:
   - En `recuperar.html` se ingresa el email.
   - `POST /api/auth/pregunta-secreta/obtener` devuelve solo la pregunta.
   - El usuario responde y propone una nueva contraseña.
   - `POST /api/auth/recuperar` verifica la respuesta con `bcrypt.compare`.
   - Si es correcta, se actualiza el `password_hash`.

Ventajas que puedo mencionar:

- No dependemos de un servicio de correo.
- La respuesta está hasheada igual que la contraseña.
- Simple y suficiente para el alcance del MVP.

### 6.4. Gestión de pacientes

Los diagramas `04_crear_paciente.puml`, `05_editar_paciente.puml`, `06_borrar_paciente.puml` y `07_visualizar_paciente.puml` detallan cada flujo. A nivel verbal:

- **Crear paciente**
  1. El médico completa el formulario en `paciente_crear.html`.
  2. El frontend hace `POST /api/pacientes`.
  3. Pasa por el middleware `verificarAuth` (solo usuarios logueados).
  4. El controlador llama a `Paciente.crear(datos, idUsuario)`.
  5. En la BD se inserta el paciente asociado a `id_usuario` del médico.

- **Listar / buscar pacientes**
  - `GET /api/pacientes?buscar=...`
  - Siempre se filtra por `id_usuario` y `activo = true`.
  - Cada médico ve solo sus propios pacientes (**multitenancy por usuario**).

- **Editar / eliminar (soft delete)**
  - Para editar: `PUT /api/pacientes/:id`.
  - Para eliminar: `DELETE /api/pacientes/:id`, que en realidad marca `activo = false`.
  - Nunca se pierde la historia clínica; las consultas siguen referenciando al paciente.

### 6.5. Consultas (historia clínica)

Los flujos se ven en `08_crear_consulta.puml`, `09_editar_consulta.puml`, `10_borrar_consulta.puml` y `11_visualizar_consulta.puml`.

- Desde `perfil_paciente.html` se crea una nueva consulta (`consulta.html`).
- El formulario envía `POST /api/consultas` con:
  - `id_paciente`
  - fecha y hora (o valores por defecto)
  - motivo de consulta
  - diagnóstico
  - tratamiento / estudios / observaciones
- El controlador valida que:
  - El usuario esté logueado.
  - El paciente pertenezca a ese usuario (multitenancy).
- La consulta se guarda y luego se lista en el historial del paciente:
  - `GET /api/consultas/paciente/:id_paciente` (ordenado por fecha).

### 6.6. Turnos (módulo preparado, no MVP)

En `12_visualizar_turnos_del_dia.puml` a `15_borrar_turno_del_dia.puml` está el diseño del módulo de turnos:

- Tablas, modelos y rutas de turnos ya creados.
- Situaciones posibles: programado, en espera, atendido, ausente, cancelado.
- El frontend todavía no consume estos endpoints, pero la arquitectura queda lista para agregarlo después sin romper lo ya hecho.

En la defensa yo lo presento como **funcionalidad futura** incluida en el diseño.

---

## 7. Decisiones técnicas importantes

### 7.1. PostgreSQL en Neon

Elegimos PostgreSQL en Neon por:

- Servicio administrado en la nube (no tengo que instalar nada local).
- Plan gratuito suficiente para un MVP.
- Soporte de conexión segura con `DATABASE_URL`.
- Permite usar `pg` con pool de conexiones.

### 7.2. Sesiones con cookie-session en lugar de JWT

Motivos:

- Para este proyecto es más simple manejar sesiones con cookies que tokens JWT.
- Funciona muy bien en entornos serverless como Vercel.
- No necesitamos lógica de refresh tokens ni blacklist.
- La cookie está cifrada con `SESSION_SECRET` y tiene control de expiración.

### 7.3. Bcrypt para contraseñas y respuestas secretas

- Bcrypt es un estándar de la industria para almacenar contraseñas.
- Usamos 10 rondas, que es un equilibrio razonable entre seguridad y rendimiento.
- Tanto la contraseña como la respuesta secreta se almacenan hasheadas.

### 7.4. Multitenancy por usuario

- En lugar de tener múltiples bases de datos, usamos una sola BD con aislamiento por `id_usuario`.
- Tablas como `pacientes`, `consultas` y `turnos` tienen relación con `usuarios`.
- Todas las consultas del modelo filtran por usuario, garantizando que un médico nunca vea datos de otro.

### 7.5. Soft delete para pacientes

- Al “eliminar” un paciente, no lo borramos físicamente.
- Marcamos `activo = false` y dejamos intactas las consultas asociadas.
- Esto preserva la historia clínica y facilita auditoría.

### 7.6. Frontend sin frameworks

- Usar JavaScript puro y HTML/CSS hace que el código sea más fácil de leer y explicar en una defensa oral.
- El bundle es liviano, sin dependencias pesadas.
- Para el alcance del trabajo práctico no necesitamos la complejidad de React/Vue.

---

## 8. Características de seguridad

Puntos para destacar al profesor:

1. **Contraseñas hasheadas** con bcrypt, nunca en texto plano.
2. **Sesiones cifradas** con `cookie-session` y `SESSION_SECRET`.
3. **Middlewares de protección:**
   - `verificarAuth`: sólo usuarios logueados acceden a rutas privadas.
   - `verificarAdmin`: sólo administradores pueden crear usuarios nuevos.
4. **Multitenancy**: cada médico ve sólo sus pacientes y consultas.
5. **Validación de entrada** en controladores y middlewares (campos requeridos).
6. **SQL con parámetros** (`$1, $2, ...`) para evitar SQL injection.

---

## 9. Plan de demostración en la defensa

Orden sugerido (aprox. 10–12 minutos):

1. **Login (2 minutos)**
   - Mostrar `index.html`.
   - Loguearse con un usuario de prueba.
   - Explicar brevemente cómo valida bcrypt y cómo se crea la sesión.

2. **Gestión de pacientes (3 minutos)**
   - Mostrar `pacientes.html`.
   - Crear un paciente nuevo.
   - Buscar por nombre o DNI.
   - Abrir `perfil_paciente.html`.

3. **Consultas (3 minutos)**
   - Desde el perfil del paciente, crear una nueva consulta.
   - Cargar motivo, diagnóstico y tratamiento.
   - Guardar y ver cómo se suma al historial.
   - Editar una consulta existente.

4. **Pregunta secreta y recuperación (2–3 minutos)**
   - En `configuracion.html`, configurar una pregunta y respuesta secreta.
   - Cerrar sesión.
   - Ir a `recuperar.html`, ingresar email y responder la pregunta.
   - Cambiar la contraseña y volver a loguearse.

5. **Multitenancy (1–2 minutos)**
   - (Opcional) mostrar con dos usuarios distintos que cada uno ve sólo sus pacientes.

En todo momento puedo ir abriendo los diagramas `.puml` relevantes en VS Code para apoyar la explicación.

---

## 10. Código clave para mostrar si me lo piden

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
    WHERE activo = true AND id_usuario = $1
    ORDER BY apellido, nombre
  `;
  const { rows } = await conexionBD.query(query, [idUsuario]);
  return rows;
}
```

Con estos trozos de código puedo mostrar rápidamente cómo se combinan seguridad, sesiones y aislamiento por usuario.

---

## 11. Diagramas UML preparados

En la carpeta `docs/` tengo los diagramas PlantUML que respaldan la implementación. Algunos que puedo mostrar:

- `01_login.puml` → flujo completo de autenticación.
- `02_recuperar_contrasena.puml` → proceso de recuperación con pregunta secreta.
- `04_crear_paciente.puml` → alta de paciente con relación al usuario.
- `08_crear_consulta.puml` → creación de una consulta en la historia clínica.
- `12_visualizar_turnos_del_dia.puml` → diseño del módulo de turnos.
- `Arquitectura.puml` → arquitectura general (cliente, Vercel, Neon, capas del backend).

Estos diagramas conectan directamente las historias de usuario con las pantallas y los endpoints de la API.

---

## 12. Posibles preguntas del profesor y cómo responderlas

Al final de la defensa, es probable que el profesor pregunte más en profundidad. Dejé preparadas algunas preguntas típicas con respuestas en mis palabras.

### 12.1. “¿Cómo pasaste de la consigna a las historias de usuario?”

> _“Primero leí la consigna del TP y anoté qué actores aparecían (principalmente el médico) y qué acciones debía poder hacer. Con eso armé historias de usuario del estilo ‘Como médico quiero…’. Después agrupé esas historias en módulos: autenticación, pacientes, consultas, turnos y perfil. Cada módulo tiene su diagrama UML correspondiente en la carpeta `docs`. A partir de esas historias definimos las pantallas, las rutas de la API y el diseño de la base de datos.”_

### 12.2. “¿Cómo refleja la base de datos esas historias de usuario?”

> _“Cada historia de usuario se tradujo en una tabla o relación. Por ejemplo, la historia de registrar consultas se refleja en la tabla `consultas`, relacionada con `usuarios` y `pacientes`. La historia de gestión de pacientes se refleja en la tabla `pacientes`, que tiene un `id_usuario` para garantizar que cada médico vea sólo sus pacientes. Así, la estructura de la base de datos sigue directamente lo que pedían las historias.”_

### 12.3. “¿Por qué usaste cookie-session y no JWT?”

> _“Elegí `cookie-session` porque para este proyecto es más simple y encaja muy bien con Vercel serverless. No tengo que manejar tokens de refresco ni listas negras; la sesión va cifrada en la cookie con un `SESSION_SECRET` y tiene fecha de expiración. Además, desde el frontend sólo tengo que preocuparme por enviar las cookies con `credentials: 'include'` y listo.”_

### 12.4. “¿Qué medidas de seguridad implementaste?”

> _“A nivel seguridad implementé varias cosas: todas las contraseñas y respuestas secretas se guardan con bcrypt, nunca en texto plano; uso `cookie-session` con un secret para cifrar la cookie; tengo middlewares que revisan si el usuario está autenticado y si es admin; todas las consultas SQL usan parámetros para evitar inyección; y, por último, el diseño de multitenancy por `id_usuario` asegura que un médico no pueda ver pacientes de otro.”_

### 12.5. “¿Por qué PostgreSQL y no MySQL u otra base?”

> _“PostgreSQL es muy fuerte para datos estructurados y tiene buen soporte en Node con la librería `pg`. Además, Neon ofrece PostgreSQL administrado con un plan gratuito suficiente para el MVP y manejo automático de conexiones. Podría haber usado MySQL, pero ya tenía experiencia con PostgreSQL y me resultó más natural para este tipo de proyecto.”_

### 12.6. “¿Qué ventajas tiene el soft delete en pacientes?”

> _“La ventaja es que nunca pierdo la historia clínica. Si borrara físicamente el paciente, perdería el contexto de todas las consultas asociadas. Con el soft delete marco `activo = false`, lo excluyo de los listados normales, pero si necesito auditar o revisar algo, la información sigue estando. En un entorno médico eso es clave.”_

### 12.7. “¿Qué te faltaría para llevar esto a producción real?”

> _“Para un entorno de producción real agregaría: el módulo de turnos completo con UI, logs de auditoría más finos (quién modificó qué y cuándo), exportación de historias clínicas a PDF, controles de permisos más detallados por rol, tests automatizados y un sistema de backups y monitoreo más formal. Pero para el alcance de este trabajo práctico, el MVP cumple con las funcionalidades básicas que un consultorio necesita.”_

### 12.8. “¿Cómo probaste el sistema?”

> _“Hicimos pruebas manuales de todos los flujos principales: login, logout, cambio de contraseña, configuración y uso de la pregunta secreta, CRUD de pacientes y de consultas, y algunos escenarios de error (campos faltantes, credenciales incorrectas, usuario sin pregunta secreta configurada). La ventaja de tener los endpoints bien separados es que se pueden probar fácilmente con herramientas como Postman o con el mismo frontend.”_

### 12.9. “Si mañana tuvieras que agregar otra funcionalidad, ¿cómo la incorporarías?”

> _“La incorporaría siguiendo la misma estructura que ya tengo: primero escribiría la historia de usuario, luego el diagrama UML del flujo, después agregaría la tabla o columnas necesarias en la base de datos (con una nueva migración), crearía el modelo, el controlador, las rutas y finalmente las pantallas o componentes de frontend. Esa forma de trabajo hace que el código se mantenga ordenado y alineado con las historias de usuario.”_

---

_Este documento es mi guía personal para la defensa oral. La idea es repasarlo antes de la presentación y usarlo como soporte mental para explicar el proyecto de forma clara y ordenada._

