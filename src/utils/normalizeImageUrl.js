// src/utils/normalizeImageUrl.js
const BACKEND = 'https://my-backend-production-3416.up.railway.app';
const FALLBACK = '/news-fallback.jpg'; // файл положи в frontend/public/

export default function normalizeImageUrl(url = '') {
  if (typeof url !== 'string' || !url) return FALLBACK;

  // абсолютные ссылки (http/https)
  if (/^https?:\/\//i.test(url)) return url;

  // локальные пути (/uploads/...)
  if (url.startsWith('/uploads/')) return `${BACKEND}${url}`;

  // всё остальное — дефолт
  return FALLBACK;
}
