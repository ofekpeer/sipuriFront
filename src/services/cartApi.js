import { API_URL } from './bookApi';

function authHeaders() {
  const token = localStorage.getItem('sipuri.authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function cartRequest(path = '', options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(`${API_URL}/api/cart${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { success: false, message: 'שרת העגלה לא החזיר תשובה תקינה.' };

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'פעולת העגלה נכשלה.');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('טעינת העגלה נמשכה זמן רב מדי. נסו שוב.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function getCartRequest() {
  return cartRequest();
}

export function addBookToCartRequest(bookId, productType = 'digital') {
  return cartRequest('/books', {
    method: 'POST',
    body: JSON.stringify({ bookId, productType }),
  });
}

export function updateBookInCartRequest(bookId, productType) {
  return cartRequest(`/books/${bookId}`, {
    method: 'PATCH',
    body: JSON.stringify({ productType }),
  });
}

export function removeBookFromCartRequest(bookId) {
  return cartRequest(`/books/${bookId}`, { method: 'DELETE' });
}

export function clearCartRequest() {
  return cartRequest('', { method: 'DELETE' });
}

export async function createCartCheckoutRequest(checkoutData = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${API_URL}/api/payments/cart/checkout`, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { success: false, message: 'שרת התשלום לא החזיר תשובה תקינה.' };

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'לא הצלחנו לפתוח את התשלום.');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('פתיחת התשלום נמשכה זמן רב מדי. נסו שוב.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
