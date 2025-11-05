// Archivo retirado: modo demo deshabilitado. Exporta no-ops para compatibilidad.
'use strict';

module.exports = {
  modoDemo: (req, res, next) => { if (typeof next === 'function') next(); },
  interceptarOperacionesDemo: (req, res, next) => { if (typeof next === 'function') next(); },
  limpiarDatosDemo: () => {},
  EMAILS_DEMO: []
};