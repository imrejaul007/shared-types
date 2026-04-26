import { CustomerContext } from '../types';
import { ConversationOutcome, MessageFeedback, AIResponseMetrics, PatternEntry, KnowledgeGap, ImprovementAction, AnalyticsSummary, LearningConfig } from './types';
export declare function normalizeText(text: string): string;
export declare function extractKeywords(text: string): string[];
export declare function detectIntent(message: string): {
    intent: string;
    confidence: number;
    keywords: string[];
};
export declare class PatternAnalyzer {
    private patterns;
    addInteraction(message: string, intent: string, category: string, success: boolean, confidence: number, toolUsed?: string, industryCategory?: string): void;
    findSimilarPattern(message: string): PatternEntry | null;
    getTopPatterns(count?: number): PatternEntry[];
    getLowConfidencePatterns(threshold?: number): PatternEntry[];
    getFailingPatterns(successThreshold?: number): PatternEntry[];
    getPatternsByIndustry(industryCategory: string): PatternEntry[];
    exportPatterns(): PatternEntry[];
    importPatterns(patterns: PatternEntry[]): void;
}
export declare class KnowledgeGapDetector {
    private gaps;
    detectGap(message: string, intent: string, resolved: boolean, industryCategory?: string): void;
    getUnresolvedGaps(threshold?: number): KnowledgeGap[];
    getHighPriorityGaps(): KnowledgeGap[];
    exportGaps(): KnowledgeGap[];
}
export declare class ResponseQualityAnalyzer {
    private feedbackHistory;
    private metricsHistory;
    recordFeedback(feedback: MessageFeedback): void;
    recordMetrics(metrics: AIResponseMetrics): void;
    getAverageRating(conversationId?: string): number | null;
    getHelpfulnessRate(): number;
    getAverageConfidence(): number;
    getAverageResponseTime(): number;
    getTopSources(): string[];
    getResolutionRate(): number;
    getImprovementAreas(): string[];
}
export declare class ImprovementRecommender {
    private patternAnalyzer;
    private gapDetector;
    private qualityAnalyzer;
    private actions;
    constructor(patternAnalyzer: PatternAnalyzer, gapDetector: KnowledgeGapDetector, qualityAnalyzer: ResponseQualityAnalyzer);
    generateRecommendations(): ImprovementAction[];
    getPendingActions(): ImprovementAction[];
    approveAction(actionId: string): void;
    rejectAction(actionId: string): void;
    applyAction(actionId: string): void;
}
export declare class ConversationOutcomeTracker {
    private outcomes;
    startConversation(conversationId: string, userId: string, appType: string, industryCategory?: string, merchantId?: string): void;
    incrementMessage(conversationId: string): void;
    incrementToolCalls(conversationId: string): void;
    addEscalation(conversationId: string): void;
    endConversation(conversationId: string, outcome: ConversationOutcome['outcome']): void;
    getSummary(days?: number): AnalyticsSummary;
    getOutcomes(): ConversationOutcome[];
}
export declare class LearningSystem {
    private patternAnalyzer;
    private gapDetector;
    private qualityAnalyzer;
    private recommender;
    private outcomeTracker;
    private config;
    constructor(config?: Partial<LearningConfig>);
    analyzeAndLearn(userMessage: string, aiResponse: string, context: CustomerContext, metrics: {
        confidence: number;
        responseTime: number;
        toolUsed?: boolean;
        toolName?: string;
        knowledgeSources: string[];
        resolved?: boolean;
    }): void;
    recordFeedback(feedback: MessageFeedback): void;
    getAnalytics(days?: number): AnalyticsSummary;
    getRecommendations(): ImprovementAction[];
    getTopPatterns(count?: number): PatternEntry[];
    getKnowledgeGaps(): KnowledgeGap[];
    getImprovementAreas(): string[];
    startConversation(conversationId: string, userId: string, appType: string, industryCategory?: string, merchantId?: string): void;
    incrementMessageCount(conversationId: string): void;
    recordEscalation(conversationId: string): void;
    endConversation(conversationId: string, outcome: ConversationOutcome['outcome']): void;
    exportPatterns(): PatternEntry[];
    importPatterns(patterns: PatternEntry[]): void;
}
export declare function getLearningSystem(): LearningSystem;
export declare function resetLearningSystem(): void;
//# sourceMappingURL=learningEngine.d.ts.map