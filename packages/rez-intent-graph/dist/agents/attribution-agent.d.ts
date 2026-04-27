import type { AgentConfig, AgentResult, AttributionRecord } from './types.js';
export declare const attributionAgentConfig: AgentConfig;
export type AttributionModel = 'first' | 'last' | 'linear' | 'time_decay' | 'position';
interface RawTouchpoint {
    type: 'impression' | 'click' | 'convert' | 'organic';
    channel: string;
    nudgeId?: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}
export declare function recordTouchpoint(userId: string, nudgeId: string, touchpoint: RawTouchpoint): Promise<void>;
export declare function calculateAttribution(userId: string, nudgeId: string, conversionValue: number, model?: AttributionModel): Promise<AttributionRecord>;
export declare function detectOrganicVsInfluenced(userId: string): Promise<{
    organic: number;
    influenced: number;
    ratio: number;
}>;
export declare function calculateIncrementality(merchantId: string, windowDays?: number): Promise<{
    nudgeGMV: number;
    organicGMV: number;
    incrementality: number;
    lift: number;
}>;
export declare function runAttributionAgent(): Promise<AgentResult>;
export declare function startAttributionCron(): void;
export declare function stopAttributionCron(): void;
export {};
//# sourceMappingURL=attribution-agent.d.ts.map