// Real-time socket helper that loads socket.io-client from a CDN at runtime,
// so the app works even if the npm package isn't installed locally.
import { SOCKET_URL } from './api';

let socketPromise = null;

// Dynamically load the socket.io-client UMD bundle from a CDN once.
function loadSocketIo() {
    if (window.io) return Promise.resolve(window.io);
    return new Promise((resolve, reject) => {
        const existing = document.getElementById('socket-io-cdn');
        if (existing) {
            existing.addEventListener('load', () => resolve(window.io));
            existing.addEventListener('error', reject);
            return;
        }
        const script = document.createElement('script');
        script.id = 'socket-io-cdn';
        script.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
        script.async = true;
        script.onload = () => resolve(window.io);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Returns a promise that resolves to a connected socket instance (or null on failure).
export function getSocket() {
    if (!socketPromise) {
        socketPromise = loadSocketIo()
            .then((io) => io(SOCKET_URL, { transports: ['websocket', 'polling'] }))
            .catch((err) => {
                console.warn('Real-time updates unavailable:', err);
                return null;
            });
    }
    return socketPromise;
}
