export const API_URL = process.env.REACT_APP_API_URL || 'https://sipuriback.onrender.com';
const getAuthHeaders = () => {
  const token = localStorage.getItem('sipuri.authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function fetchWithTimeout(url, options = {}, timeoutMs = 30_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('השרת לא הגיב בזמן. נסו שוב בעוד רגע.');
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error('שרת ה־API אינו זמין או לא החזיר תשובה תקינה.');
  }

  return response.json();
}

export function getBookAssetUrl(path) {
  if (!path) {
    return null;
  }

  return /^https?:\/\//i.test(path) ? path : `${API_URL}${path}`;
}

export async function createBookRequest(formData, submissionId) {
  const form = new FormData();
  form.append('bookData', JSON.stringify(formData));

  if (formData.child?.image) {
    form.append('image', formData.child.image);
  }

  const response = await fetchWithTimeout(`${API_URL}/api/books/create`, {
    method: 'POST',
    body: form,
    headers: {
      ...getAuthHeaders(),
      ...(submissionId ? { 'Idempotency-Key': submissionId } : {}),
    },
  }, 30_000);

  const data = await readJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to create book');
  }

  return data;
}

export async function getBookRequest(id) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/books/${id}`,
    { headers: getAuthHeaders() },
    15_000,
  );
  const data = await readJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch book');
  }

  return data;
}

export async function getEditableBookRequest(id) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/books/${id}/edit`,
    { headers: getAuthHeaders() },
    15_000,
  );
  const data = await readJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'לא ניתן לטעון את עורך הספר');
  }

  return data;
}

export async function updateBookRequest(id, updates) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/books/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    },
    20_000,
  );
  const data = await readJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'שמירת השינויים נכשלה');
  }

  return data;
}

export async function replaceBookImageRequest(
  id,
  image,
  { kind, pageNumber },
) {
  const form = new FormData();
  form.append('image', image);
  form.append('kind', kind);

  if (pageNumber !== undefined) {
    form.append('pageNumber', String(pageNumber));
  }

  const response = await fetchWithTimeout(
    `${API_URL}/api/books/${id}/image`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: form,
    },
    60_000,
  );
  const data = await readJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'החלפת התמונה נכשלה');
  }

  return data;
}

export async function deleteBookRequest(id) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/books/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    },
    20_000,
  );
  const data = await readJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'מחיקת הספר נכשלה');
  }

  return data;
}
