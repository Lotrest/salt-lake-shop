// src/utils/api.js
// ЧИСТЫЙ браузерный клиент (никаких express/path!)
import i18n from '../i18n';

export const API_URL = import.meta?.env?.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : 'https://my-backend-production-3416.up.railway.app';

// Аккуратная склейка URL без node:path
function joinURL(base, path) {
  const b = String(base || '').replace(/\/+$/, '/'); // гарантируем завершающий /
  return new URL(path, b).toString();
}

// ✅ Экспортируем функцию http, чтобы её можно было использовать в других модулях
export async function http(path, opts = {}) {
  const lng = (i18n?.language || 'ru').split('-')[0];

  const url = new URL(joinURL(API_URL, path));
  // добавляем ?lng=xx если его нет
  if (!url.searchParams.has('lng')) url.searchParams.set('lng', lng);

  const resp = await fetch(url.toString(), {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lng,
      ...(opts.headers || {}),
    },
    credentials: 'include', // чтобы передавались cookie
    body: opts.body, // не трогаем body, если это POST/PUT
  });

  let data = null;
  try {
    data = await resp.json();
  } catch {}

  if (!resp.ok || (data && data.success === false)) {
    const err =
      (data && (data.error || data.message)) ||
      `${resp.status} ${resp.statusText}`;
    throw new Error(err);
  }
  return data;
}

/* ===================== Экспорты API ===================== */

// NEWS
export const getNews = () => http('/api/news');

// DESIGNS
export const createDesign = (body) =>
  http('/api/designs', { method: 'POST', body: JSON.stringify(body) });

export const updateDesign = (id, body) =>
  http(`/api/designs/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const uploadLayer = (id, base64) =>
  http(`/api/designs/${id}/layers/upload`, {
    method: 'POST',
    body: JSON.stringify({ base64 }),
  });

export const renderDesign = (id, body) =>
  http(`/api/designs/${id}/render`, { method: 'POST', body: JSON.stringify(body) });

export const aiEnabled = () => http('/api/designs/ai-enabled');

export const aiGenerate = (id, prompt) =>
  http(id ? `/api/designs/${id}/ai-generate` : '/api/designs/ai-generate', {
    method: 'POST',
    body: JSON.stringify({ prompt, size: '1024x1024' }),
  });

// CART
export const cartAdd = (body) =>
  http('/api/cart/add', { method: 'POST', body: JSON.stringify(body) });
