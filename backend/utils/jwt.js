// Utilidades para manejo de JWT (JSON Web Tokens)
// Centraliza la emisión y verificación de tokens de acceso y refresh
const jwt = require('jsonwebtoken');

// Configuración de secretos y expiración desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'historias_clinicas_secret_default';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // 1 hora por defecto
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'historias_clinicas_refresh_secret_default';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // 7 días por defecto

// Emisión de access token
// Contiene los datos esenciales del usuario: id, email, nombre, rol
function generarAccessToken(usuario) {
  const payload = {
    id: usuario.id || usuario.id_usuario,
    email: usuario.email,
    nombre: usuario.nombre_completo || usuario.nombre,
    rol: usuario.rol
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Emisión de refresh token
// Solo contiene el id del usuario para poder renovar el access token
function generarRefreshToken(usuario) {
  const payload = {
    id: usuario.id || usuario.id_usuario,
    tipo: 'refresh'
  };
  
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

// Verificación de access token
// Retorna el payload decodificado o lanza error si es inválido/expirado
function verificarAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
}

// Verificación de refresh token
// Retorna el payload decodificado o lanza error si es inválido/expirado
function verificarRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    
    // Verificar que sea un refresh token válido
    if (decoded.tipo !== 'refresh') {
      throw new Error('Token inválido');
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Refresh token inválido');
    }
    throw error;
  }
}

module.exports = {
  generarAccessToken,
  generarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken
};
