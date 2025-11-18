ÉPICA 1 — Gestión de Autenticación y Usuarios

1.1 Login de usuario (Front y Back)
ID: 1.1
Nombre: Login de usuario
Descripción: Como doctor, quiero iniciar sesión en el sistema para acceder a las funcionalidades según mi rol.
MVP: Sí
Criterios de Aceptación:
Valida credenciales contra la base de datos.
En caso de error, muestra “Usuario o contraseña incorrectos”.
Crea una sesión del lado del servidor y establece cookie de sesión; los endpoints requieren sesión válida.
Redirige a inicio.html tras el login.
1.2 Recuperar contraseña (Back + Front)
ID: 1.2
Nombre: Recuperación de contraseña por pregunta secreta
Descripción: Como usuario, quiero restablecer mi contraseña para recuperar el acceso en caso de olvido.
MVP: Sí
Criterios de Aceptación:
Paso 1: ingreso de email devuelve la pregunta secreta configurada.
Paso 2: validación de respuesta y definición de nueva contraseña.
Mensaje de éxito y redirección al login.
Sin envío de email ni tokens temporales (flujo actual basado en pregunta secreta).
1.3 Crear nuevo usuario (Admin en Configuración)
ID: 1.3
Nombre: Alta de usuario por administrador
Descripción: Como administrador, quiero registrar un nuevo usuario para permitir que un profesional acceda.
MVP: Sí
Criterios de Aceptación:
Solo rol admin puede crear usuarios desde configuracion.html (sección Admin).
Campos: nombre, email, rol, contraseña; contraseña almacenada con hash.
No se permiten emails duplicados.
Confirma el registro exitoso.



1.4 Cerrar sesión (Front y Back)
ID: 1.4
Nombre: Cerrar sesión
Descripción: Como usuario, quiero cerrar mi sesión para asegurar la confidencialidad de los datos.
MVP: Sí
Criterios de Aceptación:
Invalida la sesión en el servidor y elimina la cookie.
Redirige a index.html (login).
No se puede acceder a páginas protegidas con botón “Atrás” gracias a verificación de sesión.

ÉPICA 2 — Gestión de Pacientes e Historias Clínicas

2.1 Crear paciente (Front y Back)
ID: 2.1
Nombre: Alta de paciente
Descripción: Como doctor, quiero registrar un nuevo paciente para almacenar su historia clínica digital.
MVP: Sí
Criterios de Aceptación:
Valida campos obligatorios (nombre y apellido como mínimo en MVP).
Verifica unicidad de DNI si se informa.
	Crea el registro del paciente asociado al usuario autenticado (aislamiento por `id_usuario`).
2.2 Editar paciente (Front y Back)
ID: 2.2
Nombre: Edición de paciente
Descripción: Como doctor, quiero modificar datos del paciente para mantener su información actualizada.
MVP: Sí
Criterios de Aceptación:
Persiste cambios en la base de datos.
Actualiza marca temporal de modificación.
Validaciones básicas (DNI y email con formato válido si se informan).







2.3 Eliminar paciente (Back)
ID: 2.3
Nombre: Eliminación de paciente
Descripción: Como doctor, quiero eliminar un paciente para mantener limpia la base de datos.
MVP: Sí
Criterios de Aceptación:
Requiere confirmación previa en la UI.
Elimina paciente del usuario autenticado; las consultas asociadas se eliminan en cascada (criterio actualizado; ya no se bloquea por tener consultas).
2.4 Buscar paciente (Front + Back)
ID: 2.4
Nombre: Búsqueda de paciente
Descripción: Como doctor, quiero buscar un paciente por nombre o DNI para acceder rápidamente a su perfil.
MVP: Sí
Criterios de Aceptación:
Permite búsqueda parcial vía /api/pacientes?buscar=... con debounce en UI.
Retorna lista de coincidencias paginada en el cliente.
Al seleccionar, abre perfil_paciente.html en nueva pestaña.
ÉPICA 3 — Gestión de Consultas Médicas

3.1 Crear consulta (Front y Back)
ID: 3.1
Nombre: Alta de consulta
Descripción: Como doctor, quiero registrar una nueva consulta médica para documentar la atención del paciente.
MVP: Sí
Criterios de Aceptación:
Guarda: fecha, motivo, informe, diagnóstico, tratamiento y estudios.
Se asocia al paciente y al usuario autenticado automáticamente.
Validación mínima: motivo e id_paciente requeridos.







3.2 Editar consulta (Back + Front)
ID: 3.2
Nombre: Edición de consulta
Descripción: Como doctor, quiero actualizar una consulta registrada para corregir o ampliar información.
MVP: Sí
Criterios de Aceptación:
Solo el propietario (usuario autenticado dueño del registro) puede modificarla.
Registra la fecha de modificación.
3.3 Eliminar consulta (Back)
ID: 3.3
Nombre: Eliminación de consulta
Descripción: Como doctor, quiero eliminar una consulta para depurar registros duplicados o erróneos.
MVP: Sí
Criterios de Aceptación:
Requiere confirmación en UI.
Elimina si pertenece al usuario autenticado.
3.4 Visualizar consulta (Front)
ID: 3.4
Nombre: Visualización de consulta
Descripción: Como doctor, quiero acceder al detalle de una consulta para revisar la información registrada.
MVP: Sí
Criterios de Aceptación:
Muestra los datos de la consulta en modo lectura/edición controlada.
Acceso desde listado o desde el perfil del paciente.
3.5 Adjuntar archivos o imágenes (Back y Front)
ID: 3.5
Nombre: Adjuntos en consulta
Descripción: Como doctor, quiero subir archivos de estudios e imágenes para tener registros completos.
MVP: No
Criterios de Aceptación (Futuro):
Aceptar JPG, PNG y PDF.
Validar tamaño máximo antes de guardar.
Asociar archivos a la consulta.

ÉPICA 4 — Gestión de Turnos del Día

4.1 Visualizar turnos del día (Front y Back)
ID: 4.1
Nombre: Turnos del día — listado
Descripción: Como doctor, quiero ver los pacientes del día para organizar las consultas.
MVP: No (no aparece en la web actual)
Criterios de Aceptación (Futuro):
Estados: “en_espera”, “atendido”, “ausente”, “cancelado”.
Actualización de estado manual.
Acceso directo al perfil del paciente.
4.2 Crear turno del día (Back)
ID: 4.2
Nombre: Alta de turno del día
Descripción: Como doctor, quiero registrar un nuevo turno del día para incluir pacientes no agendados.
MVP: No
Criterios de Aceptación (Futuro):
Vincular a paciente existente o datos temporales.
Definir fecha, hora y estado inicial.
4.3 Editar turno del día (Back)
ID: 4.3
Nombre: Edición de turno del día
Descripción: Como doctor, quiero modificar un turno existente para corregir horario o estado.
MVP: No
Criterios de Aceptación (Futuro):
Editable si no fue atendido.
Refresca la vista del día.
4.4 Eliminar turno del día (Back)
ID: 4.4
Nombre: Eliminación de turno del día
Descripción: Como doctor, quiero eliminar un turno para mantener actualizada la agenda.
MVP: No
Criterios de Aceptación (Futuro):
Confirmación previa.
Actualiza lista visible.
4.5 Recordatorios de turnos (Back)
ID: 4.5
Nombre: Recordatorios de turnos
Descripción: Como doctor, quiero enviar recordatorios de turnos a los pacientes para reducir ausencias.
MVP: No
Criterios de Aceptación (Futuro):
Envío configurable (email/SMS/WhatsApp) y anticipación (24/48 hs).
Plantilla de mensaje con fecha/hora/ubicación.
Registro de intentos y estado del recordatorio.
ÉPICA 5 — Back End / API / Persistencia

5.1 Implementar estructura base de API
ID: 5.1
Nombre: API RESTful base
Descripción: Como desarrollador, quiero exponer endpoints seguros para el sistema.
MVP: Sí
Criterios de Aceptación:
Rutas separadas por entidad (usuarios, pacientes, consultas, turnos).
Respuestas JSON y manejo de errores con códigos HTTP adecuados.
5.2 Conexión a base de datos
ID: 5.2
Nombre: Conexión a PostgreSQL
Descripción: Como desarrollador, quiero establecer la conexión con la base de datos para persistir datos.
MVP: Sí
Criterios de Aceptación:
Manejo de credenciales vía variables de entorno.
Reintentos y manejo de errores básicos.
Configuración centralizada en backend/db/connection.js.
5.3 Autenticación por sesión (actualización)
ID: 5.3
Nombre: Autenticación basada en sesión (cookies)
Descripción: Como desarrollador, quiero proteger endpoints mediante sesión de usuario.
MVP: Sí
Criterios de Aceptación:
Inicio de sesión crea sesión en servidor y cookie en el cliente.
Middleware valida sesión para rutas protegidas.
Logout invalida la sesión.
5.4 Validación de roles y multitenancy
ID: 5.4
Nombre: Autorización por rol y aislamiento por usuario
Descripción: Como desarrollador, quiero controlar acceso por rol y aislar datos por usuario para seguridad.
MVP: Sí
Criterios de Aceptación:
Middlewares de admin y doctor activos.
Los listados y acciones filtran por id_usuario propietario.
5.5 Generación de PDF
ID: 5.5
Nombre: Exportación a PDF
Descripción: Como desarrollador, quiero generar informes PDF de historias clínicas.
MVP: No
Criterios de Aceptación (Futuro):
PDF con datos de paciente y consultas.
Descarga o envío por email; registro de auditoría opcional.
5.6 Pruebas del Back End
ID: 5.6
Nombre: Pruebas unitarias e integración
Descripción: Como desarrollador, quiero tener pruebas para garantizar el correcto funcionamiento.
MVP: Sí
Criterios de Aceptación:
Pruebas para login, pacientes, consultas y multitenancy (tests existentes).
Pasan localmente antes del despliegue.
ÉPICA 6 — Front End / Interfaz y Navegación

6.1 Página de login
ID: 6.1
Nombre: Pantalla de inicio de sesión
Descripción: Como usuario, quiero acceder a una pantalla de inicio de sesión para ingresar al sistema.
MVP: Sí
Criterios de Aceptación:
Validación de campos vacíos y mensajes de error visibles.
Botón “Ingresar” autentica contra backend y crea sesión.
Link “¿Olvidaste tu contraseña?” hacia recuperar.html.
6.2 Pantalla de inicio (búsqueda rápida)
ID: 6.2
Nombre: Inicio (búsqueda rápida)
Descripción: Como doctor, quiero una pantalla inicial con buscador para acceder rápidamente a pacientes y secciones.
MVP: Sí
Criterios de Aceptación:
Menú de navegación y diseño responsivo.
Modal de búsqueda rápida de pacientes con debounce.
Sin métricas ni listado de turnos del día en el MVP.
6.3 Lista de pacientes
ID: 6.3
Nombre: Listado de pacientes
Descripción: Como doctor, quiero visualizar pacientes para acceder a su historial.
MVP: Sí
Criterios de Aceptación:
Tabla con Nombre, Apellido, DNI, Teléfono, Cobertura y Acciones.
Búsqueda parcial y paginación en cliente.
Datos obtenidos desde /api/pacientes (no JSON local).
6.4 Interfaz de registro (Nuevo usuario)
ID: 6.4
Nombre: Registro público de usuario
Descripción: Como nuevo usuario, quiero registrarme mediante un formulario.
MVP: No (reemplazado por alta de admin en Configuración)
Criterios de Aceptación (Futuro):
Form con nombre, email, contraseña, confirmación y pregunta/respuesta secreta.
Validaciones y redirección al login.
6.5 Historia clínica del paciente
ID: 6.5
Nombre: Perfil del paciente e historial
Descripción: Como doctor, quiero ver la historia clínica completa para acceder a todas sus consultas.
MVP: Sí
Criterios de Aceptación:
Encabezado con datos del paciente y edad calculada.
Lista de consultas ordenadas con acceso a detalle.
Botón para crear nueva consulta (abre consulta.html en modo creación).

6.6 Formulario de nueva consulta
ID: 6.6
Nombre: Crear/editar consulta
Descripción: Como doctor, quiero registrar o editar una consulta para documentar la atención.
MVP: Sí
Criterios de Aceptación:
Campos: Motivo (requerido), Informe, Diagnóstico, Tratamiento, Estudios, Fecha.
Asociar a un paciente (selector desde modal o prellenado desde perfil).
Guardado vía API; feedback de éxito/error.
6.7 Página de turnos del día
ID: 6.7
Nombre: Gestión de turnos del día (UI)
Descripción: Como doctor o secretario, quiero ver la lista de pacientes del día.
MVP: No
Criterios de Aceptación (Futuro):
Tabla con estados actualizables y acceso a perfil.
6.8 Exportar historia clínica a PDF
ID: 6.8
Nombre: Exportar a PDF
Descripción: Como doctor, quiero generar PDF imprimible para guardar o entregar.
MVP: No
Criterios de Aceptación (Futuro):
Botón “Exportar PDF” y descarga del archivo.
6.9 Diseño visual general
ID: 6.9
Nombre: Diseño y estilos
Descripción: Como usuario, quiero un diseño claro y profesional para facilitar la lectura.
MVP: Sí
Criterios de Aceptación:
Paleta consistente y tipografía legible.
Layout con Flexbox/Grid y UI responsiva.






6.10 Navegación entre pantallas
ID: 6.10
Nombre: Navegación entre páginas
Descripción: Como usuario, quiero moverme entre secciones de forma fluida.
MVP: Sí
Criterios de Aceptación (Actualizado):
Navegación entre páginas HTML (no SPA).
Enlaces activos se resaltan; botones “Inicio”/“Atrás”.
6.11 Interfaz de recuperación de contraseña
ID: 6.11
Nombre: UI de recuperación por pregunta secreta
Descripción: Como usuario registrado, quiero recuperar mi contraseña si la olvidé.
MVP: Sí
Criterios de Aceptación:
Paso 1 (email) → muestra pregunta secreta.
Paso 2 → valida respuesta y permite nueva contraseña.
Mensaje final y redirección a login.
6.12 Interfaz de configuración de cuenta
ID: 6.12
Nombre: Configuración de cuenta y seguridad
Descripción: Como doctor, quiero modificar mis datos personales y de seguridad.
MVP: Sí
Criterios de Aceptación:
Perfil (nombre/email), cambio de contraseña y pregunta secreta.
Sección Admin: alta de usuario (solo rol admin).
Épica 7 - Diseño y Configuración de la Base de Datos PostgreSQL

7.1 Configurar entorno de base de datos
ID: 7.1
Nombre: Instalación y conexión
Descripción: Como desarrollador, quiero instalar y configurar PostgreSQL para almacenar datos persistentes.
MVP: Sí
Criterios de Aceptación:
Base de datos creada y conexión validada desde backend.
Credenciales en .env.



7.2 Crear estructura base de tablas
ID: 7.2
Nombre: Tablas principales
Descripción: Como desarrollador, quiero definir tablas de usuario, paciente, consulta y turno.
MVP: Sí
Criterios de Aceptación:
Tablas creadas con tipos adecuados y claves primarias.
Relaciones y claves foráneas aplicadas.
7.3 Definir relaciones entre entidades
ID: 7.3
Nombre: Relaciones e índices
Descripción: Como desarrollador, quiero establecer relaciones para mantener integridad referencial.
MVP: Sí
Criterios de Aceptación:
1:N Paciente→Consultas, 1:N Paciente→Turnos.
Índices sobre DNI, fechas y claves foráneas.
7.4 Tabla de situaciones de turno (normalización)
ID: 7.4
Nombre: Catálogo de estados de turnos
Descripción: Como desarrollador, quiero una tabla situaciones_turno para estados.
MVP: No (hoy se usa CHECK en turnos.situacion)
Criterios de Aceptación (Futuro):
Tabla catálogo y FK desde turnos.
7.5 Restricciones y validaciones
ID: 7.5
Nombre: Integridad de datos
Descripción: Como desarrollador, quiero aplicar restricciones y validaciones a nivel DB.
MVP: Sí
Criterios de Aceptación:
NOT NULL en obligatorios, UNIQUE en DNI/email.
Checks de dominio (sexo, situación de turno) y fechas válidas.





7.6 Población inicial de datos (seeds)
ID: 7.6
Nombre: Seeds de prueba
Descripción: Como desarrollador, quiero insertar registros de prueba para integración.
MVP: Sí
Criterios de Aceptación:
Usuarios y pacientes de ejemplo; consultas asociadas.
7.7 Scripts SQL versionados / migraciones
ID: 7.7
Nombre: Versionado del esquema
Descripción: Como desarrollador, quiero versionar cambios de esquema con migraciones.
MVP: Sí
Criterios de Aceptación:
	Migraciones por fecha en database/migrations (multitenancy por `id_usuario`, sesión, pregunta secreta).
7.8 ERD documentado
ID: 7.8
Nombre: Diagrama entidad-relación
Descripción: Como desarrollador, quiero visualizar las relaciones entre tablas.
MVP: No (pendiente generar imagen/archivo ERD en /docs)



TOTAL DE HISTORIAS DE USUARIOS
ÉPICA 1 — Gestión de Autenticación y Usuarios: 4 historias (1.1 a 1.4)
ÉPICA 2 — Gestión de Pacientes e Historias Clínicas: 4 historias (2.1 a 2.4)
ÉPICA 3 — Gestión de Consultas Médicas: 5 historias (3.1 a 3.5)
ÉPICA 4 — Gestión de Turnos del Día: 5 historias (4.1 a 4.5)
ÉPICA 5 — Back End / API / Persistencia: 6 historias (5.1 a 5.6)
ÉPICA 6 — Front End / Interfaz y Navegación: 12 historias (6.1 a 6.12)
ÉPICA 7 — Diseño y Configuración de la Base de Datos PostgreSQL: 8 historias (7.1 a 7.8)
Total: 44 historias de usuario.

Hay un total de 32 historias de usuario marcadas como MVP (Producto Mínimo Viable).

