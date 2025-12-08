const API_BASE = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const getApiUrl = (path = '') => {
  if (typeof path === 'string' && /^https?:\/\//i.test(path)) {
    return path;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
};

export const apiFetch = (path, options) => fetch(getApiUrl(path), options);
