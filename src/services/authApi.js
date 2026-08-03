import { API_URL } from './bookApi';

const AUTH_WARMUP_TIMEOUT = 90_000;
const AUTH_READY_TTL = 60_000;
const HEALTH_ATTEMPT_TIMEOUT = 10_000;
const HEALTH_RETRY_DELAY = 1_500;

let authWarmupPromise = null;
let authReadyAt = 0;

const wait = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

async function checkHealthPath(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_ATTEMPT_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${path}?wake=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      throw new Error('API is still waking up');
    }

    const data = await response.json();
    if (data.success === false) {
      throw new Error(data.message || 'API health check failed');
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function checkApiHealth() {
  let lastError = null;

  // Older backend deployments do not expose /health yet. The public payment
  // configuration endpoint is lightweight and lets us verify that Express is
  // awake without touching user data.
  for (const path of ['/health', '/api/payments/config']) {
    try {
      return await checkHealthPath(path);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('API health check failed');
}

async function waitForAuthApi(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;

  while (Date.now() < deadline) {
    try {
      return await checkApiHealth();
    } catch (error) {
      lastError = error;
    }

    const remainingTime = deadline - Date.now();
    if (remainingTime > 0) {
      await wait(Math.min(HEALTH_RETRY_DELAY, remainingTime));
    }
  }

  throw new Error(
    lastError?.name === 'AbortError'
      ? 'השרת עדיין מתעורר. נסו שוב בעוד מספר שניות.'
      : 'לא הצלחנו להכין את שרת ההתחברות. נסו שוב בעוד רגע.',
  );
}

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

export function warmAuthApi({ timeoutMs = AUTH_WARMUP_TIMEOUT } = {}) {
  if (Date.now() - authReadyAt < AUTH_READY_TTL) {
    return Promise.resolve({ success: true, status: 'ok' });
  }

  if (!authWarmupPromise) {
    authWarmupPromise = waitForAuthApi(timeoutMs)
      .then((data) => {
        authReadyAt = Date.now();
        return data;
      })
      .finally(() => {
        authWarmupPromise = null;
      });
  }

  return authWarmupPromise;
}

export function getGoogleLoginUrl() {
  return `${API_URL}/api/auth/google`;
}
