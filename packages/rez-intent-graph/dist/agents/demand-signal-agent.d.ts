import type { AgentConfig, AgentResult, DemandSignal } from './types.js';
export declare const demandSignalAgentConfig: AgentConfig;
export declare function runDemandSignalAgent(): Promise<AgentResult>;
export declare function getMerchantDemand(merchantId: string, category: string): Promise<DemandSignal | null>;
export declare function startDemandSignalCron(): void;
export declare function stopDemandSignalCron(): void;
//# sourceMappingURL=demand-signal-agent.d.ts.map