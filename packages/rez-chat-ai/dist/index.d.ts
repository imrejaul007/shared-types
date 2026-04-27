export { AppType, ReZAppType, IndustryCategory, KnowledgeEntry, KnowledgeBase, CustomerContext, OrderSummary, BookingSummary, AIChatMessage, AIChatRequest, AIChatResponse, AIAction, ToolHandler, ToolResult, KnowledgeProvider, Sanitizer, ChatSession, ChatConfig, } from './types';
export { sensitiveDataSanitizer, cardNumberSanitizer, emailSanitizer, phoneSanitizer, idSanitizer, transactionSanitizer, DataSanitizer, defaultSanitizer, sanitizeCustomerContext, SanitizedCustomerContext, } from './sanitizers/sanitize';
export { GlobalKnowledgeProvider, AppKnowledgeProvider, IndustryKnowledgeProvider, MerchantKnowledgeProvider, CustomerKnowledgeProvider, UnifiedKnowledgeBase, createKnowledgeBase, getKnowledgeForIndustry, getKnowledgeForAppType, INDUSTRY_CATEGORIES, MerchantKnowledgeData, } from './knowledge/providers';
export { AIChatHandler, AIHandlerConfig, ToolHandlerConfig, BOOKING_TOOLS, createAIHandler, } from './handlers/aiHandler';
export { AIChatService, AIChatServiceConfig, ChatContext, createAIChatService, } from './services/aiChatService';
export { LearningSystem, getLearningSystem, resetLearningSystem, PatternAnalyzer, KnowledgeGapDetector, ResponseQualityAnalyzer, ImprovementRecommender, ConversationOutcomeTracker, AnalyticsService, getAnalyticsService, resetAnalyticsService, AnalyticsEventTracker, detectIntent, AnalyticsRepository, } from './analytics';
export type { ConversationOutcome, MessageFeedback, AIResponseMetrics, PatternEntry, KnowledgeGap, ImprovementAction, AnalyticsSummary, AnalyticsEvents, } from './analytics';
/**
 * Basic usage example:
 *
 * ```typescript
 * import { createAIChatService } from '@rez/chat-ai';
 *
 * const chatService = createAIChatService({
 *   appType: 'hotel',
 *   merchantId: 'hotel-123',
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 * });
 *
 * // Process a message
 * const response = await chatService.processMessage({
 *   conversationId: 'conv-123',
 *   message: 'What time is check-out?',
 *   userId: 'user-456',
 *   appType: 'hotel',
 *   customerContext: {
 *     customerId: 'cust-789',
 *     name: 'John Doe',
 *     tier: 'gold',
 *   },
 * });
 *
 * console.log(response.message);
 * ```
 */
//# sourceMappingURL=index.d.ts.map