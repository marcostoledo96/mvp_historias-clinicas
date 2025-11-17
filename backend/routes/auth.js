// ! RUTAS DE AUTENTICACIÓN
// Todas las rutas relacionadas con usuarios: login, logout, perfil y recuperación de contraseña
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { logging, validarCamposRequeridos, verificarAuth, verificarAdmin } = require('../middlewares/auth');

// Logging de todas las peticiones (para debuggear)
router.use(logging);

// ** LOGIN Y SESIÓN **
// POST /api/auth/login - Iniciar sesión
router.post('/login', 
  validarCamposRequeridos(['email', 'password']),
  authController.login
);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authController.logout);

// GET /api/auth/verificar - Verificar si hay sesión activa
router.get('/verificar', authController.verificarSesion);

// ** REGISTRO (SOLO ADMIN) **
// POST /api/auth/registro - Crear nuevo usuario
// IMPORTANTE: solo los admin pueden crear usuarios
router.post('/registro', 
  verificarAuth,
  verificarAdmin,
  validarCamposRequeridos(['email', 'nombre_completo', 'password']),
  authController.registro
);

// ** RECUPERACIÓN DE CONTRASEÑA CON PREGUNTA SECRETA **
// POST /api/auth/pregunta-secreta/configurar - El usuario configura su pregunta
router.post('/pregunta-secreta/configurar',
  verificarAuth,
  validarCamposRequeridos(['pregunta', 'respuesta']),
  authController.configurarPreguntaSecreta
);

// POST /api/auth/pregunta-secreta/obtener - Obtener pregunta para recuperación
router.post('/pregunta-secreta/obtener',
  validarCamposRequeridos(['email']),
  authController.obtenerPreguntaSecreta
);

// POST /api/auth/recuperar - Recuperar contraseña respondiendo pregunta
router.post('/recuperar',
  validarCamposRequeridos(['email', 'respuesta', 'nueva_password']),
  authController.recuperarConPreguntaSecreta
);

// ** PERFIL DEL USUARIO LOGUEADO **
// GET /api/auth/perfil - Ver datos del perfil
router.get('/perfil', verificarAuth, authController.obtenerPerfil);

// PUT /api/auth/perfil - Editar nombre y email
router.put('/perfil', verificarAuth, authController.actualizarPerfil);

// PUT /api/auth/password - Cambiar contraseña
router.put('/password', 
  verificarAuth,
  validarCamposRequeridos(['password_actual', 'password_nueva']),
  authController.cambiarPassword
);

module.exports = router;
