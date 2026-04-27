/**
 * Cross-App Aggregation Service - MongoDB
 * Aggregates user intent data across all ReZ apps
 */
import type { ICrossAppIntentProfile } from '../models/CrossAppIntentProfile.js';
export interface UserAffinityProfile {
    userId: string;
    travelAffinity: number;
    diningAffinity: number;
    retailAffinity: number;
    dominantCategory: 'TRAVEL' | 'DINING' | 'RETAIL' | 'MIXED';
    totalIntents: number;
    dormantIntents: number;
    conversions: number;
}
export interface EnrichedContext {
    activeIntents: Array<{
        category: string;
        key: string;
        confidence: number;
        lastSeen: Date;
    }>;
    dormantIntents: Array<{
        category: string;
        key: string;
        revivalScore: number;
        daysDormant: number;
    }>;
    suggestedNudges: Array<{
        intentKey: string;
        message: string;
        priority: 'high' | 'medium' | 'low';
    }>;
    crossAppProfile: ICrossAppIntentProfile;
}
/**
 * Cross-App Aggregation Service - MongoDB Implementation
 */
export declare class CrossAppAggregationService {
    /**
     * Get or create cross-app profile for user
     */
    getProfile(userId: string): Promise<ICrossAppIntentProfile>;
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
     * Sync cross-app profile with current intents
     */
    syncCrossAppProfile(userId: string): Promise<ICrossAppIntentProfile>;
    /**
     * Get user affinity profile
     */
    getUserAffinityProfile(userId: string): Promise<UserAffinityProfile>;
    /**
     * Determine dominant category
     */
    private getDominantCategory;
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
     * Get user affinity scores across categories
     */
    getUserAffinities(userId: string): Promise<{
        travel: number;
        dining: number;
        retail: number;
        dominantCategory: 'TRAVEL' | 'DINING' | 'RETAIL' | 'MIXED';
    }>;
    /**
     * Get users by affinity (for segmentation)
     */
    getUsersByAffinity(category: 'TRAVEL' | 'DINING' | 'RETAIL', minAffinity?: number): Promise<string[]>;
    /**
     * Batch sync profiles (for cron job)
     */
    batchSyncProfiles(userIds: string[]): Promise<number>;
    /**
     * Get cross-app summary for dashboard
     */
    getCrossAppSummary(): Promise<{
        totalUsers: number;
        avgAffinity: {
            travel: number;
            dining: number;
            retail: number;
        };
        topCategories: Array<{
            category: string;
            count: number;
        }>;
    }>;
}
export declare const crossAppAggregationService: CrossAppAggregationService;
//# sourceMappingURL=CrossAppAggregationService.d.ts.map