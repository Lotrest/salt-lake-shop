// @ts-nocheck
// ЧИСТЫЙ браузерный клиент (никаких express/path!)

export const API_URL =
  (import.meta?.env?.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'https://my-backend-production-3416.up.railway.app';

// Аккуратная склейка URL без node:path
function joinURL(base, path) {
  const b = String(base || '').replace(/\/+$/, '/'); // гарантируем завершающий /
  return new URL(path, b).toString();
}

async function http(path, opts = {}) {
  const resp = await fetch(joinURL(API_URL, path), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    credentials: 'include',
    ...opts,
  });

  let data = null;
  try { data = await resp.json(); } catch {}

  if (!resp.ok || (data && data.success === false)) {
    const err = (data && (data.error || data.message)) || `${resp.status} ${resp.statusText}`;
    throw new Error(err);
  }
  return data;
}

// ==== Экспорты ====
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

export const cartAdd = (body) =>
  http('/api/cart/add', { method: 'POST', body: JSON.stringify(body) });

export const aiEnabled = () => http('/api/designs/ai-enabled');

export const aiGenerate = (id, prompt) =>
  http(id ? `/api/designs/${id}/ai-generate` : '/api/designs/ai-generate', {
    method: 'POST',
    body: JSON.stringify({ prompt, size: '1024x1024' }),
  });

