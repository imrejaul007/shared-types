import mongoose from 'mongoose';
export interface NudgeJob {
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
declare let NudgeQueueModel: mongoose.Model<any>;
export declare class NudgeQueueService {
    /**
     * Enqueue a nudge job
     */
    enqueue(job: NudgeJob, queueType?: string): Promise<{
        success: boolean;
        queuePosition?: number;
    }>;
    /**
     * Dequeue the next pending job from a queue.
     * Accepts queue types ('revival', 'priority', 'bulk') or legacy priorities
     * ('low', 'medium', 'high', 'critical') for backward compatibility.
     */
    dequeue(queueTypeOrPriority?: string): Promise<NudgeJob | null>;
    /**
     * Mark a job as completed and remove it
     */
    complete(jobId: string): Promise<void>;
    /**
     * Handle a failed job: retry with backoff or move to DLQ
     */
    fail(jobId: string, error: string): Promise<void>;
    /**
     * Get count of pending jobs in a queue
     */
    getQueueLength(queueType?: string): Promise<number>;
    /**
     * Move failed job to dead letter queue (legacy API compatibility)
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
    private priorityToNumber;
}
export declare const nudgeQueue: NudgeQueueService;
export { NudgeQueueModel };
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
//# sourceMappingURL=nudge-queue.d.ts.map