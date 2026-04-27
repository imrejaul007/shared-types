export interface IntentGraphMemory {
    getActiveIntents(userId: string): Promise<IntentSummary[]>;
    getDormantIntents(userId: string): Promise<DormantIntentSummary[]>;
    getCrossAppProfile(userId: string): Promise<CrossAppProfile | null>;
    enrichContext(userId: string): Promise<EnrichedContext>;
    recordAgentInsight(userId: string, agentId: string, insight: string): Promise<void>;
}
export interface IntentSummary {
    id: string;
    intentKey: string;
    category: string;
    confidence: number;
    status: string;
    lastSeen: Date;
    signals: number;
}
export interface DormantIntentSummary {
    id: string;
    intentKey: string;
    category: string;
    revivalScore: number;
    daysDormant: number;
    nudgeCount: number;
    idealRevivalAt: Date | null;
}
export interface CrossAppProfile {
    userId: string;
    travelAffinity: number;
    diningAffinity: number;
    retailAffinity: number;
    activeIntents: number;
    dormantIntents: number;
    totalConversions: number;
}
export interface EnrichedContext {
    userId: string;
    activeIntents: IntentSummary[];
    dormantIntents: DormantIntentSummary[];
    suggestedNudges: NudgeSuggestion[];
    affinities: AffinityScores;
    recentActivity: ActivityEvent[];
    agentInsights: AgentInsight[];
}
export interface NudgeSuggestion {
    dormantIntentId: string;
    intentKey: string;
    category: string;
    message: string;
    revivalScore: number;
    priority: 'low' | 'medium' | 'high';
}
export interface AffinityScores {
    travel: number;
    dining: number;
    retail: number;
}
export interface ActivityEvent {
    type: string;
    timestamp: Date;
    description: string;
    agentId?: string;
}
export interface AgentInsight {
    agentId: string;
    insight: string;
    timestamp: Date;
}
export declare class IntentGraphMemoryService implements IntentGraphMemory {
    private memoryCache;
    private readonly CACHE_TTL_MS;
    getActiveIntents(userId: string): Promise<IntentSummary[]>;
    getDormantIntents(userId: string): Promise<DormantIntentSummary[]>;
    getCrossAppProfile(userId: string): Promise<CrossAppProfile | null>;
    enrichContext(userId: string): Promise<EnrichedContext>;
    recordAgentInsight(userId: string, agentId: string, insight: string): Promise<void>;
    private getRecentActivity;
    private getAgentInsights;
    invalidateCache(userId: string): void;
    clearCache(): void;
}
export declare const intentGraphMemory: IntentGraphMemoryService;
export interface AgentTool {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    handler: (params: Record<string, unknown>) => Promise<unknown>;
}
export declare const INTENT_TOOLS: AgentTool[];
export declare function executeAgentTool(toolName: string, params: Record<string, unknown>): Promise<{
    success: boolean;
    result?: unknown;
    error?: string;
}>;
export declare function listAgentTools(): Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}>;
//# sourceMappingURL=agentOsIntegration.d.ts.map