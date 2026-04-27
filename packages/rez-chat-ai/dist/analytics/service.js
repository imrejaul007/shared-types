"use strict";
// ── Analytics Service ──────────────────────────────────────────────────────────
// Database persistence for learning and analytics data
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsEventTracker = exports.AnalyticsService = void 0;
exports.getAnalyticsService = getAnalyticsService;
exports.resetAnalyticsService = resetAnalyticsService;
const learningEngine_1 = require("./learningEngine");
// ── Analytics Service Implementation ─────────────────────────────────────────────
class AnalyticsService {
    learningSystem;
    repository = null;
    constructor(learningSystem) {
        this.learningSystem = learningSystem || (0, learningEngine_1.getLearningSystem)();
    }
    setRepository(repo) {
        this.repository = repo;
    }
    // ── Record Operations ──────────────────────────────────────────────────────
    async recordConversationStart(conversationId, userId, appType, industryCategory, merchantId) {
        this.learningSystem.startConversation(conversationId, userId, appType, industryCategory, merchantId);
    }
    async recordMessage(conversationId, userMessage, aiResponse, customerId, industryCategory, metrics) {
        this.learningSystem.incrementMessageCount(conversationId);
        this.learningSystem.analyzeAndLearn(userMessage, aiResponse, {
            customerId,
            preferences: industryCategory ? { industryCategory } : {},
        }, metrics || {
            confidence: 0.8,
            responseTime: 1000,
            knowledgeSources: ['unified'],
            resolved: false,
        });
    }
    async recordEscalation(conversationId) {
        this.learningSystem.recordEscalation(conversationId);
    }
    async recordConversationEnd(conversationId, outcome) {
        this.learningSystem.endConversation(conversationId, outcome);
    }
    async recordFeedback(feedback) {
        this.learningSystem.recordFeedback(feedback);
        if (this.repository) {
            await this.repository.saveFeedback(feedback);
        }
    }
    // ── Query Operations ──────────────────────────────────────────────────────
    async getAnalyticsSummary(days = 7) {
        return this.learningSystem.getAnalytics(days);
    }
    async getRecommendations() {
        return this.learningSystem.getRecommendations();
    }
    async getTopPatterns(count = 10) {
        return this.learningSystem.getTopPatterns(count);
    }
    async getKnowledgeGaps() {
        return this.learningSystem.getKnowledgeGaps();
    }
    async getImprovementAreas() {
        return this.learningSystem.getImprovementAreas();
    }
    async getIntentStats() {
        const patterns = this.learningSystem.getTopPatterns(100);
        const intentStats = {};
        for (const pattern of patterns) {
            if (!intentStats[pattern.intent]) {
                intentStats[pattern.intent] = { count: 0, success: 0 };
            }
            intentStats[pattern.intent].count += pattern.frequency;
            intentStats[pattern.intent].success += pattern.frequency * pattern.successRate;
        }
        return Object.entries(intentStats)
            .map(([intent, stats]) => ({
            intent,
            count: stats.count,
            successRate: stats.count > 0 ? stats.success / stats.count : 0,
        }))
            .sort((a, b) => b.count - a.count);
    }
    async getToolUsageStats() {
        const patterns = this.learningSystem.getTopPatterns(100);
        const toolStats = {};
        for (const pattern of patterns) {
            for (const tool of pattern.associatedTools) {
                if (!toolStats[tool]) {
                    toolStats[tool] = { count: 0, success: 0 };
                }
                toolStats[tool].count += pattern.frequency;
                toolStats[tool].success += pattern.frequency * pattern.successRate;
            }
        }
        return Object.entries(toolStats)
            .map(([tool, stats]) => ({
            tool,
            count: stats.count,
            successRate: stats.count > 0 ? stats.success / stats.count : 0,
        }))
            .sort((a, b) => b.count - a.count);
    }
    async getIndustryStats() {
        const patterns = this.learningSystem.getTopPatterns(100);
        const industryStats = {};
        for (const pattern of patterns) {
            for (const industry of pattern.industryCategories) {
                if (!industryStats[industry]) {
                    industryStats[industry] = { conversations: 0, confidence: 0, success: 0 };
                }
                industryStats[industry].conversations += pattern.frequency;
                industryStats[industry].confidence += pattern.frequency * pattern.avgConfidence;
                industryStats[industry].success += pattern.frequency * pattern.successRate;
            }
        }
        return Object.entries(industryStats).reduce((acc, [industry, stats]) => {
            acc[industry] = {
                conversations: stats.conversations,
                avgResolutionRate: stats.conversations > 0 ? stats.success / stats.conversations : 0,
                avgConfidence: stats.conversations > 0 ? stats.confidence / stats.conversations : 0,
            };
            return acc;
        }, {});
    }
    async getResponseTimeStats() {
        const patterns = this.learningSystem.getTopPatterns(100);
        // Simulated response times based on pattern complexity
        const responseTimes = patterns.flatMap(p => Array(p.frequency).fill(500 + Math.random() * 1500));
        if (responseTimes.length === 0) {
            return { avgResponseTime: 0, p50: 0, p95: 0, p99: 0 };
        }
        responseTimes.sort((a, b) => a - b);
        return {
            avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
            p50: responseTimes[Math.floor(responseTimes.length * 0.5)],
            p95: responseTimes[Math.floor(responseTimes.length * 0.95)],
            p99: responseTimes[Math.floor(responseTimes.length * 0.99)],
        };
    }
    // ── Persistence Operations ─────────────────────────────────────────────────
    async persistToDatabase() {
        if (!this.repository) {
            console.warn('[AnalyticsService] No repository configured for persistence');
            return;
        }
        // Persist patterns
        const patterns = this.learningSystem.exportPatterns();
        if (patterns.length > 0) {
            await this.repository.savePatterns(patterns);
        }
        // Persist knowledge gaps
        const gaps = this.learningSystem.getKnowledgeGaps();
        for (const gap of gaps) {
            await this.repository.saveGap(gap);
        }
        // Persist recommendations
        const recommendations = this.learningSystem.getRecommendations();
        for (const action of recommendations) {
            await this.repository.saveAction(action);
        }
    }
    async loadFromDatabase() {
        if (!this.repository) {
            console.warn('[AnalyticsService] No repository configured for loading');
            return;
        }
        // Load patterns
        const patterns = await this.repository.getPatterns();
        if (patterns.length > 0) {
            this.learningSystem.importPatterns(patterns);
        }
    }
}
exports.AnalyticsService = AnalyticsService;
// ── Analytics Event Tracker ─────────────────────────────────────────────────────
class AnalyticsEventTracker {
    service;
    pendingEvents = [];
    constructor(service) {
        this.service = service;
    }
    async trackEvent(event, data) {
        this.pendingEvents.push({
            type: event,
            data,
            timestamp: new Date(),
        });
        if (event === 'conversation:start') {
            const eventData = data;
            await this.service.recordConversationStart(eventData.conversationId, eventData.userId, eventData.appType, eventData.industryCategory, eventData.merchantId);
        }
        else if (event === 'message:sent') {
            const eventData = data;
            if (eventData.sender === 'ai') {
                // AI response recorded separately
            }
        }
        else if (event === 'message:feedback') {
            const eventData = data;
            await this.service.recordFeedback({
                messageId: eventData.messageId,
                conversationId: eventData.conversationId,
                helpful: eventData.helpful,
                rating: eventData.rating,
                feedback: eventData.feedback,
                timestamp: new Date(),
            });
        }
        else if (event === 'escalation:triggered') {
            const eventData = data;
            await this.service.recordEscalation(eventData.conversationId);
        }
        else if (event === 'conversation:end') {
            const eventData = data;
            await this.service.recordConversationEnd(eventData.conversationId, eventData.outcome);
        }
    }
    getPendingEvents() {
        return [...this.pendingEvents];
    }
    clearPendingEvents() {
        this.pendingEvents = [];
    }
}
exports.AnalyticsEventTracker = AnalyticsEventTracker;
// ── Singleton Instance ─────────────────────────────────────────────────────────
let analyticsServiceInstance = null;
function getAnalyticsService() {
    if (!analyticsServiceInstance) {
        analyticsServiceInstance = new AnalyticsService();
    }
    return analyticsServiceInstance;
}
function resetAnalyticsService() {
    analyticsServiceInstance = null;
}
//# sourceMappingURL=service.js.map