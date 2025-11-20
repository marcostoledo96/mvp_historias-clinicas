// Middleware para verificar autenticación con JWT
const { verificarAccessToken } = require('../utils/jwt');

// Middleware para verificar autenticación
const verificarAuth = (req, res, next) => {
  try {
    // Extraer el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autenticado. Debes iniciar sesión.' });
    }
    
    // Obtener el token quitando "Bearer "
    const token = authHeader.substring(7);
    
    // Verificar y decodificar el token
    const decoded = verificarAccessToken(token);
    
    // Adjuntar los datos del usuario al request para que los controladores puedan usarlos
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.message === 'Token expirado') {
      return res.status(401).json({ error: 'Token expirado', codigo: 'TOKEN_EXPIRADO' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar rol de admin
const verificarAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    return next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
};

// Middleware para verificar que sea doctor o admin
const verificarDoctor = (req, res, next) => {
  if (req.user && (req.user.rol === 'doctor' || req.user.rol === 'admin')) {
    return next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos médicos.' });
  }
};

// Middleware de logging
const logging = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const usuario = req.user?.email || 'anónimo';
  console.log(`[${timestamp}] ${req.method} ${req.url} - Usuario: ${usuario}`);
  next();
};

// Middleware de validación de campos requeridos
const validarCamposRequeridos = (camposRequeridos) => {
  return (req, res, next) => {
    const camposFaltantes = [];
    
    for (const campo of camposRequeridos) {
      if (!req.body[campo] || req.body[campo].toString().trim() === '') {
        camposFaltantes.push(campo);
      }
    }
    
    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`
      });
    }
    
    next();
  };
};

module.exports = {
  verificarAuth,
  verificarAdmin,
  verificarDoctor,
  logging,
  validarCamposRequeridos
};