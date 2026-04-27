import { PrismaClient } from '@prisma/client';
declare class PrismaClientService {
    private client;
    private isConnected;
    /**
     * Initialize the Prisma client
     */
    connect(): Promise<void>;
    /**
     * Disconnect from database
     */
    disconnect(): Promise<void>;
    /**
     * Get the Prisma client instance
     */
    getClient(): PrismaClient | null;
    /**
     * Check if connected
     */
    getIsConnected(): boolean;
    /**
     * Execute with automatic connection handling
     */
    execute<T>(fn: (client: PrismaClient) => Promise<T>): Promise<T>;
    /**
     * Health check
     */
    healthCheck(): Promise<{
        connected: boolean;
        latencyMs?: number;
        error?: string;
    }>;
}
export declare const prismaClient: PrismaClientService;
export {};
//# sourceMappingURL=prisma-client.d.ts.map