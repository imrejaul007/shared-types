import type { AgentConfig, AgentResult } from './types.js';
export declare const feedbackLoopAgentConfig: AgentConfig;
interface HealthMetrics {
    agent: string;
    predictedConversionRate: number;
    actualConversionRate: number;
    drift: number;
    status: 'healthy' | 'drifted' | 'failed';
    lastUpdated: Date;
}
export declare function runFeedbackLoopAgent(): Promise<AgentResult>;
export declare function handleAlert(fromAgent: string, alertType: string, payload: unknown): Promise<void>;
export declare function startFeedbackLoopCron(): void;
export declare function stopFeedbackLoopCron(): void;
export declare function getAgentHealth(): HealthMetrics[];
export {};
//# sourceMappingURL=feedback-loop-agent.d.ts.map