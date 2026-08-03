function jsonResponse({ ok, data = {} }) {
  return {
    ok,
    headers: {
      get: jest.fn(() => 'application/json; charset=utf-8'),
    },
    json: jest.fn().mockResolvedValue(data),
  };
}

describe('auth API warmup', () => {
  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('falls back to a deployed public endpoint and shares concurrent warmups', async () => {
    global.fetch
      .mockResolvedValueOnce(jsonResponse({ ok: false }))
      .mockResolvedValueOnce(jsonResponse({
        ok: true,
        data: { success: true, data: { configured: false } },
      }));

    const { warmAuthApi } = require('./authApi');
    const [firstResult, secondResult] = await Promise.all([
      warmAuthApi(),
      warmAuthApi(),
    ]);

    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch.mock.calls[0][0]).toContain('/health?wake=');
    expect(global.fetch.mock.calls[1][0]).toContain('/api/payments/config?wake=');

    await warmAuthApi();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
