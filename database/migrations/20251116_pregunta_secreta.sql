-- Migración: Agregar sistema de recuperación de contraseña por pregunta secreta
-- Fecha: 2025-11-16
-- Descripción: Agrega columnas para pregunta y respuesta secreta en tabla usuarios

-- Agregar columnas para pregunta secreta
ALTER TABLE usuarios 
ADD COLUMN pregunta_secreta VARCHAR(255),
ADD COLUMN respuesta_secreta_hash VARCHAR(255);

-- Comentarios para documentar las columnas
COMMENT ON COLUMN usuarios.pregunta_secreta IS 'Pregunta que el usuario elige para recuperar su contraseña';
COMMENT ON COLUMN usuarios.respuesta_secreta_hash IS 'Hash de la respuesta secreta (bcrypt)';

-- Índice para búsqueda rápida por email (si no existe)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
