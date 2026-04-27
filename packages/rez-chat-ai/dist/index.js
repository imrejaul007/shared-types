"use strict";
// ── @rez/chat-ai ─────────────────────────────────────────────────────────────────
// AI-powered chat service for ReZ ecosystem
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectIntent = exports.AnalyticsEventTracker = exports.resetAnalyticsService = exports.getAnalyticsService = exports.AnalyticsService = exports.ConversationOutcomeTracker = exports.ImprovementRecommender = exports.ResponseQualityAnalyzer = exports.KnowledgeGapDetector = exports.PatternAnalyzer = exports.resetLearningSystem = exports.getLearningSystem = exports.LearningSystem = exports.createAIChatService = exports.AIChatService = exports.createAIHandler = exports.BOOKING_TOOLS = exports.AIChatHandler = exports.INDUSTRY_CATEGORIES = exports.getKnowledgeForAppType = exports.getKnowledgeForIndustry = exports.createKnowledgeBase = exports.UnifiedKnowledgeBase = exports.CustomerKnowledgeProvider = exports.MerchantKnowledgeProvider = exports.IndustryKnowledgeProvider = exports.AppKnowledgeProvider = exports.GlobalKnowledgeProvider = exports.sanitizeCustomerContext = exports.defaultSanitizer = exports.DataSanitizer = exports.transactionSanitizer = exports.idSanitizer = exports.phoneSanitizer = exports.emailSanitizer = exports.cardNumberSanitizer = exports.sensitiveDataSanitizer = void 0;
// Sanitizers
var sanitize_1 = require("./sanitizers/sanitize");
Object.defineProperty(exports, "sensitiveDataSanitizer", { enumerable: true, get: function () { return sanitize_1.sensitiveDataSanitizer; } });
Object.defineProperty(exports, "cardNumberSanitizer", { enumerable: true, get: function () { return sanitize_1.cardNumberSanitizer; } });
Object.defineProperty(exports, "emailSanitizer", { enumerable: true, get: function () { return sanitize_1.emailSanitizer; } });
Object.defineProperty(exports, "phoneSanitizer", { enumerable: true, get: function () { return sanitize_1.phoneSanitizer; } });
Object.defineProperty(exports, "idSanitizer", { enumerable: true, get: function () { return sanitize_1.idSanitizer; } });
Object.defineProperty(exports, "transactionSanitizer", { enumerable: true, get: function () { return sanitize_1.transactionSanitizer; } });
Object.defineProperty(exports, "DataSanitizer", { enumerable: true, get: function () { return sanitize_1.DataSanitizer; } });
Object.defineProperty(exports, "defaultSanitizer", { enumerable: true, get: function () { return sanitize_1.defaultSanitizer; } });
Object.defineProperty(exports, "sanitizeCustomerContext", { enumerable: true, get: function () { return sanitize_1.sanitizeCustomerContext; } });
// Knowledge Providers
var providers_1 = require("./knowledge/providers");
Object.defineProperty(exports, "GlobalKnowledgeProvider", { enumerable: true, get: function () { return providers_1.GlobalKnowledgeProvider; } });
Object.defineProperty(exports, "AppKnowledgeProvider", { enumerable: true, get: function () { return providers_1.AppKnowledgeProvider; } });
Object.defineProperty(exports, "IndustryKnowledgeProvider", { enumerable: true, get: function () { return providers_1.IndustryKnowledgeProvider; } });
Object.defineProperty(exports, "MerchantKnowledgeProvider", { enumerable: true, get: function () { return providers_1.MerchantKnowledgeProvider; } });
Object.defineProperty(exports, "CustomerKnowledgeProvider", { enumerable: true, get: function () { return providers_1.CustomerKnowledgeProvider; } });
Object.defineProperty(exports, "UnifiedKnowledgeBase", { enumerable: true, get: function () { return providers_1.UnifiedKnowledgeBase; } });
Object.defineProperty(exports, "createKnowledgeBase", { enumerable: true, get: function () { return providers_1.createKnowledgeBase; } });
Object.defineProperty(exports, "getKnowledgeForIndustry", { enumerable: true, get: function () { return providers_1.getKnowledgeForIndustry; } });
Object.defineProperty(exports, "getKnowledgeForAppType", { enumerable: true, get: function () { return providers_1.getKnowledgeForAppType; } });
Object.defineProperty(exports, "INDUSTRY_CATEGORIES", { enumerable: true, get: function () { return providers_1.INDUSTRY_CATEGORIES; } });
// AI Handler
var aiHandler_1 = require("./handlers/aiHandler");
Object.defineProperty(exports, "AIChatHandler", { enumerable: true, get: function () { return aiHandler_1.AIChatHandler; } });
Object.defineProperty(exports, "BOOKING_TOOLS", { enumerable: true, get: function () { return aiHandler_1.BOOKING_TOOLS; } });
Object.defineProperty(exports, "createAIHandler", { enumerable: true, get: function () { return aiHandler_1.createAIHandler; } });
// Chat Service
var aiChatService_1 = require("./services/aiChatService");
Object.defineProperty(exports, "AIChatService", { enumerable: true, get: function () { return aiChatService_1.AIChatService; } });
Object.defineProperty(exports, "createAIChatService", { enumerable: true, get: function () { return aiChatService_1.createAIChatService; } });
// Analytics & Learning
var analytics_1 = require("./analytics");
Object.defineProperty(exports, "LearningSystem", { enumerable: true, get: function () { return analytics_1.LearningSystem; } });
Object.defineProperty(exports, "getLearningSystem", { enumerable: true, get: function () { return analytics_1.getLearningSystem; } });
Object.defineProperty(exports, "resetLearningSystem", { enumerable: true, get: function () { return analytics_1.resetLearningSystem; } });
Object.defineProperty(exports, "PatternAnalyzer", { enumerable: true, get: function () { return analytics_1.PatternAnalyzer; } });
Object.defineProperty(exports, "KnowledgeGapDetector", { enumerable: true, get: function () { return analytics_1.KnowledgeGapDetector; } });
Object.defineProperty(exports, "ResponseQualityAnalyzer", { enumerable: true, get: function () { return analytics_1.ResponseQualityAnalyzer; } });
Object.defineProperty(exports, "ImprovementRecommender", { enumerable: true, get: function () { return analytics_1.ImprovementRecommender; } });
Object.defineProperty(exports, "ConversationOutcomeTracker", { enumerable: true, get: function () { return analytics_1.ConversationOutcomeTracker; } });
Object.defineProperty(exports, "AnalyticsService", { enumerable: true, get: function () { return analytics_1.AnalyticsService; } });
Object.defineProperty(exports, "getAnalyticsService", { enumerable: true, get: function () { return analytics_1.getAnalyticsService; } });
Object.defineProperty(exports, "resetAnalyticsService", { enumerable: true, get: function () { return analytics_1.resetAnalyticsService; } });
Object.defineProperty(exports, "AnalyticsEventTracker", { enumerable: true, get: function () { return analytics_1.AnalyticsEventTracker; } });
Object.defineProperty(exports, "detectIntent", { enumerable: true, get: function () { return analytics_1.detectIntent; } });
// ── Quick Start Usage ────────────────────────────────────────────────────────────
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
//# sourceMappingURL=index.js.map