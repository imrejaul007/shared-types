import type { AgentConfig, AgentResult, ScarcitySignal, DemandSignal } from './types.js';
export declare const scarcityAgentConfig: AgentConfig;
export declare function updateInventory(merchantId: string, productId: string, available: number, reserved: number): void;
export declare function runScarcityAgent(): Promise<AgentResult>;
export declare function getScarcityForDemandSignal(demand: DemandSignal): Promise<ScarcitySignal | null>;
export declare function startScarcityCron(): void;
export declare function stopScarcityCron(): void;
//# sourceMappingURL=scarcity-agent.d.ts.map