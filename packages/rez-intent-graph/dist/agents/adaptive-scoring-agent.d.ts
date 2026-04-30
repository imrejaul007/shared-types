import type { AgentConfig, AgentResult, ScoredIntent } from './types.js';
export declare const adaptiveScoringAgentConfig: AgentConfig;
interface ModelWeights {
    userHistory: number;
    timeOfDay: number;
    category: number;
    price: number;
    velocity: number;
    bias: number;
    version: string;
}
export declare function scoreIntentById(userId: string, intentId: string): Promise<ScoredIntent | null>;
export declare function scoreIntents(userId: string, intentIds: string[]): Promise<ScoredIntent[]>;
export declare function retrainModel(): Promise<void>;
export declare function runAdaptiveScoringAgent(): Promise<AgentResult>;
export declare function startAdaptiveScoringCron(): void;
export declare function stopAdaptiveScoringCron(): void;
export declare function getCurrentWeights(): ModelWeights;
export {};
//# sourceMappingURL=adaptive-scoring-agent.d.ts.map