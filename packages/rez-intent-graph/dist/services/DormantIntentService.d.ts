import { type DormantIntent, type RevivalCandidate } from '../types/intent.js';
export declare class DormantIntentService {
    /**
     * Mark an intent as dormant and create DormantIntent record
     */
    markDormant(intentId: string): Promise<DormantIntent | null>;
    /**
     * Process all intents and detect newly dormant ones
     */
    detectAndMarkDormant(daysThreshold?: number): Promise<{
        processed: number;
        markedDormant: number;
    }>;
    /**
     * Calculate and update revival scores for all active dormant intents
     */
    updateRevivalScores(): Promise<number>;
    /**
     * Get dormant intents for a specific user
     */
    getUserDormantIntents(userId: string): Promise<DormantIntent[]>;
    /**
     * Get dormant intents by merchant and category
     */
    getDormantIntentsByMerchant(merchantId: string, category: string): Promise<Array<{
        userId: string;
        intentKey: string;
        category: string;
    }>>;
    /**
     * Trigger revival for a specific dormant intent
     */
    triggerRevival(dormantIntentId: string, triggerType: 'price_drop' | 'return_user' | 'seasonality' | 'offer_match' | 'manual'): Promise<RevivalCandidate | null>;
    /**
     * Record nudge sent and update count
     */
    recordNudgeSent(dormantIntentId: string): Promise<void>;
    /**
     * Mark a dormant intent as revived (user converted)
     */
    markRevived(dormantIntentId: string): Promise<void>;
    /**
     * Pause nudges for a dormant intent (user opted out)
     */
    pauseNudges(dormantIntentId: string): Promise<void>;
    /**
     * Update cross-app profile dormancy counts
     */
    private updateCrossAppDormancy;
    /**
     * Get scheduled revival candidates (due for nudge)
     */
    getScheduledRevivals(): Promise<RevivalCandidate[]>;
}
export declare const dormantIntentService: DormantIntentService;
//# sourceMappingURL=DormantIntentService.d.ts.map