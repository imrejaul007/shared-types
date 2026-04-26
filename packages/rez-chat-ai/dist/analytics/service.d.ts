import { ConversationOutcome, MessageFeedback, AIResponseMetrics, PatternEntry, KnowledgeGap, ImprovementAction, AnalyticsSummary } from './types';
import { LearningSystem } from './learningEngine';
export interface AnalyticsRepository {
    saveOutcome(outcome: ConversationOutcome): Promise<void>;
    getOutcomes(filters?: {
        startDate?: Date;
        endDate?: Date;
        appType?: string;
    }): Promise<ConversationOutcome[]>;
    saveFeedback(feedback: MessageFeedback): Promise<void>;
    getFeedback(messageId: string): Promise<MessageFeedback[]>;
    saveMetrics(metrics: AIResponseMetrics): Promise<void>;
    getMetrics(conversationId?: string): Promise<AIResponseMetrics[]>;
    savePatterns(patterns: PatternEntry[]): Promise<void>;
    getPatterns(industryCategory?: string): Promise<PatternEntry[]>;
    saveGap(gap: KnowledgeGap): Promise<void>;
    getGaps(threshold?: number): Promise<KnowledgeGap[]>;
    saveAction(action: ImprovementAction): Promise<void>;
    getActions(status?: ImprovementAction['status']): Promise<ImprovementAction[]>;
    updateActionStatus(actionId: string, status: ImprovementAction['status']): Promise<void>;
}
export declare class AnalyticsService {
    private learningSystem;
    private repository;
    constructor(learningSystem?: LearningSystem);
    setRepository(repo: AnalyticsRepository): void;
    recordConversationStart(conversationId: string, userId: string, appType: string, industryCategory?: string, merchantId?: string): Promise<void>;
    recordMessage(conversationId: string, userMessage: string, aiResponse: string, customerId: string, industryCategory?: string, metrics?: {
        confidence: number;
        responseTime: number;
        toolUsed?: boolean;
        toolName?: string;
        knowledgeSources: string[];
        resolved?: boolean;
    }): Promise<void>;
    recordEscalation(conversationId: string): Promise<void>;
    recordConversationEnd(conversationId: string, outcome: ConversationOutcome['outcome']): Promise<void>;
    recordFeedback(feedback: MessageFeedback): Promise<void>;
    getAnalyticsSummary(days?: number): Promise<AnalyticsSummary>;
    getRecommendations(): Promise<ImprovementAction[]>;
    getTopPatterns(count?: number): Promise<PatternEntry[]>;
    getKnowledgeGaps(): Promise<KnowledgeGap[]>;
    getImprovementAreas(): Promise<string[]>;
    getIntentStats(): Promise<Array<{
        intent: string;
        count: number;
        successRate: number;
    }>>;
    getToolUsageStats(): Promise<Array<{
        tool: string;
        count: number;
        successRate: number;
    }>>;
    getIndustryStats(): Promise<Record<string, {
        conversations: number;
        avgResolutionRate: number;
        avgConfidence: number;
    }>>;
    getResponseTimeStats(): Promise<{
        avgResponseTime: number;
        p50: number;
        p95: number;
        p99: number;
    }>;
    persistToDatabase(): Promise<void>;
    loadFromDatabase(): Promise<void>;
}
export interface AnalyticsEvents {
    'conversation:start': {
        conversationId: string;
        userId: string;
        appType: string;
        industryCategory?: string;
        merchantId?: string;
    };
    'message:sent': {
        conversationId: string;
        messageId: string;
        sender: 'user' | 'ai' | 'staff';
        content: string;
        timestamp: Date;
    };
    'message:feedback': {
        messageId: string;
        conversationId: string;
        helpful: boolean;
        rating?: number;
        feedback?: string;
    };
    'escalation:triggered': {
        conversationId: string;
        reason: string;
        department?: string;
    };
    'tool:executed': {
        conversationId: string;
        toolName: string;
        success: boolean;
        duration: number;
    };
    'conversation:end': {
        conversationId: string;
        outcome: 'resolved' | 'escalated' | 'abandoned' | 'failed';
        duration?: number;
        rating?: number;
    };
}
export declare class AnalyticsEventTracker {
    private service;
    private pendingEvents;
    constructor(service: AnalyticsService);
    trackEvent<K extends keyof AnalyticsEvents>(event: K, data: AnalyticsEvents[K]): Promise<void>;
    getPendingEvents(): Array<{
        type: string;
        data: unknown;
        timestamp: Date;
    }>;
    clearPendingEvents(): void;
}
export declare function getAnalyticsService(): AnalyticsService;
export declare function resetAnalyticsService(): void;
//# sourceMappingURL=service.d.ts.map