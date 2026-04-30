/**
 * Intent Capture Service - MongoDB
 * Captures user intent signals from various app events
 */
import type { IIntent, IIntentSignal } from '../models/Intent.js';
export interface CaptureIntentParams {
    userId: string;
    appType: string;
    eventType: string;
    category: string;
    intentKey: string;
    intentQuery?: string;
    metadata?: Record<string, unknown>;
    merchantId?: string;
}
export interface CaptureResult {
    intent: IIntent;
    signal: IIntentSignal;
    isNew: boolean;
}
/**
 * Intent Capture Service - MongoDB Implementation
 */
export declare class IntentCaptureService {
    /**
     * Capture an intent event from user action
     */
    capture(params: CaptureIntentParams): Promise<CaptureResult>;
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
    getActiveIntents(userId: string, page?: number, limit?: number): Promise<IIntent[]>;
    /**
     * Get all intents for a user across apps
     */
    getUserIntents(userId: string, page?: number, limit?: number): Promise<IIntent[]>;
    /**
     * Get intents by app type
     */
    getIntentsByApp(userId: string, appType: string): Promise<IIntent[]>;
}
export declare const intentCaptureService: IntentCaptureService;
//# sourceMappingURL=IntentCaptureService.d.ts.map