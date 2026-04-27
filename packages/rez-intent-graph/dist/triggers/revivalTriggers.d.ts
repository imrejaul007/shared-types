export type TriggerType = 'price_drop' | 'return_user' | 'seasonality' | 'offer_match' | 'manual';
export interface TriggerResult {
    success: boolean;
    triggered: number;
    revivalScore?: number;
    suggestedMessage?: string;
}
export declare function handlePriceDropTrigger(dormantIntentId: string, priceDropPct?: number): Promise<TriggerResult>;
export declare function handleReturnUserTrigger(dormantIntentId: string, daysSinceReturn: number): Promise<TriggerResult>;
export declare function handleSeasonalityTrigger(dormantIntentId: string, season: 'spring' | 'summer' | 'autumn' | 'winter' | 'holiday' | 'weekend'): Promise<TriggerResult>;
export declare function handleOfferMatchTrigger(dormantIntentId: string, offerType: 'discount' | 'cashback' | 'free_delivery' | 'buy_one_get_one' | 'loyalty_points'): Promise<TriggerResult>;
export declare function handleManualTrigger(dormantIntentId: string, agentId?: string): Promise<TriggerResult>;
export declare function handleBulkTrigger(userId: string, triggerType: TriggerType, triggerData?: Record<string, unknown>): Promise<TriggerResult>;
//# sourceMappingURL=revivalTriggers.d.ts.map