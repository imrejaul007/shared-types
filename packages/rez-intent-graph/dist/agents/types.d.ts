export interface AgentConfig {
    name: string;
    intervalMs: number;
    enabled: boolean;
    priority: 'high' | 'medium' | 'low' | 'critical';
}
export interface AgentResult {
    agent: string;
    success: boolean;
    durationMs: number;
    data?: unknown;
    error?: string;
    timestamp?: Date;
}
export interface AgentHealth {
    agent: string;
    status: 'healthy' | 'degraded' | 'failed';
    lastRun: Date | null;
    lastSuccess: Date | null;
    consecutiveFailures: number;
    avgDurationMs: number;
}
export interface DemandSignal {
    merchantId: string;
    category: string;
    demandCount: number;
    unmetDemandPct: number;
    avgPriceExpectation: number;
    topCities: string[];
    trend: 'rising' | 'stable' | 'declining';
    spikeDetected: boolean;
    spikeFactor?: number;
    timestamp: Date;
}
export interface ScarcitySignal {
    merchantId: string;
    category: string;
    supplyCount: number;
    demandCount: number;
    scarcityScore: number;
    urgencyLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
    timestamp: Date;
}
export type UrgencyLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';
export interface UserResponseProfile {
    userId: string;
    openRates: Record<string, number>;
    clickRates: Record<string, number>;
    convertRates: Record<string, number>;
    optimalSendTimes: string[];
    preferredChannels: string[];
    tonePreferences: 'formal' | 'casual' | 'friendly' | 'urgent';
    avgSessionValue: number;
    lastUpdated: Date;
}
export interface AttributionRecord {
    id: string;
    userId: string;
    nudgeId: string;
    touchpoints: Touchpoint[];
    attributedConversion: boolean;
    attributedRevenue: number;
    attributionModel: 'first' | 'last' | 'linear' | 'time_decay' | 'position';
    windowDays: number;
    createdAt: Date;
}
export interface Touchpoint {
    type: 'impression' | 'click' | 'convert' | 'organic';
    channel: string;
    nudgeId?: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}
export interface ScoredIntent {
    intentId: string;
    userId: string;
    intentKey: string;
    predictedConversionProb: number;
    confidence: number;
    factors: {
        userHistory: number;
        timeOfDay: number;
        category: number;
        price: number;
        velocity: number;
    };
    modelVersion: string;
    timestamp: Date;
}
export interface OptimizationRecommendation {
    type: 'threshold_adjust' | 'timing_change' | 'channel_switch' | 'pause_strategy' | 'rebalance_budget';
    agent: string;
    currentValue: unknown;
    recommendedValue: unknown;
    confidence: number;
    reason: string;
    expectedImpact: number;
    timestamp: Date;
}
export interface CollaborativeSignal {
    userId: string;
    similarUsers: Array<{
        userId: string;
        similarity: number;
    }>;
    trendingIntents: string[];
    cohortRecommendations: string[];
    collaborativeFilterScore: number;
    timestamp: Date;
}
export interface RevenueReport {
    period: {
        start: Date;
        end: Date;
    };
    nudgeInfluencedGMV: number;
    organicGMV: number;
    totalGMV: number;
    nudgeLiftPct: number;
    roiByChannel: Record<string, number>;
    roiByMerchant: Record<string, number>;
    conversionLift: number;
    topPerformingNudges: Array<{
        nudgeId: string;
        revenue: number;
        roi: number;
    }>;
    underperformingNudges: Array<{
        nudgeId: string;
        reason: string;
    }>;
    timestamp: Date;
}
export interface AgentMessage {
    from: string;
    to: string;
    type: 'signal' | 'request' | 'response' | 'alert' | 'transaction' | 'order' | 'task' | 'status_update' | 'notification';
    payload: unknown;
    timestamp: Date;
}
export interface NudgeVariant {
    id: string;
    message: string;
    tone: 'formal' | 'casual' | 'friendly' | 'urgent';
    channel: string;
}
//# sourceMappingURL=types.d.ts.map