// Small API helper for talking to the Ladies World backend.
const API_BASE = 'http://localhost:4000/api';

function getToken() {
    return localStorage.getItem('lw_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error((data && data.error) || `Request failed (${res.status})`);
    }
    return data;
}

export const api = {
    // Auth
    signup: (name, email, password) =>
        request('/auth/signup', { method: 'POST', body: { name, email, password } }),
    login: (email, password) =>
        request('/auth/login', { method: 'POST', body: { email, password } }),
    me: () => request('/auth/me', { auth: true }),

    // Cart
    getCart: () => request('/cart', { auth: true }),
    saveCart: (items) => request('/cart', { method: 'PUT', body: { items }, auth: true }),

    // Wishlist
    getWishlist: () => request('/wishlist', { auth: true }),
    saveWishlist: (items) => request('/wishlist', { method: 'PUT', body: { items }, auth: true }),

    // Orders
    getOrders: () => request('/orders', { auth: true }),
    getAllOrders: () => request('/orders/all', { auth: true }),
    placeOrder: (items) => request('/orders', { method: 'POST', body: { items }, auth: true }),
    updateOrderStatus: (id, status) =>
        request(`/orders/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
};

export const SOCKET_URL = 'http://localhost:4000';
export { getToken };
