// ! Configuración de cuenta (perfil, contraseña, pregunta secreta y preferencias locales)
// * Contrato rápido:
//   - GET/PUT /api/auth/perfil para datos del usuario
//   - PUT /api/auth/password para cambio de contraseña
//   - POST /api/auth/pregunta-secreta/configurar para pregunta de recuperación
//   - Preferencias se guardan en localStorage por ahora (tema, auto_inicio, page_size)
// ? Requiere: inicializarPagina() desde components.js, y utils para UI (mostrarAlerta, setButtonLoading, manejarErrorAPI)

document.addEventListener('DOMContentLoaded', async () => {
  const acceso = await inicializarPagina();
  if (!acceso) return;
  await cargarPerfil();
  configurarFormularios();
  prepararAdmin();
});

async function cargarPerfil() {
  try {
    const resp = await fetch('/api/auth/perfil', { credentials: 'include' });
    if (!resp.ok) return manejarErrorAPI(null, resp);
    const data = await resp.json();
    const form = document.getElementById('form-perfil');
    form.nombre.value = data.nombre || '';
    form.email.value = data.email || '';
    
    // Mostrar pregunta secreta si existe
    if (data.pregunta_secreta) {
      const container = document.getElementById('pregunta-actual-container');
      const texto = document.getElementById('pregunta-actual-texto');
      texto.textContent = data.pregunta_secreta;
      container.classList.remove('hidden');
    }
    
    // Guardar rol en dataset para control de UI admin
    document.body.dataset.rol = data.rol || '';
  } catch (e) { manejarErrorAPI(e); }
}

function configurarFormularios() {
  const formPerfil = document.getElementById('form-perfil');
  formPerfil.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formPerfil).entries());
    try {
      setButtonLoading('btn-guardar-perfil', true);
      const resp = await fetch('/api/auth/perfil', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data)
      });
      const result = await resp.json();
      if (resp.ok) {
        mostrarAlerta('Perfil actualizado', 'success');
        // Refrescar nombre en header
        document.getElementById('usuario-nombre').textContent = result.usuario?.nombre || data.nombre;
      } else {
        mostrarAlerta(result.error || 'No se pudo actualizar el perfil', 'error');
      }
    } catch (e) { manejarErrorAPI(e); }
    finally { setButtonLoading('btn-guardar-perfil', false); }
  });

  const formPwd = document.getElementById('form-password');
  formPwd.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formPwd).entries());
    if (!data.password_actual || !data.password_nueva) {
      mostrarAlerta('Completa ambos campos de contraseña', 'warning');
      return;
    }
    // ? Podrías validar reglas de fortaleza aquí (largo mínimo, mayúsculas, símbolos, etc.)
    try {
      setButtonLoading('btn-guardar-password', true);
      const resp = await fetch('/api/auth/password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data)
      });
      const result = await resp.json();
      if (resp.ok) {
        mostrarAlerta('Contraseña actualizada', 'success');
        formPwd.reset();
      } else {
        mostrarAlerta(result.error || 'No se pudo actualizar la contraseña', 'error');
      }
    } catch (e) { manejarErrorAPI(e); }
    finally { setButtonLoading('btn-guardar-password', false); }
  });

  // Formulario de pregunta secreta
  const formPregunta = document.getElementById('form-pregunta-secreta');
  formPregunta.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formPregunta).entries());
    
    if (!data.pregunta || !data.respuesta) {
      mostrarAlerta('Completa ambos campos de la pregunta secreta', 'warning');
      return;
    }
    
    try {
      setButtonLoading('btn-guardar-pregunta', true);
      const resp = await fetch('/api/auth/pregunta-secreta/configurar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      const result = await resp.json();
      
      if (resp.ok) {
        mostrarAlerta('Pregunta secreta configurada correctamente', 'success');
        formPregunta.reset();
        // Recargar perfil para mostrar la pregunta actualizada
        await cargarPerfil();
      } else {
        mostrarAlerta(result.error || 'No se pudo configurar la pregunta secreta', 'error');
      }
    } catch (e) { manejarErrorAPI(e); }
    finally { setButtonLoading('btn-guardar-pregunta', false); }
  });

  // Sección de preferencias eliminada (MVP)
}

function prepararAdmin() {
  const rol = document.body.dataset.rol;
  const cardAdmin = document.getElementById('card-admin');
  if (rol !== 'admin') {
    if (cardAdmin) cardAdmin.classList.add('hidden');
    return;
  }
  // Mostrar card para admin
  cardAdmin.classList.remove('hidden');

  const btnMostrar = document.getElementById('btn-mostrar-crear-usuario');
  const formCrear = document.getElementById('form-crear-usuario-config');
  const btnCancelar = document.getElementById('btn-cancelar-crear-usuario');

  btnMostrar.addEventListener('click', () => {
    formCrear.classList.toggle('hidden');
  });
  btnCancelar.addEventListener('click', () => {
    formCrear.classList.add('hidden');
    formCrear.reset();
  });

  formCrear.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formCrear).entries());
    try {
      setButtonLoading('btn-crear-usuario', true);
      const resp = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      const result = await resp.json();
      if (resp.ok) {
        mostrarAlerta('Usuario creado exitosamente', 'success');
        formCrear.reset();
        formCrear.classList.add('hidden');
      } else {
        manejarErrorAPI(result, resp);
        mostrarAlerta(result.error || 'No se pudo crear el usuario', 'error');
      }
    } catch (e) { manejarErrorAPI(e); }
    finally { setButtonLoading('btn-crear-usuario', false); }
  });
}
