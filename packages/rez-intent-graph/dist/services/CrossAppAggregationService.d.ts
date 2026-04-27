import { type CrossAppIntentProfile, type EnrichedContext, type Category } from '../types/intent.js';
export declare class CrossAppAggregationService {
    /**
     * Get or create cross-app profile for a user
     */
    getProfile(userId: string): Promise<CrossAppIntentProfile>;
    /**
     * Get enriched context for an agent (active + dormant intents)
     */
    getEnrichedContext(userId: string): Promise<EnrichedContext>;
    /**
     * Generate nudge suggestions based on dormant intents and profile
     */
    private generateNudgeSuggestions;
    /**
     * Generate context-aware nudge message
     */
    private generateNudgeMessage;
    /**
     * Aggregate demand signals for merchants
     */
    aggregateMerchantDemand(merchantId: string, category: string, timeRangeDays?: number): Promise<{
        demandCount: number;
        unmetDemandPct: number;
        avgConfidence: number;
        topIntentKeys: string[];
    }>;
    /**
     * Calculate demand trend
     */
    private calculateTrend;
    /**
     * Get user affinity scores across categories
     */
    getUserAffinities(userId: string): Promise<{
        travel: number;
        dining: number;
        retail: number;
        dominantCategory: Category;
    }>;
}
export declare const crossAppAggregationService: CrossAppAggregationService;
//# sourceMappingURL=CrossAppAggregationService.d.ts.map