// // src/services/contactService.js
// import axios from 'axios';

// const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

// const api = axios.create({
//   baseURL: BASE,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 10000,
// });

// export async function sendContact(payload) {
//   try {
//     const { data } = await api.post('/contact', payload); 
//     return data; 
//   } catch (error) {
//     const res = error?.response;
//     if (res?.status === 422 && res?.data?.errors?.fieldErrors) {
//       const fe = res.data.errors.fieldErrors;
//       const msg = Object.entries(fe)
//         .map(([k, v]) => `${k}: ${v?.join(', ')}`)
//         .join('\n');
//       throw new Error(msg || 'Campos inválidos');
//     }
//     throw new Error(res?.data?.error || error.message || 'Error al enviar el mensaje');
//   }
// }


// src/services/ContactService.js
import axios from 'axios';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Adjunta Authorization: Bearer <token> si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper: saca el user_id del JWT o del user guardado
function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (token && token.split('.').length === 3) {
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(decodeURIComponent(escape(window.atob(b64))));
      const sub = Number(json?.sub);
      if (!Number.isNaN(sub)) return sub;
    } catch {}
  }
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const id = Number(user?.id);
    if (!Number.isNaN(id)) return id;
  } catch {}
  return null;
}

export async function sendContact(payload) {
  try {
    // el back acepta { name, email, message, subject? }
    const { data } = await api.post('/contact', payload);
    const user_id = getCurrentUserId(); // si está logueado -> id, si no -> null
    return { ...data, user_id };        // ← te devolvemos el user_id en la respuesta del service
  } catch (error) {
    const res = error?.response;
    if (res?.status === 422 && res?.data?.errors?.fieldErrors) {
      const fe = res.data.errors.fieldErrors;
      const msg = Object.entries(fe).map(([k, v]) => `${k}: ${v?.join(', ')}`).join('\n');
      throw new Error(msg || 'Campos inválidos');
    }
    throw new Error(res?.data?.error || error.message || 'Error al enviar el mensaje');
  }
}

export { api };
