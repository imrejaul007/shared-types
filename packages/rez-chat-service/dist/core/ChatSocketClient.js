// Unified WebSocket Client for ReZ Chat
// Manages Socket.IO connection with reconnection, offline queue, and event handling
import { io } from 'socket.io-client';
const DEFAULT_CONFIG = {
    url: '',
    token: '',
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
};
export class ChatSocketClient {
    socket = null;
    config;
    listeners = new Map();
    offlineQueue = [];
    isConnected = false;
    connectionListeners = new Set();
    constructor(config) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    get connected() {
        return this.isConnected;
    }
    get socketInstance() {
        return this.socket;
    }
    connect(options) {
        if (this.socket?.connected) {
            return;
        }
        const socketOptions = {
            autoConnect: this.config.autoConnect,
            reconnection: this.config.reconnection,
            reconnectionAttempts: this.config.reconnectionAttempts,
            reconnectionDelay: this.config.reconnectionDelay,
            reconnectionDelayMax: this.config.reconnectionDelayMax,
            timeout: this.config.timeout,
            transports: options?.transports ?? ['websocket', 'polling'],
        };
        // Add auth token if provided
        if (this.config.token) {
            socketOptions.auth = { token: this.config.token };
        }
        const url = options?.namespace
            ? `${this.config.url}/${options.namespace}`
            : this.config.url;
        this.socket = io(url, socketOptions);
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.notifyConnectionListeners(true);
            this.flushOfflineQueue();
        });
        this.socket.on('disconnect', () => {
            this.isConnected = false;
            this.notifyConnectionListeners(false);
        });
        this.socket.on('connect_error', (error) => {
            console.error('[ChatSocket] Connection error:', error);
        });
        // Re-emit all registered events
        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach((callback) => {
                this.socket?.on(event, callback);
            });
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    // ── Event Handling ──────────────────────────────────────────────────────────
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        // Also register with socket if connected
        if (this.socket) {
            this.socket.on(event, callback);
        }
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    off(event, callback) {
        this.listeners.get(event)?.delete(callback);
        this.socket?.off(event, callback);
    }
    once(event, callback) {
        this.socket?.once(event, callback);
    }
    // ── Emit ──────────────────────────────────────────────────────────────────
    emit(event, ...args) {
        if (this.socket?.connected) {
            this.socket.emit(event, ...args);
        }
        else {
            // Queue for later if configured for offline support
            this.offlineQueue.push({ event, data: args });
        }
    }
    // ── Connection State ──────────────────────────────────────────────────────
    onConnectionChange(callback) {
        this.connectionListeners.add(callback);
        // Immediately notify of current state
        callback(this.isConnected);
        return () => this.connectionListeners.delete(callback);
    }
    notifyConnectionListeners(connected) {
        this.connectionListeners.forEach((cb) => cb(connected));
    }
    // ── Offline Queue ─────────────────────────────────────────────────────────
    flushOfflineQueue() {
        while (this.offlineQueue.length > 0) {
            const item = this.offlineQueue.shift();
            if (item) {
                this.emit(item.event, ...item.data);
            }
        }
    }
    getOfflineQueueSize() {
        return this.offlineQueue.length;
    }
    clearOfflineQueue() {
        this.offlineQueue = [];
    }
    // ── Cleanup ───────────────────────────────────────────────────────────────
    removeAllListeners() {
        this.listeners.clear();
        this.socket?.removeAllListeners();
    }
    destroy() {
        this.disconnect();
        this.removeAllListeners();
        this.connectionListeners.clear();
    }
}
// Singleton factory for app-wide socket management
let globalSocketClient = null;
export function getChatSocket(config) {
    if (!globalSocketClient) {
        globalSocketClient = new ChatSocketClient(config);
    }
    return globalSocketClient;
}
export function destroyChatSocket() {
    if (globalSocketClient) {
        globalSocketClient.destroy();
        globalSocketClient = null;
    }
}
//# sourceMappingURL=ChatSocketClient.js.map