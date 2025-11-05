// * Recuperar contraseña (flujo en 2 pasos)
// * Paso 1: solicitar código; Paso 2: restablecer con código recibido (el código se muestra en la consola del servidor).

document.addEventListener('DOMContentLoaded', () => {
  const formCodigo = document.getElementById('form-solicitar-codigo');
  const formReset = document.getElementById('form-restablecer');

  formCodigo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formCodigo).entries());
    try {
      const resp = await fetch('/api/auth/recuperar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await resp.json();
      if (resp.ok) {
        mostrarAlerta('Código enviado. Revisá la consola del servidor para el código.', 'success');
      } else {
        mostrarAlerta(result.error || 'No se pudo enviar el código', 'error');
      }
    } catch (e) { manejarErrorAPI(e); }
  });

  formReset.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formReset).entries());
    try {
      const resp = await fetch('/api/auth/restablecer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await resp.json();
      if (resp.ok) {
        mostrarAlerta('Contraseña restablecida. Volvé a iniciar sesión', 'success');
      } else {
        mostrarAlerta(result.error || 'No se pudo restablecer', 'error');
      }
    } catch (e) { manejarErrorAPI(e); }
  });
});
