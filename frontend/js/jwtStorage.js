// ! Gestión de tokens JWT en localStorage
// * Este módulo maneja el almacenamiento y recuperación de tokens JWT
// * para la autenticación del usuario en el frontend.
// ? Los tokens se guardan en localStorage y se envían en cada petición autenticada.

// Guardar tokens en localStorage
function guardarTokens(accessToken, refreshToken) {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

// Obtener access token
function obtenerAccessToken() {
  return localStorage.getItem('accessToken');
}

// Obtener refresh token
function obtenerRefreshToken() {
  return localStorage.getItem('refreshToken');
}

// Limpiar tokens (logout)
function limpiarTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// Verificar si hay tokens almacenados
function tieneTokens() {
  return !!localStorage.getItem('accessToken');
}

// Obtener headers de autenticación para fetch
function obtenerHeadersAuth(headersAdicionales = {}) {
  const token = obtenerAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...headersAdicionales
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Realizar fetch autenticado con refresh automático
async function fetchConAuth(url, options = {}) {
  // Primera petición con access token
  let response = await fetch(url, {
    ...options,
    headers: obtenerHeadersAuth(options.headers || {})
  });
  
  // Si es 401 y tenemos código TOKEN_EXPIRADO, intentar refresh
  if (response.status === 401) {
    const data = await response.json().catch(() => ({}));
    
    if (data.codigo === 'TOKEN_EXPIRADO') {
      // Intentar renovar el token
      const renovado = await renovarToken();
      
      if (renovado) {
        // Reintentar la petición original con el nuevo token
        response = await fetch(url, {
          ...options,
          headers: obtenerHeadersAuth(options.headers || {})
        });
      } else {
        // No se pudo renovar, redirigir a login
        limpiarTokens();
        mostrarAlerta('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 'error');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }
    }
  }
  
  return response;
}

// Renovar access token usando refresh token
async function renovarToken() {
  const refreshToken = obtenerRefreshToken();
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      guardarTokens(data.accessToken, data.refreshToken);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error renovando token:', error);
    return false;
  }
}
