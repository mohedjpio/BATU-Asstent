const BASE = '/api';

const request = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(`${BASE}${url}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });

    const data = await res.json();

    if (!res.ok) {
      throw Object.assign(new Error(data?.error?.message || 'Request failed'), {
        status: res.status,
        code: data?.error?.code,
      });
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};

export const chatApi = {
  sendMessage: (message) =>
    request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getBranding: () => request('/chat/branding'),
};
