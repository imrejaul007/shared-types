interface NudgeJob {
    id: string;
    type: 'intent_revival_nudge' | 'price_drop_nudge' | 'seasonality_nudge' | 'manual_nudge';
    payload: {
        dormantIntentId: string;
        userId: string;
        intentKey: string;
        category: string;
        appType: string;
        message: string;
        revivalScore: number;
        channel: 'push' | 'email' | 'sms' | 'in_app';
        scheduledFor?: string;
    };
    metadata: {
        createdAt: string;
        retries: number;
        maxRetries: number;
        priority: 'low' | 'medium' | 'high' | 'critical';
    };
}
declare class NudgeQueueService {
    private redisAvailable;
    constructor();
    /**
     * Enqueue a nudge job
     */
    enqueue(job: NudgeJob): Promise<{
        success: boolean;
        queuePosition?: number;
    }>;
    /**
     * Enqueue to Redis (production)
     */
    private enqueueRedis;
    /**
     * Enqueue to in-memory queue (fallback)
     */
    private enqueueMemory;
    /**
     * Dequeue next job from queue
     */
    dequeue(priority?: 'low' | 'medium' | 'high' | 'critical'): Promise<NudgeJob | null>;
    private dequeueRedis;
    private dequeueMemory;
    /**
     * Get queue length
     */
    getQueueLength(priority?: 'low' | 'medium' | 'high' | 'critical'): Promise<number>;
    private getQueueLengthForPriority;
    /**
     * Move failed job to dead letter queue
     */
    moveToDeadLetter(job: NudgeJob, reason: string): Promise<void>;
    /**
     * Bulk enqueue multiple jobs
     */
    bulkEnqueue(jobs: NudgeJob[]): Promise<{
        success: number;
        failed: number;
    }>;
    /**
     * Get queue statistics
     */
    getStats(): Promise<{
        total: number;
        byPriority: Record<string, number>;
        deadLetter: number;
    }>;
    private getQueueForPriority;
}
export declare const nudgeQueue: NudgeQueueService;
export declare function createNudgeJob(params: {
    dormantIntentId: string;
    userId: string;
    intentKey: string;
    category: string;
    appType: string;
    message: string;
    revivalScore: number;
    channel?: 'push' | 'email' | 'sms' | 'in_app';
    triggerType?: 'intent_revival_nudge' | 'price_drop_nudge' | 'seasonality_nudge' | 'manual_nudge';
    priority?: 'low' | 'medium' | 'high' | 'critical';
}): NudgeJob;
export {};
//# sourceMappingURL=nudge-queue.d.ts.map