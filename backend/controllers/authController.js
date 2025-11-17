const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// * Controlador de Autenticación *
// Este archivo maneja todo lo relacionado con usuarios:
// - Login/Logout: verifico email y contraseña, creo sesión con cookies
// - Registro: solo los admin pueden crear nuevos usuarios
// - Perfil: ver y editar datos del usuario logueado
// - Recuperación de contraseña: usando pregunta secreta que configura cada usuario
//
// NOTAS IMPORTANTES:
// - Las contraseñas siempre se guardan con bcrypt (hash seguro)
// - Las sesiones usan cookie-session (compatible con Vercel serverless)
// - Cada usuario solo ve sus propios datos (multitenancy por id_usuario)

const authController = {
  // ** LOGIN: Iniciar sesión **
  // Recibe: { email, password, remember }
  // Retorna: datos del usuario + crea sesión con cookie
  //
  // Flujo:
  // 1. Verifico que vengan email y contraseña
  // 2. Busco el usuario en la BD por email
  // 3. Comparo la contraseña con bcrypt (nunca guardo contraseñas en texto plano)
  // 4. Si todo ok, creo la sesión con cookie-session
  // 5. Si el usuario marcó "Recordarme", la cookie dura 30 días
  login: async (req, res) => {
    try {
      const { email, password, remember } = req.body;

      // Validar que vengan los datos requeridos
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      // Buscar el usuario en la base de datos
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar que la contraseña sea correcta
      // bcrypt.compare compara el texto plano con el hash guardado
      const passwordValido = await bcrypt.compare(password, usuario.password_hash);
      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Crear la sesión (cookie-session guarda todo en la cookie, no en memoria)
      req.session = req.session || {};
      req.session.usuarioId = usuario.id_usuario;
      req.session.usuario = {
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre_completo,
        rol: usuario.rol
      };

      // Si marcó "Recordarme", la sesión dura 30 días
      // Si no, dura hasta que cierre el navegador
      if (remember) {
        const dias30 = 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos
        if (req.sessionOptions) req.sessionOptions.maxAge = dias30;
      } else {
        if (req.sessionOptions) req.sessionOptions.maxAge = undefined;
      }

      // Enviar respuesta exitosa con los datos del usuario
      res.json({
        mensaje: 'Login exitoso',
        usuario: {
          id: usuario.id_usuario,
          email: usuario.email,
          nombre: usuario.nombre_completo,
          rol: usuario.rol
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  // ** LOGOUT: Cerrar sesión **
  // Simplemente borro la cookie de sesión
  // cookie-session: al setear req.session = null, la cookie se borra
  logout: (req, res) => {
    try {
      req.session = null; // Esto borra la cookie
      res.json({ mensaje: 'Sesión cerrada exitosamente' });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({ error: 'Error al cerrar sesión' });
    }
  },

  // ** VERIFICAR SESIÓN **
  // Chequeo si hay un usuario logueado
  // Usado por el frontend para saber si mostrar login o contenido
  verificarSesion: (req, res) => {
    if (req.session.usuario) {
      // Hay sesión activa, devuelvo los datos del usuario
      res.json({ 
        autenticado: true, 
        usuario: req.session.usuario 
      });
    } else {
      // No hay sesión
      res.json({ autenticado: false });
    }
  },

  // ** REGISTRO: Crear nuevo usuario (solo admin) **
  // Recibe: { email, nombre_completo, password, rol }
  // IMPORTANTE: solo los administradores pueden crear usuarios nuevos
  //
  // Flujo:
  // 1. Verifico que el email no exista
  // 2. Hasheo la contraseña con bcrypt (10 rondas = seguro y rápido)
  // 3. Guardo en la BD
  registro: async (req, res) => {
    try {
      const { email, nombre_completo, password, rol } = req.body;

      // Validar campos requeridos
      if (!email || !nombre_completo || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      // Verificar si el email ya está registrado
      const usuarioExistente = await Usuario.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }

      // Crear el hash de la contraseña (bcrypt con 10 rondas es el estándar)
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Crear el usuario en la base de datos
      const nuevoUsuario = await Usuario.crear(email, nombre_completo, passwordHash, rol);

      // Responder con éxito
      res.status(201).json({
        mensaje: 'Usuario creado exitosamente',
        usuario: {
          id: nuevoUsuario.id_usuario,
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre_completo,
          rol: nuevoUsuario.rol
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },
};

// ** CONFIGURAR PREGUNTA SECRETA **
// El usuario configura su pregunta y respuesta secreta para poder recuperar su contraseña
// Recibe: { pregunta, respuesta }
// IMPORTANTE: la respuesta se guarda hasheada, igual que la contraseña
authController.configurarPreguntaSecreta = async (req, res) => {
  try {
    const idUsuario = req.session?.usuario?.id;
    if (!idUsuario) {
      return res.status(401).json({ error: 'Debes estar logueado' });
    }

    const { pregunta, respuesta } = req.body;

    // Validar que vengan ambos datos
    if (!pregunta || !respuesta) {
      return res.status(400).json({ error: 'Pregunta y respuesta son requeridas' });
    }

    // Hashear la respuesta (igual que una contraseña, para que sea segura)
    const saltRounds = 10;
    const respuestaHash = await bcrypt.hash(respuesta.toLowerCase().trim(), saltRounds);

    // Guardar en la base de datos
    await Usuario.configurarPreguntaSecreta(idUsuario, pregunta, respuestaHash);

    res.json({ mensaje: 'Pregunta secreta configurada exitosamente' });

  } catch (error) {
    console.error('Error al configurar pregunta secreta:', error);
    res.status(500).json({ error: 'Error al guardar pregunta secreta' });
  }
};

// ** OBTENER PREGUNTA SECRETA **
// Paso 1 de recuperación: el usuario ingresa su email y le muestro su pregunta
// Recibe: { email }
// Retorna: { pregunta }
authController.obtenerPreguntaSecreta = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener la pregunta secreta (solo la pregunta, no la respuesta)
    const pregunta = await Usuario.obtenerPreguntaSecreta(email);

    if (!pregunta) {
      return res.status(400).json({ 
        error: 'Este usuario no tiene pregunta secreta configurada. Contacta al administrador.' 
      });
    }

    // Devolver la pregunta para que el usuario la responda
    res.json({ pregunta });

  } catch (error) {
    console.error('Error al obtener pregunta secreta:', error);
    res.status(500).json({ error: 'Error al buscar pregunta' });
  }
};

// ** RECUPERAR CONTRASEÑA CON PREGUNTA SECRETA **
// Paso 2 de recuperación: verifico la respuesta y cambio la contraseña
// Recibe: { email, respuesta, nueva_password }
//
// Flujo:
// 1. Verifico que el usuario exista
// 2. Comparo la respuesta con bcrypt (igual que verifico contraseñas)
// 3. Si es correcta, cambio la contraseña
authController.recuperarConPreguntaSecreta = async (req, res) => {
  try {
    const { email, respuesta, nueva_password } = req.body;

    // Validar campos
    if (!email || !respuesta || !nueva_password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Buscar el usuario con su respuesta_secreta_hash
    const usuario = await Usuario.obtenerUsuarioConRespuestaHash(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que tenga pregunta secreta configurada
    if (!usuario.respuesta_secreta_hash) {
      return res.status(400).json({ 
        error: 'Este usuario no tiene pregunta secreta. Contacta al administrador.' 
      });
    }

    // Verificar que la respuesta sea correcta
    // bcrypt.compare compara el texto con el hash guardado
    const respuestaCorrecta = await bcrypt.compare(
      respuesta.toLowerCase().trim(), 
      usuario.respuesta_secreta_hash
    );

    if (!respuestaCorrecta) {
      return res.status(401).json({ error: 'Respuesta incorrecta' });
    }

    // La respuesta es correcta, cambiar la contraseña
    const saltRounds = 10;
    const nuevaPasswordHash = await bcrypt.hash(nueva_password, saltRounds);
    await Usuario.actualizarPassword(usuario.id_usuario, nuevaPasswordHash);

    res.json({ mensaje: 'Contraseña recuperada exitosamente' });

  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    res.status(500).json({ error: 'Error al recuperar contraseña' });
  }
};

// ** VER PERFIL **
// Devuelve los datos del usuario logueado
authController.obtenerPerfil = async (req, res) => {
  try {
    const id = req.session?.usuario?.id;
    if (!id) {
      return res.status(401).json({ error: 'Debes estar logueado' });
    }

    // Buscar los datos del usuario
    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // También traigo la pregunta secreta si la tiene
    const pregunta = await Usuario.obtenerPreguntaSecreta(usuario.email);

    res.json({ 
      id: usuario.id_usuario, 
      email: usuario.email, 
      nombre: usuario.nombre_completo, 
      rol: usuario.rol,
      pregunta_secreta: pregunta || null
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// ** EDITAR PERFIL **
// Permite cambiar email y nombre del usuario logueado
// Recibe: { email, nombre }
authController.actualizarPerfil = async (req, res) => {
  try {
    const id = req.session?.usuario?.id;
    if (!id) {
      return res.status(401).json({ error: 'Debes estar logueado' });
    }

    const { email, nombre } = req.body;

    // Si quiere cambiar el email, verifico que no esté en uso por otro usuario
    if (email) {
      const emailEnUso = await Usuario.existeEmailParaOtro(email, id);
      if (emailEnUso) {
        return res.status(409).json({ error: 'Ese email ya está en uso' });
      }
    }

    // Actualizar en la BD
    const actualizado = await Usuario.actualizarPerfil(id, { 
      email, 
      nombreCompleto: nombre 
    });

    if (!actualizado) {
      return res.status(400).json({ error: 'No hay nada para actualizar' });
    }

    // Actualizar los datos en la sesión también
    req.session.usuario.email = actualizado.email;
    req.session.usuario.nombre = actualizado.nombre_completo;

    res.json({ 
      mensaje: 'Perfil actualizado exitosamente', 
      usuario: { 
        id: actualizado.id_usuario, 
        email: actualizado.email, 
        nombre: actualizado.nombre_completo, 
        rol: actualizado.rol 
      } 
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// ** CAMBIAR CONTRASEÑA **
// El usuario logueado puede cambiar su contraseña
// Recibe: { password_actual, password_nueva }
// IMPORTANTE: debo verificar que la contraseña actual sea correcta
authController.cambiarPassword = async (req, res) => {
  try {
    const id = req.session?.usuario?.id;
    if (!id) {
      return res.status(401).json({ error: 'Debes estar logueado' });
    }

    const { password_actual, password_nueva } = req.body;

    // Validar que vengan ambas contraseñas
    if (!password_actual || !password_nueva) {
      return res.status(400).json({ error: 'Debes ingresar ambas contraseñas' });
    }

    // Buscar el usuario con su password_hash
    const usuario = await Usuario.buscarConHashPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que la contraseña actual sea correcta
    const passwordCorrecta = await bcrypt.compare(password_actual, usuario.password_hash);
    if (!passwordCorrecta) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Todo ok, generar el nuevo hash y guardar
    const saltRounds = 10;
    const nuevoHash = await bcrypt.hash(password_nueva, saltRounds);
    await Usuario.actualizarPassword(id, nuevoHash);

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

module.exports = authController;
