import { type CaptureIntentParams, type CaptureIntentResult, type Intent } from '../types/intent.js';
export declare class IntentCaptureService {
    /**
     * Capture an intent event from user action
     */
    capture(params: CaptureIntentParams): Promise<CaptureIntentResult>;
    /**
     * Calculate new confidence based on existing signals and new event
     */
    private calculateNewConfidence;
    /**
     * Calculate recency multiplier using exponential decay
     */
    private calculateRecencyMultiplier;
    /**
     * Calculate velocity bonus for rapid signals
     */
    private calculateVelocityBonus;
    private calculateAvgTimeBetweenSignals;
    /**
     * Determine intent status based on event type
     */
    private determineStatus;
    /**
     * Add event to sequence tracking
     */
    private addToSequence;
    /**
     * Update cross-app intent profile
     */
    private updateCrossAppProfile;
    private getCategoryIncrementField;
    private recalculateAffinities;
    /**
     * Get active intents for a user
     */
    getActiveIntents(userId: string): Promise<Intent[]>;
    /**
     * Get all intents for a user across apps
     */
    getUserIntents(userId: string): Promise<Intent[]>;
}
export declare const intentCaptureService: IntentCaptureService;
//# sourceMappingURL=IntentCaptureService.d.ts.map