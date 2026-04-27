// ── Prisma Client Service ──────────────────────────────────────────────────────
// Database client for intent graph persistence
// DANGEROUS: Enables full database operations with skip-permission

import { PrismaClient } from '@prisma/client';

const logger = {
  info: (msg: string, meta?: unknown) => console.log(`[PrismaClient] ${msg}`, meta || ''),
  warn: (msg: string, meta?: unknown) => console.warn(`[PrismaClient] ${msg}`, meta || ''),
  error: (msg: string, meta?: unknown) => console.error(`[PrismaClient] ${msg}`, meta || ''),
};

class PrismaClientService {
  private client: PrismaClient | null = null;
  private isConnected = false;

  /**
   * Initialize the Prisma client
   */
  async connect(): Promise<void> {
    if (this.client && this.isConnected) {
      return;
    }

    try {
      logger.info('Connecting to database...');
      this.client = new PrismaClient({
        log: [
          { level: 'warn', emit: 'event' },
          { level: 'error', emit: 'event' },
        ],
      });

      // Test connection
      await this.client.$connect();
      this.isConnected = true;
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
      this.client = null;
      this.isConnected = false;
      logger.info('Database disconnected');
    }
  }

  /**
   * Get the Prisma client instance
   */
  getClient(): PrismaClient | null {
    return this.client;
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Execute with automatic connection handling
   */
  async execute<T>(fn: (client: PrismaClient) => Promise<T>): Promise<T> {
    if (!this.isConnected) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('Prisma client not initialized');
    }

    return fn(this.client);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    connected: boolean;
    latencyMs?: number;
    error?: string;
  }> {
    const start = Date.now();

    try {
      if (!this.client || !this.isConnected) {
        await this.connect();
      }

      // Simple query to check connectivity
      await this.client!.$queryRaw`SELECT 1`;

      return {
        connected: true,
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        connected: false,
        latencyMs: Date.now() - start,
        error: String(error),
      };
    }
  }
}

// Singleton instance
export const prismaClient = new PrismaClientService();

// Auto-connect on module load (can be disabled in tests)
if (process.env.NODE_ENV !== 'test') {
  prismaClient.connect().catch((err) => {
    logger.warn('Initial connection failed, will retry on first use:', err);
  });
}
