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
    - `turnos.js` (por ahora no usado en el MVP)
  - `controllers/` → lógica de negocio:
    - `authController.js`
    - `pacientesController.js`
    - `consultasController.js`
    - `turnosController.js` (por ahora no usado en el MVP)
  - `models/` → acceso a la base de datos (Active Record con `pg`):
    - `Usuario.js`
    - `Paciente.js`
    - `Consulta.js`
    - `Turno.js` (por ahora no usado en el MVP)
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

## 10. Código clave para mostrar si me lo piden (explicado línea por línea)

### 10.1. Login con bcrypt y cookie-session (`backend/controllers/authController.js`)

```javascript
// 1. Comparar la contraseña ingresada con el hash almacenado
const passwordValido = await bcrypt.compare(password, usuario.password_hash);
```

**Explicación línea por línea:**

- `bcrypt.compare()` es una función que compara una contraseña en texto plano con un hash.
- `password` es la contraseña que el usuario escribió en el login (viene del formulario).
- `usuario.password_hash` es el hash que guardamos en la base de datos cuando el usuario se registró.
- `await` significa que esperamos a que bcrypt termine de comparar (es una operación asíncrona).
- El resultado (`passwordValido`) es `true` si coinciden o `false` si no coinciden.
- **¿Por qué bcrypt?** Porque bcrypt hace la comparación de forma segura; nunca guardamos contraseñas en texto plano.

```javascript
// 2. Si la contraseña no es válida, responder con error 401
if (!passwordValido) {
  return res.status(401).json({ error: 'Credenciales inválidas' });
}
```

**Explicación:**

- `if (!passwordValido)` verifica si la contraseña NO es válida (el `!` significa "no").
- `res.status(401)` establece el código HTTP 401 (No Autorizado).
- `.json({ error: '...' })` envía una respuesta JSON al frontend con un mensaje de error.
- `return` detiene la ejecución de la función; no se ejecuta nada más después de esto.

```javascript
// 3. Crear o asegurar que existe el objeto de sesión
req.session = req.session || {};
```

**Explicación:**

- `req.session` es el objeto donde guardamos los datos de la sesión del usuario.
- `||` es el operador "OR lógico": si `req.session` no existe (es `null` o `undefined`), se crea un objeto vacío `{}`.
- Esto garantiza que siempre tengamos un objeto donde guardar datos.

```javascript
// 4. Guardar el ID del usuario en la sesión (campo directo)
req.session.usuarioId = usuario.id_usuario;
```

**Explicación:**

- Guardamos el `id_usuario` directamente en la sesión.
- `usuario.id_usuario` viene de la base de datos (es el ID único del usuario).
- Esto nos permite saber quién está logueado en próximas peticiones.

```javascript
// 5. Guardar objeto completo del usuario en la sesión
req.session.usuario = {
  id: usuario.id_usuario,
  email: usuario.email,
  nombre: usuario.nombre_completo,
  rol: usuario.rol
};
```

**Explicación:**

- Creamos un objeto con los datos más importantes del usuario.
- `id`: el identificador único (número).
- `email`: el correo electrónico del usuario.
- `nombre`: el nombre completo (para mostrarlo en el frontend).
- `rol`: el rol del usuario (`'doctor'`, `'admin'`, etc.), usado para permisos.
- Este objeto se guarda en la cookie cifrada y estará disponible en todas las peticiones siguientes.

**Flujo completo del login:**

1. Usuario ingresa email y contraseña en `index.html`.
2. Frontend hace `POST /api/auth/login` con esos datos.
3. Backend busca al usuario en la BD por email.
4. Backend compara la contraseña con bcrypt.
5. Si es válida, guarda los datos del usuario en `req.session`.
6. Express crea una cookie cifrada y la envía al navegador.
7. El navegador guarda esa cookie y la envía automáticamente en cada petición.

---

### 10.2. Middleware de autenticación (`backend/middlewares/auth.js`)

```javascript
// Middleware que verifica si el usuario tiene sesión activa
function verificarAuth(req, res, next) {
  // 1. Verificar que exista req.session y que tenga un usuario guardado
  if (req.session && req.session.usuario) {
    // 2. Si existe, continuar con la siguiente función (controlador)
    return next();
  }
  // 3. Si no existe, responder con error 401 y no continuar
  return res.status(401).json({ error: 'No autenticado. Debes iniciar sesión.' });
}
```

**Explicación detallada:**

- **¿Qué es un middleware?** Es una función que se ejecuta ANTES del controlador. Puede decidir si deja continuar o detiene la petición.
- `req` (request): objeto con toda la información de la petición HTTP (headers, body, session, etc.).
- `res` (response): objeto para enviar la respuesta al cliente (JSON, HTML, códigos de estado, etc.).
- `next`: función que le dice a Express "continúa con la siguiente función" (el controlador).

**Línea por línea:**

1. `if (req.session && req.session.usuario)`:
   - `req.session` verifica si existe el objeto de sesión.
   - `&&` es el operador "AND" (ambas condiciones deben ser verdaderas).
   - `req.session.usuario` verifica si dentro de la sesión hay un usuario guardado.
   - Si ambas son verdaderas, el usuario está logueado.

2. `return next()`:
   - Llama a la función `next()`, que le dice a Express que pase al siguiente middleware o controlador.
   - `return` detiene la ejecución de esta función (no se ejecuta el código de abajo).

3. `return res.status(401).json(...)`:
   - Si llegamos aquí, es porque el usuario NO está logueado.
   - Enviamos un error 401 (No Autorizado) con un mensaje en JSON.
   - El frontend recibirá este error y puede redirigir al login.

**¿Cómo se usa este middleware?**

```javascript
// En backend/routes/pacientes.js
router.get('/', verificarAuth, controladorPacientes.obtenerPacientes);
//              ↑ middleware    ↑ controlador
```

Cuando llega una petición a `GET /api/pacientes`:
1. Primero se ejecuta `verificarAuth`.
2. Si el usuario está logueado, se ejecuta `controladorPacientes.obtenerPacientes`.
3. Si NO está logueado, se devuelve error 401 y nunca llega al controlador.

---

### 10.3. Multitenancy en pacientes (`backend/models/Paciente.js`)

```javascript
// Método estático para obtener todos los pacientes de un usuario
static async obtenerTodos(idUsuario) {
  // 1. Definir la consulta SQL con parámetro $1
  const query = `
    SELECT id_paciente, nombre, apellido
    FROM pacientes
    WHERE activo = true AND id_usuario = $1
    ORDER BY apellido, nombre
  `;
  
  // 2. Ejecutar la consulta pasando idUsuario como parámetro
  const { rows } = await conexionBD.query(query, [idUsuario]);
  
  // 3. Devolver las filas obtenidas
  return rows;
}
```

**Explicación línea por línea:**

- `static async obtenerTodos(idUsuario)`:
  - `static` significa que este método pertenece a la clase `Paciente`, no a una instancia.
  - `async` indica que esta función es asíncrona (usa `await` dentro).
  - `obtenerTodos` es el nombre del método.
  - `idUsuario` es el parámetro que recibe: el ID del usuario logueado.

- **Consulta SQL:**
  ```sql
  SELECT id_paciente, nombre, apellido
  FROM pacientes
  WHERE activo = true AND id_usuario = $1
  ORDER BY apellido, nombre
  ```
  - `SELECT id_paciente, nombre, apellido`: selecciona solo esas columnas.
  - `FROM pacientes`: de la tabla `pacientes`.
  - `WHERE activo = true`: solo pacientes activos (no eliminados con soft delete).
  - `AND id_usuario = $1`: **CLAVE DEL MULTITENANCY** - solo pacientes de este usuario.
  - `$1` es un placeholder (marcador de posición) que será reemplazado por `idUsuario`.
  - `ORDER BY apellido, nombre`: ordena alfabéticamente.

- `const { rows } = await conexionBD.query(query, [idUsuario])`:
  - `conexionBD.query()` ejecuta la consulta SQL en PostgreSQL.
  - `query` es el texto de la consulta.
  - `[idUsuario]` es un array con los valores que reemplazan `$1`, `$2`, etc.
  - `await` espera a que la base de datos responda.
  - `{ rows }` usa destructuring para extraer solo la propiedad `rows` del resultado.
  - `rows` es un array con las filas que devolvió la consulta.

- `return rows`:
  - Devuelve el array de pacientes al controlador.

**¿Por qué usar `$1` en lugar de concatenar strings?**

❌ **MAL (vulnerable a SQL injection):**
```javascript
const query = `SELECT * FROM pacientes WHERE id_usuario = ${idUsuario}`;
```

✅ **BIEN (seguro):**
```javascript
const query = `SELECT * FROM pacientes WHERE id_usuario = $1`;
await conexionBD.query(query, [idUsuario]);
```

- Los parámetros (`$1`, `$2`) son escapados automáticamente por la librería `pg`.
- Esto previene ataques de inyección SQL.

---

### 10.4. Hashing de contraseña con bcrypt (`backend/controllers/authController.js`)

```javascript
// Crear hash de contraseña al registrar un usuario
const registro = async (req, res) => {
  // 1. Extraer datos del body de la petición
  const { email, nombre_completo, password, rol } = req.body;
  
  // 2. Generar el hash de la contraseña (10 rounds)
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  
  // 3. Guardar en la base de datos (password_hash, NO password)
  const nuevoUsuario = await Usuario.crear({
    email,
    nombre_completo,
    password_hash,  // ← guardamos el hash, no la contraseña original
    rol: rol || 'doctor'
  });
  
  // 4. Responder con éxito
  res.status(201).json({ 
    mensaje: 'Usuario creado exitosamente',
    id_usuario: nuevoUsuario.id_usuario 
  });
};
```

**Explicación detallada:**

1. **Extracción de datos del body:**
   - `req.body` contiene los datos que envió el frontend en formato JSON.
   - Usamos destructuring (`{ email, nombre_completo, ... }`) para extraer cada campo.

2. **Generación del hash:**
   - `bcrypt.genSalt(10)`:
     - Genera un "salt" (sal), que es una cadena aleatoria.
     - El `10` es el número de "rounds" (vueltas). Cuanto mayor, más seguro pero más lento.
     - `10` es un buen balance (recomendado por la comunidad).
   - `bcrypt.hash(password, salt)`:
     - Combina la contraseña con el salt y genera el hash final.
     - Ejemplo: `password = "Secreta123"` → `hash = "$2b$10$N9qo8uLO..."`
     - Este hash tiene 60 caracteres y es irreversible.

3. **Guardar en la base de datos:**
   - **NUNCA** guardamos `password` (texto plano).
   - Guardamos `password_hash` (el hash generado por bcrypt).
   - Si alguien roba la base de datos, no puede obtener las contraseñas originales.

4. **Respuesta al frontend:**
   - `res.status(201)`: código 201 = "Created" (recurso creado exitosamente).
   - `.json({ ... })`: enviamos un objeto JSON con el resultado.

**¿Qué pasa cuando el usuario se loguea?**
- El frontend envía la contraseña en texto plano (por HTTPS, está cifrada en tránsito).
- El backend busca al usuario y obtiene su `password_hash`.
- Usa `bcrypt.compare(password, password_hash)` para verificar.
- bcrypt aplica el mismo proceso de hashing y compara los resultados.

---

### 10.5. Validación con middleware personalizado (`backend/middlewares/auth.js`)

```javascript
// Middleware para validar que ciertos campos estén presentes
const validarCamposRequeridos = (camposRequeridos) => {
  // 1. Retornar una función middleware (closure)
  return (req, res, next) => {
    // 2. Array para acumular campos faltantes
    const camposFaltantes = [];
    
    // 3. Recorrer cada campo requerido
    for (const campo of camposRequeridos) {
      // 4. Verificar si el campo existe y no está vacío
      if (!req.body[campo] || req.body[campo].toString().trim() === '') {
        camposFaltantes.push(campo);
      }
    }
    
    // 5. Si hay campos faltantes, responder con error 400
    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`
      });
    }
    
    // 6. Si todo está bien, continuar
    next();
  };
};
```

**Explicación detallada:**

1. **Función de orden superior (higher-order function):**
   - `validarCamposRequeridos` es una función que RETORNA otra función.
   - Esto se llama "closure" o función de fábrica.
   - Permite crear middlewares configurables.

2. **Array de campos faltantes:**
   - `const camposFaltantes = []`: creamos un array vacío.
   - Aquí guardaremos los nombres de los campos que faltan.

3. **Bucle `for...of`:**
   - `for (const campo of camposRequeridos)`: itera sobre cada campo requerido.
   - `campo` es el nombre del campo (string), por ejemplo: `'email'`, `'password'`.

4. **Verificación de cada campo:**
   - `!req.body[campo]`: verifica si el campo NO existe o es `null`/`undefined`.
   - `||` (OR): si pasa la primera condición, pasa a la segunda.
   - `.toString().trim() === ''`: convierte el valor a string, elimina espacios, y verifica si está vacío.
   - Si cualquiera de estas condiciones es verdadera, el campo está mal.

5. **Respuesta de error:**
   - `res.status(400)`: código 400 = "Bad Request" (petición mal formada).
   - `.join(', ')`: convierte el array en string separado por comas.
   - Ejemplo: `['email', 'password']` → `"email, password"`.

6. **Continuar si todo está bien:**
   - `next()`: pasa al siguiente middleware o controlador.

**Ejemplo de uso:**

```javascript
// En backend/routes/auth.js
router.post('/login', 
  validarCamposRequeridos(['email', 'password']),
  authController.login
);
```

Si el frontend envía `{ email: "doc@mail.com" }` (falta `password`):
- El middleware responde con error 400: `"Campos requeridos faltantes: password"`.
- Nunca llega al controlador `authController.login`.

---

### 10.6. Consulta SQL con JOIN (`backend/models/Consulta.js`)

```javascript
// Obtener consultas con datos del paciente (JOIN)
static async obtenerTodas(idUsuario) {
  const query = `
    SELECT 
      c.id_consulta,
      c.fecha,
      c.motivo_consulta,
      c.diagnostico,
      c.tratamiento,
      p.nombre,
      p.apellido,
      p.dni
    FROM consultas c
    INNER JOIN pacientes p ON c.id_paciente = p.id_paciente
    WHERE c.id_usuario = $1
    ORDER BY c.fecha DESC
  `;
  
  const { rows } = await conexionBD.query(query, [idUsuario]);
  return rows;
}
```

**Explicación línea por línea:**

- **SELECT con columnas específicas:**
  - `c.id_consulta`: el ID de la consulta (tabla `consultas`).
  - `c.fecha`, `c.motivo_consulta`, etc.: más campos de la consulta.
  - `p.nombre`, `p.apellido`, `p.dni`: campos del paciente (tabla `pacientes`).

- **FROM consultas c:**
  - `consultas` es el nombre de la tabla.
  - `c` es un alias (abreviatura) para referirnos a esa tabla.

- **INNER JOIN pacientes p ON c.id_paciente = p.id_paciente:**
  - `INNER JOIN` combina filas de dos tablas cuando coincide la condición.
  - `pacientes p`: tabla `pacientes` con alias `p`.
  - `ON c.id_paciente = p.id_paciente`: condición de unión (foreign key).
  - Esto significa: "trae solo las consultas que tengan un paciente asociado".

- **WHERE c.id_usuario = $1:**
  - Filtra por usuario (multitenancy).
  - Solo trae consultas del usuario logueado.

- **ORDER BY c.fecha DESC:**
  - Ordena por fecha de forma descendente (más reciente primero).

**¿Qué devuelve esta consulta?**

Un array de objetos como este:
```javascript
[
  {
    id_consulta: 15,
    fecha: '2025-11-10',
    motivo_consulta: 'Control de rutina',
    diagnostico: 'Paciente estable',
    tratamiento: 'Continuar con medicación',
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '12345678'
  },
  // ... más consultas
]
```

- Cada objeto tiene campos de AMBAS tablas (`consultas` y `pacientes`).
- El frontend puede mostrar "Juan Pérez - Control de rutina" sin hacer otra petición.

---

### 10.7. Manejo de errores con try-catch (`backend/controllers/pacientesController.js`)

```javascript
// Crear un paciente con manejo completo de errores
const crearPaciente = async (req, res) => {
  try {
    // 1. Obtener ID del usuario logueado desde la sesión
    const idUsuario = req.session.usuario.id;
    
    // 2. Extraer datos del body
    const { nombre, apellido, dni, fecha_nacimiento, ...otrosDatos } = req.body;
    
    // 3. Validaciones básicas
    if (!nombre || !apellido) {
      return res.status(400).json({ 
        error: 'Nombre y apellido son obligatorios' 
      });
    }
    
    // 4. Verificar si el DNI ya existe (para este usuario)
    if (dni) {
      const existente = await Paciente.buscarPorDni(dni, idUsuario);
      if (existente) {
        return res.status(409).json({ 
          error: 'Ya existe un paciente con ese DNI' 
        });
      }
    }
    
    // 5. Crear el paciente en la base de datos
    const nuevoPaciente = await Paciente.crear({
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      ...otrosDatos
    }, idUsuario);
    
    // 6. Responder con éxito
    res.status(201).json({
      mensaje: 'Paciente creado exitosamente',
      id_paciente: nuevoPaciente.id_paciente
    });
    
  } catch (error) {
    // 7. Capturar cualquier error no previsto
    console.error('Error al crear paciente:', error);
    
    // 8. Manejar error específico de violación de UNIQUE constraint
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'DNI duplicado' 
      });
    }
    
    // 9. Error genérico para otros casos
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: error.message 
    });
  }
};
```

**Explicación detallada:**

1. **Obtener ID del usuario:**
   - `req.session.usuario.id`: accedemos al ID del usuario logueado.
   - Esto solo funciona porque el middleware `verificarAuth` ya verificó que hay sesión.

2. **Destructuring con rest operator:**
   - `const { nombre, apellido, dni, ...otrosDatos } = req.body`:
   - Extraemos `nombre`, `apellido`, `dni` explícitamente.
   - `...otrosDatos` captura TODOS los demás campos en un objeto.
   - Ejemplo: si `req.body = { nombre: 'Juan', apellido: 'Pérez', telefono: '123' }`:
     - `nombre = 'Juan'`
     - `apellido = 'Pérez'`
     - `otrosDatos = { telefono: '123' }`

3. **Validación manual:**
   - Verificamos que `nombre` y `apellido` existan.
   - Si faltan, respondemos con error 400 (Bad Request) y detenemos la ejecución.

4. **Verificación de DNI duplicado:**
   - Solo si el DNI fue enviado (puede ser opcional).
   - `Paciente.buscarPorDni()` hace una consulta a la BD.
   - Si ya existe un paciente con ese DNI (para este usuario), respondemos con error 409 (Conflict).

5. **Creación del paciente:**
   - `Paciente.crear()` ejecuta un `INSERT` en la base de datos.
   - Pasamos todos los datos y el `idUsuario` (para multitenancy).

6. **Respuesta exitosa:**
   - Código 201 (Created).
   - Devolvemos el ID del nuevo paciente.

7. **Bloque catch:**
   - Captura CUALQUIER error que ocurra en el bloque `try`.
   - `console.error()`: imprime el error en la consola del servidor (útil para debugging).

8. **Error específico de PostgreSQL:**
   - `error.code === '23505'`: código de violación de UNIQUE constraint.
   - Esto pasa si hay un índice UNIQUE en `dni` y tratamos de insertar uno duplicado.

9. **Error genérico:**
   - Para cualquier otro error, respondemos con código 500 (Internal Server Error).
   - `error.message`: mensaje descriptivo del error.

**¿Por qué usar try-catch?**
- Sin try-catch, si hay un error, el servidor crashea o responde con un error feo.
- Con try-catch, capturamos el error y enviamos una respuesta controlada al frontend.

---

### 10.8. Conexión a PostgreSQL con pool (`backend/db/connection.js`)

```javascript
// Importar librería pg (PostgreSQL client)
const { Pool } = require('pg');

// 1. Crear pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NO_SSL === 'true' ? false : { rejectUnauthorized: false }
});

// 2. Evento cuando se conecta un cliente
pool.on('connect', () => {
  console.log('✓ Conectado a PostgreSQL');
});

// 3. Evento cuando hay un error de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
  process.exit(-1);  // Terminar el proceso
});

// 4. Exportar el pool para usarlo en los modelos
module.exports = pool;
```

**Explicación línea por línea:**

1. **Pool de conexiones:**
   - `new Pool({ ... })`: crea un "pool" (conjunto) de conexiones a la base de datos.
   - **¿Por qué pool y no una sola conexión?**
     - Varias peticiones pueden llegar al mismo tiempo.
     - El pool maneja múltiples conexiones y las reutiliza.
     - Es más eficiente que crear una conexión nueva en cada petición.
   
   - `connectionString: process.env.DATABASE_URL`:
     - Lee la URL de conexión desde una variable de entorno.
     - Ejemplo: `postgres://usuario:password@host:5432/dbname?sslmode=require`
     - `process.env` es un objeto con las variables de entorno del sistema.
   
   - `ssl: ... ? false : { rejectUnauthorized: false }`:
     - Configuración de SSL (conexión cifrada).
     - Si `NO_SSL` es `'true'`, desactiva SSL (para desarrollo local).
     - Si no, activa SSL pero no verifica el certificado (necesario para Neon y otros servicios).

2. **Evento 'connect':**
   - `pool.on('connect', callback)`: registra un listener para el evento 'connect'.
   - Se ejecuta cada vez que el pool establece una nueva conexión.
   - `console.log()`: imprime un mensaje en la consola del servidor.

3. **Evento 'error':**
   - `pool.on('error', callback)`: registra un listener para errores.
   - Se ejecuta si hay un problema con alguna conexión del pool.
   - `process.exit(-1)`: termina el proceso Node.js con código de error.
   - **¿Por qué terminar el proceso?** Porque si perdemos la conexión a la BD, el servidor no puede funcionar.

4. **Exportar el pool:**
   - `module.exports = pool`: hace que `pool` esté disponible en otros archivos.
   - Los modelos importan este pool: `const pool = require('../db/connection')`.

**Uso en los modelos:**

```javascript
// En backend/models/Paciente.js
const pool = require('../db/connection');

static async obtenerTodos(idUsuario) {
  const query = `SELECT * FROM pacientes WHERE id_usuario = $1`;
  const { rows } = await pool.query(query, [idUsuario]);
  return rows;
}
```

---

### 10.9. Recuperación de contraseña con pregunta secreta (`backend/controllers/authController.js`)

```javascript
// Paso 1: Obtener la pregunta secreta de un usuario
const obtenerPreguntaSecreta = async (req, res) => {
  try {
    // 1. Extraer email del body
    const { email } = req.body;
    
    // 2. Buscar usuario por email
    const usuario = await Usuario.buscarPorEmail(email);
    
    // 3. Verificar que el usuario existe
    if (!usuario) {
      return res.status(404).json({ 
        error: 'No se encontró un usuario con ese email' 
      });
    }
    
    // 4. Verificar que tenga pregunta secreta configurada
    if (!usuario.pregunta_secreta) {
      return res.status(404).json({ 
        error: 'Este usuario no tiene pregunta secreta configurada' 
      });
    }
    
    // 5. Devolver SOLO la pregunta (NO la respuesta)
    res.json({ pregunta: usuario.pregunta_secreta });
    
  } catch (error) {
    console.error('Error al obtener pregunta secreta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Paso 2: Recuperar contraseña verificando la respuesta
const recuperarConPreguntaSecreta = async (req, res) => {
  try {
    // 1. Extraer datos del body
    const { email, respuesta, nueva_password } = req.body;
    
    // 2. Buscar usuario
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario || !usuario.respuesta_secreta_hash) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // 3. Normalizar la respuesta (lowercase, sin espacios extras)
    const respuestaNormalizada = respuesta.toLowerCase().trim();
    
    // 4. Comparar respuesta con el hash guardado
    const respuestaValida = await bcrypt.compare(
      respuestaNormalizada, 
      usuario.respuesta_secreta_hash
    );
    
    // 5. Si la respuesta no es válida, rechazar
    if (!respuestaValida) {
      return res.status(401).json({ 
        error: 'Respuesta incorrecta' 
      });
    }
    
    // 6. Generar hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const nuevo_password_hash = await bcrypt.hash(nueva_password, salt);
    
    // 7. Actualizar contraseña en la base de datos
    await Usuario.actualizarPassword(usuario.id_usuario, nuevo_password_hash);
    
    // 8. Responder con éxito
    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
    
  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
```

**Explicación detallada:**

**Paso 1: Obtener pregunta**

- Por seguridad, NUNCA devolvemos la respuesta, solo la pregunta.
- El usuario debe recordar o adivinar la respuesta.

**Paso 2: Verificar respuesta y cambiar contraseña**

3. **Normalización de respuesta:**
   - `.toLowerCase()`: convierte a minúsculas ("Madrid" → "madrid").
   - `.trim()`: elimina espacios al inicio y final (" madrid " → "madrid").
   - **¿Por qué normalizar?** Para evitar problemas con mayúsculas o espacios accidentales.

4. **Comparación con bcrypt:**
   - `bcrypt.compare(respuestaNormalizada, usuario.respuesta_secreta_hash)`:
   - Similar a como verificamos contraseñas.
   - La respuesta se guardó hasheada cuando el usuario la configuró.

5. **Rechazo si la respuesta es incorrecta:**
   - Código 401 (No Autorizado).
   - No damos pistas sobre qué está mal (seguridad).

6. **Hash de la nueva contraseña:**
   - Igual que en el registro: `genSalt()` + `hash()`.
   - Nunca guardamos la contraseña en texto plano.

7. **Actualizar en la BD:**
   - `Usuario.actualizarPassword()` ejecuta un `UPDATE` en la tabla `usuarios`.
   - Cambia el `password_hash` por el nuevo.

8. **Respuesta exitosa:**
   - El usuario puede loguearse con su nueva contraseña.

**Flujo completo:**

1. Usuario en `recuperar.html` ingresa su email.
2. Frontend hace `POST /api/auth/pregunta-secreta/obtener`.
3. Backend devuelve la pregunta: `{ pregunta: "¿Tu primera mascota?" }`.
4. Frontend muestra la pregunta al usuario.
5. Usuario responde y propone nueva contraseña.
6. Frontend hace `POST /api/auth/recuperar` con email, respuesta y nueva contraseña.
7. Backend verifica respuesta con bcrypt.
8. Si es correcta, actualiza el `password_hash`.
9. Usuario puede loguearse con la nueva contraseña.

---

Con estos ejemplos detallados línea por línea puedo mostrar rápidamente cómo funcionan las partes críticas del código y responder preguntas técnicas en la defensa.

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

