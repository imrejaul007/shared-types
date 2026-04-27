export interface ScoringContext {
    intentId: string;
    baseConfidence: number;
    signalCount: number;
    lastSignalAt: Date;
    avgVelocity: number;
    metadata: {
        appType: string;
        category: string;
        status: string;
        daysActive: number;
    };
}
export interface DormancyDetection {
    intentId: string;
    daysSinceLastActivity: number;
    currentConfidence: number;
    shouldMarkDormant: boolean;
}
export interface RevivalCandidate {
    dormantIntent: any;
    intent: any;
    revivalScore: number;
    suggestedNudge: string;
    idealTiming: Date;
}
export declare class IntentScoringService {
    /**
     * Calculate detailed scoring context for an intent
     */
    getScoringContext(intentId: string): Promise<ScoringContext | null>;
    /**
     * Detect intents that should be marked as dormant
     */
    detectDormantIntents(daysThreshold?: number): Promise<DormancyDetection[]>;
    /**
     * Calculate revival score for a dormant intent
     */
    calculateRevivalScore(dormantIntentId: string): Promise<number>;
    /**
     * Compute revival score based on multiple factors
     */
    private computeRevivalScore;
    /**
     * Calculate timing bonus based on category
     */
    private calculateTimingBonus;
    /**
     * Calculate ideal revival timing
     */
    calculateIdealRevivalTime(category: string, daysDormant: number): Date;
    /**
     * Generate nudge message based on intent and trigger
     */
    generateNudgeMessage(intentKey: string, category: string, triggerType: string, _triggerData?: Record<string, unknown>): string;
    private formatIntentKey;
    /**
     * Get revival candidates sorted by score
     */
    getRevivalCandidates(limit?: number, minScore?: number): Promise<RevivalCandidate[]>;
    /**
     * Calculate average velocity between signals
     */
    private calculateAvgVelocity;
}
export declare const intentScoringService: IntentScoringService;
//# sourceMappingURL=IntentScoringService.d.ts.map