import { updateBookInCartRequest } from './cartApi';

function successfulResponse(data = {}) {
  return {
    ok: true,
    headers: {
      get: jest.fn(() => 'application/json; charset=utf-8'),
    },
    json: jest.fn().mockResolvedValue({ success: true, data }),
  };
}

describe('cart API', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue(successfulResponse());
    localStorage.setItem('sipuri.authToken', 'test-token');
  });

  afterEach(() => {
    delete global.fetch;
    localStorage.clear();
  });

  test('updates an existing cart item through the dedicated package endpoint', async () => {
    await updateBookInCartRequest('book-1', 'digital_physical');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('/api/cart/books/book-1');
    expect(options.method).toBe('PATCH');
    expect(JSON.parse(options.body)).toEqual({ productType: 'digital_physical' });
    expect(options.headers.Authorization).toBe('Bearer test-token');
  });
});
