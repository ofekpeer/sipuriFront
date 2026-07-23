import { API_URL } from './bookApi';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { message: 'שרת ה־API אינו זמין או לא עודכן. יש לאתחל את ה־backend.' };

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('שרת ה־API לא הגיב בזמן. נסו שוב בעוד רגע.');
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export function loginRequest(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerRequest(name, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function getCurrentUserRequest(token) {
  return request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getLibraryRequest(token) {
  return request('/api/users/me/books', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
