// * Recuperar contraseña con pregunta secreta
// * Flujo en 2 pasos:
// * 1. Usuario ingresa email → sistema devuelve su pregunta secreta
// * 2. Usuario responde pregunta + nueva contraseña → sistema recupera acceso

document.addEventListener('DOMContentLoaded', () => {
  const formObtenerPregunta = document.getElementById('form-obtener-pregunta');
  const formRecuperar = document.getElementById('form-recuperar');
  const preguntaDisplay = document.getElementById('pregunta-display');
  const emailHidden = document.getElementById('email-hidden');

  // Paso 1: Obtener pregunta secreta
  formObtenerPregunta.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formObtenerPregunta).entries());
    
    try {
      const resp = await fetch('/api/auth/pregunta-secreta/obtener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      
      const result = await resp.json();
      
      if (resp.ok && result.pregunta) {
        // Mostrar la pregunta y el formulario de recuperación
        preguntaDisplay.textContent = result.pregunta;
        emailHidden.value = data.email;
        formRecuperar.style.display = 'block';
        mostrarAlerta('Respondé tu pregunta secreta para continuar', 'info');
      } else {
        mostrarAlerta(result.error || 'No se encontró pregunta secreta para este email', 'error');
      }
    } catch (e) {
      manejarErrorAPI(e);
    }
  });

  // Paso 2: Recuperar contraseña con respuesta
  formRecuperar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formRecuperar).entries());
    
    try {
      const resp = await fetch('/api/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          respuesta: data.respuesta,
          nueva_password: data.nueva_password
        })
      });
      
      const result = await resp.json();
      
      if (resp.ok) {
        mostrarAlerta('¡Contraseña restablecida con éxito! Redirigiendo al login...', 'success');
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        mostrarAlerta(result.error || 'No se pudo restablecer la contraseña', 'error');
      }
    } catch (e) {
      manejarErrorAPI(e);
    }
  });
});
