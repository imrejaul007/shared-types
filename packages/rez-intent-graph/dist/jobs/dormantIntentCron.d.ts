export declare class DormantIntentCronJob {
    private isRunning;
    private lastRunAt?;
    private intervalMs;
    /**
     * Run the dormant intent detection job
     */
    run(): Promise<{
        detectedDormant: number;
        updatedRevivals: number;
        scheduledNudges: number;
    }>;
    /**
     * Queue scheduled nudge jobs using the nudge queue service
     */
    private queueScheduledNudges;
    /**
     * Process dead letter queue — log failed nudge jobs for manual review
     */
    private processDeadLetterQueue;
    /**
     * Start the cron job scheduler
     */
    start(): void;
    /**
     * Get job status
     */
    getStatus(): {
        isRunning: boolean;
        lastRunAt?: Date;
        intervalMs: number;
    };
}
export declare const dormantIntentCronJob: DormantIntentCronJob;
//# sourceMappingURL=dormantIntentCron.d.ts.map