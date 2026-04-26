import { Socket } from 'socket.io-client';
import type { ChatEventName } from '../types';
export interface ChatSocketConfig {
    url: string;
    token?: string;
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    timeout?: number;
}
export interface ChatSocketOptions {
    namespace?: string;
    transports?: ('websocket' | 'polling')[];
}
export declare class ChatSocketClient {
    private socket;
    private config;
    private listeners;
    private offlineQueue;
    private isConnected;
    private connectionListeners;
    constructor(config: ChatSocketConfig);
    get connected(): boolean;
    get socketInstance(): Socket | null;
    connect(options?: ChatSocketOptions): void;
    disconnect(): void;
    on(event: ChatEventName | string, callback: (...args: unknown[]) => void): () => void;
    off(event: ChatEventName | string, callback: (...args: unknown[]) => void): void;
    once(event: ChatEventName | string, callback: (...args: unknown[]) => void): void;
    emit(event: string, ...args: unknown[]): void;
    onConnectionChange(callback: (connected: boolean) => void): () => void;
    private notifyConnectionListeners;
    private flushOfflineQueue;
    getOfflineQueueSize(): number;
    clearOfflineQueue(): void;
    removeAllListeners(): void;
    destroy(): void;
}
export declare function getChatSocket(config: ChatSocketConfig): ChatSocketClient;
export declare function destroyChatSocket(): void;
//# sourceMappingURL=ChatSocketClient.d.ts.map