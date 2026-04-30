export interface AgentMetrics {
    conversationId: string;
    userId: string;
    appType: string;
    startedAt: Date;
    endedAt?: Date;
    duration?: number;
    messageCount: number;
    toolCalls: ToolCallMetric[];
    escalations: number;
    satisfaction?: number;
}
export interface ToolCallMetric {
    toolName: string;
    calledAt: Date;
    duration: number;
    success: boolean;
    error?: string;
}
export interface SessionSummary {
    totalSessions: number;
    activeSessions: number;
    avgSessionDuration: number;
    totalMessages: number;
    avgMessagesPerSession: number;
    toolUsageStats: Record<string, number>;
    escalationRate: number;
    topTools: Array<{
        tool: string;
        count: number;
    }>;
    appTypeDistribution: Record<string, number>;
    hourlyActivity: number[];
}
export declare class AgentAnalytics {
    private sessions;
    private toolUsage;
    startSession(conversationId: string, userId: string, appType: string): void;
    endSession(conversationId: string, satisfaction?: number): void;
    trackMessage(conversationId: string): void;
    trackToolCall(conversationId: string, toolName: string, duration: number, success: boolean, error?: string): void;
    trackEscalation(conversationId: string): void;
    getSession(conversationId: string): AgentMetrics | undefined;
    getActiveSessions(): AgentMetrics[];
    getSummary(): SessionSummary;
    getToolPerformance(): Array<{
        tool: string;
        totalCalls: number;
        successRate: number;
        avgDuration: number;
        errorRate: number;
    }>;
    cleanup(olderThanMs?: number): number;
    exportForExternal(): Record<string, unknown>;
}
export declare function getAgentAnalytics(): AgentAnalytics;
export default AgentAnalytics;
//# sourceMappingURL=agentAnalytics.d.ts.map