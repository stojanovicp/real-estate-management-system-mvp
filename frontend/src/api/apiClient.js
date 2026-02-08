const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function getAuthToken() {
  return localStorage.getItem('auth_token');
}

async function request(path, { method = 'GET', body, headers = {}, token } = {}) {
  const finalHeaders = { ...headers };

  // JSON body
  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  // Auth header (ako ima token)
  const authToken = token ?? getAuthToken();
  if (authToken) {
    finalHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error('Neuspešna konekcija sa serverom');
    err.status = 0;
    throw err;
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let data = null;
  try {
    data = isJson ? await res.json() : await res.text();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && data.message) ||
      res.statusText ||
      'Greška na serveru';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { ...(options || {}), method: 'GET' }),
  post: (path, body, options) =>
    request(path, { ...(options || {}), method: 'POST', body }),
  put: (path, body, options) =>
    request(path, { ...(options || {}), method: 'PUT', body }),
  del: (path, options) => request(path, { ...(options || {}), method: 'DELETE' }),
};