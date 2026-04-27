import type { AgentConfig, AgentResult, CollaborativeSignal } from './types.js';
export declare const networkEffectAgentConfig: AgentConfig;
export declare function findSimilarUsers(userId: string, limit?: number): Promise<Array<{
    userId: string;
    similarity: number;
}>>;
export declare function getCollaborativeRecommendations(userId: string, category: string, limit?: number): Promise<string[]>;
export declare function generateCollaborativeSignal(userId: string): Promise<CollaborativeSignal | null>;
export declare function triggerCohortCampaign(category: string): Promise<void>;
export declare function runNetworkEffectAgent(): Promise<AgentResult>;
export declare function getCollaborativeSignalForUser(userId: string): Promise<CollaborativeSignal | null>;
export declare function startNetworkEffectCron(): void;
export declare function stopNetworkEffectCron(): void;
//# sourceMappingURL=network-effect-agent.d.ts.map