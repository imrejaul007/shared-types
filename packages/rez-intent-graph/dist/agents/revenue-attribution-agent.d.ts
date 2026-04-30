import type { AgentConfig, AgentResult, RevenueReport, AttributionRecord } from './types.js';
export declare const revenueAttributionAgentConfig: AgentConfig;
export declare function generateRevenueReport(startDate: Date, endDate: Date): Promise<RevenueReport>;
export declare function handleConversionAttribution(record: AttributionRecord): Promise<void>;
export declare function runRevenueAttributionAgent(): Promise<AgentResult>;
export declare function getLatestReport(): Promise<RevenueReport | null>;
export declare function startRevenueAttributionCron(): void;
export declare function stopRevenueAttributionCron(): void;
//# sourceMappingURL=revenue-attribution-agent.d.ts.map