import { Server } from 'http';
export type SubscriptionChannel = 'demand_signals' | 'scarcity_alerts' | 'nudge_events' | 'system_metrics' | 'merchant_dashboard' | 'user_intents';
interface Subscription {
    channel: SubscriptionChannel;
    filter?: {
        merchantId?: string;
        userId?: string;
        category?: string;
    };
}
export declare class ReZWSServer {
    private wss;
    private clients;
    private clientCounter;
    private metricsInterval;
    private heartbeatInterval;
    /**
     * Initialize WebSocket server
     */
    initialize(server: Server): void;
    /**
     * Handle incoming message
     */
    private handleMessage;
    /**
     * Subscribe to a channel
     */
    subscribe(clientId: string, channel: SubscriptionChannel, filter?: Subscription['filter']): void;
    /**
     * Unsubscribe from a channel
     */
    unsubscribe(clientId: string, channel: SubscriptionChannel): void;
    /**
     * Send initial data when subscribing
     */
    private sendInitialData;
    /**
     * Broadcast to all clients subscribed to a channel
     */
    broadcast(channel: SubscriptionChannel, payload: unknown, filter?: Subscription['filter']): void;
    /**
     * Broadcast to specific merchant's subscribers
     */
    broadcastToMerchant(merchantId: string, event: string, data: unknown): void;
    /**
     * Broadcast to specific user's subscribers
     */
    broadcastToUser(userId: string, event: string, data: unknown): void;
    /**
     * Send message to specific client
     */
    private sendToClient;
    /**
     * Start heartbeat to detect stale connections
     */
    private startHeartbeat;
    /**
     * Start periodic metrics broadcast
     */
    private startMetricsBroadcast;
    /**
     * Get server stats
     */
    getStats(): {
        totalClients: number;
        subscriptions: Record<SubscriptionChannel, number>;
        uptime: number;
    };
    /**
     * Shutdown server
     */
    shutdown(): void;
}
export declare const wsServer: ReZWSServer;
/**
 * Publish demand spike event
 */
export declare function publishDemandSpike(merchantId: string, signal: unknown): Promise<void>;
/**
 * Publish scarcity alert
 */
export declare function publishScarcityAlert(merchantId: string, alert: unknown): Promise<void>;
/**
 * Publish nudge event
 */
export declare function publishNudgeEvent(userId: string, event: string, data: unknown): Promise<void>;
/**
 * Publish intent update
 */
export declare function publishIntentUpdate(userId: string, intent: unknown): Promise<void>;
export {};
//# sourceMappingURL=server.d.ts.map