"use strict";
// ── Learning Engine ──────────────────────────────────────────────────────────────
// Core learning logic for AI improvement over time
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningSystem = exports.ConversationOutcomeTracker = exports.ImprovementRecommender = exports.ResponseQualityAnalyzer = exports.KnowledgeGapDetector = exports.PatternAnalyzer = void 0;
exports.normalizeText = normalizeText;
exports.extractKeywords = extractKeywords;
exports.detectIntent = detectIntent;
exports.getLearningSystem = getLearningSystem;
exports.resetLearningSystem = resetLearningSystem;
const DEFAULT_CONFIG = {
    minFeedbackCount: 5,
    confidenceThreshold: 0.7,
    patternFrequencyThreshold: 10,
    knowledgeGapThreshold: 3,
    improvementBatchSize: 20,
    retentionDays: 90,
};
// ── Intent Patterns ────────────────────────────────────────────────────────────
const INTENT_PATTERNS = [
    {
        patterns: [/order|buy|purchase|get (me )?(this|that|it)/i],
        intent: 'place_order',
        examples: ['I want to order this', 'Buy me a coffee', 'Can I get the special?'],
        keywords: ['order', 'buy', 'purchase', 'get', 'checkout'],
        priority: 1,
    },
    {
        patterns: [/track|status|where.*(my )?(order|package|delivery)/i],
        intent: 'track_order',
        examples: ['Where is my order?', 'Track my package', 'What is the status?'],
        keywords: ['track', 'status', 'where', 'delivery', 'shipping'],
        priority: 1,
    },
    {
        patterns: [/cancel|refund|return/i],
        intent: 'cancel_order',
        examples: ['Cancel my order', 'I want a refund', 'Return this item'],
        keywords: ['cancel', 'refund', 'return', 'money back'],
        priority: 1,
    },
    {
        patterns: [/book|reserve|reservation|table|room/i],
        intent: 'make_booking',
        examples: ['Book a table for 4', 'I want to reserve a room', 'Make a reservation'],
        keywords: ['book', 'reserve', 'reservation', 'table', 'room', 'appointment'],
        priority: 1,
    },
    {
        patterns: [/menu|food|dish|eat|restaurant|cuisine/i],
        intent: 'browse_menu',
        examples: ['Show me the menu', 'What dishes do you have?', 'What are you serving?'],
        keywords: ['menu', 'food', 'dish', 'eat', 'cuisine', 'meal', 'course'],
        priority: 2,
    },
    {
        patterns: [/price|cost|how much|expensive|cheap|budget/i],
        intent: 'price_inquiry',
        examples: ['How much is this?', 'What is the price?', 'Is it expensive?'],
        keywords: ['price', 'cost', 'expensive', 'cheap', 'budget', 'rupee', 'dollar'],
        priority: 2,
    },
    {
        patterns: [/hour|open|close|time|available|when/i],
        intent: 'hours_inquiry',
        examples: ['What time do you open?', 'Are you open now?', 'When are you available?'],
        keywords: ['hour', 'open', 'close', 'time', 'available', 'schedule'],
        priority: 2,
    },
    {
        patterns: [/location|address|direction|where.*located|near/i],
        intent: 'location_inquiry',
        examples: ['Where are you located?', 'What is your address?', 'How do I get there?'],
        keywords: ['location', 'address', 'direction', 'near', 'find'],
        priority: 2,
    },
    {
        patterns: [/allerg|veg|vegan|vegetarian|gluten|diet/i],
        intent: 'dietary_inquiry',
        examples: ['Is this vegetarian?', 'Any allergens?', 'Is it gluten-free?'],
        keywords: ['allergen', 'vegetarian', 'vegan', 'gluten', 'diet', 'intolerance'],
        priority: 3,
    },
    {
        patterns: [/help|support|problem|issue|wrong|broken/i],
        intent: 'support_request',
        examples: ['I have a problem', 'Something is wrong', 'I need help'],
        keywords: ['help', 'support', 'problem', 'issue', 'wrong', 'broken', 'fix'],
        priority: 1,
    },
    {
        patterns: [/complaint|disappointed|angry|terrible|worst|bad/i],
        intent: 'complaint',
        examples: ['I am very disappointed', 'This is terrible', 'Worst service ever'],
        keywords: ['complaint', 'disappointed', 'angry', 'terrible', 'worst', 'bad', 'frustrated'],
        priority: 1,
    },
    {
        patterns: [/recommend|suggest|popular|best|special/i],
        intent: 'recommendation',
        examples: ['What do you recommend?', 'What is popular?', 'Any specials?'],
        keywords: ['recommend', 'suggest', 'popular', 'best', 'special', 'favorite'],
        priority: 2,
    },
    {
        patterns: [/thank|thanks|appreciate|great|awesome|good/i],
        intent: 'positive_feedback',
        examples: ['Thank you', 'Great service', 'Awesome!'],
        keywords: ['thank', 'thanks', 'great', 'awesome', 'good', 'perfect'],
        priority: 3,
    },
];
// ── Text Normalization ─────────────────────────────────────────────────────────
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function extractKeywords(text) {
    const normalized = normalizeText(text);
    const stopWords = new Set([
        'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
        'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
        'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when',
        'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
        'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
        'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if',
        'or', 'because', 'as', 'until', 'while', 'about', 'against', 'between',
        'into', 'through', 'during', 'before', 'after', 'above', 'below',
    ]);
    return normalized
        .split(' ')
        .filter(word => word.length > 2 && !stopWords.has(word));
}
// ── Intent Detection ───────────────────────────────────────────────────────────
function detectIntent(message) {
    const normalized = normalizeText(message);
    const keywords = extractKeywords(message);
    let bestMatch = null;
    let highestScore = 0;
    for (const pattern of INTENT_PATTERNS) {
        let score = 0;
        // Check regex patterns
        for (const regex of pattern.patterns) {
            if (regex.test(message)) {
                score += 2;
                break;
            }
        }
        // Check keywords
        const matchingKeywords = keywords.filter(k => pattern.keywords.includes(k));
        score += matchingKeywords.length;
        // Check example matches
        for (const example of pattern.examples) {
            if (normalized.includes(normalizeText(example))) {
                score += 1;
                break;
            }
        }
        if (score > highestScore) {
            highestScore = score;
            bestMatch = pattern;
        }
    }
    return {
        intent: bestMatch?.intent || 'general_inquiry',
        confidence: bestMatch ? Math.min(0.5 + highestScore * 0.1, 1) : 0.3,
        keywords,
    };
}
// ── Pattern Analyzer ──────────────────────────────────────────────────────────
class PatternAnalyzer {
    patterns = new Map();
    addInteraction(message, intent, category, success, confidence, toolUsed, industryCategory) {
        const normalizedPattern = normalizeText(message);
        const existing = this.patterns.get(normalizedPattern);
        if (existing) {
            existing.frequency += 1;
            existing.successRate =
                (existing.successRate * (existing.frequency - 1) + (success ? 1 : 0)) / existing.frequency;
            existing.avgConfidence =
                (existing.avgConfidence * (existing.frequency - 1) + confidence) / existing.frequency;
            existing.lastSeen = new Date();
            if (toolUsed && !existing.associatedTools.includes(toolUsed)) {
                existing.associatedTools.push(toolUsed);
            }
            if (industryCategory && !existing.industryCategories.includes(industryCategory)) {
                existing.industryCategories.push(industryCategory);
            }
        }
        else {
            this.patterns.set(normalizedPattern, {
                id: `pattern_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                pattern: message,
                normalizedPattern,
                intent,
                category,
                frequency: 1,
                successRate: success ? 1 : 0,
                avgConfidence: confidence,
                typicalResponses: [],
                associatedTools: toolUsed ? [toolUsed] : [],
                industryCategories: industryCategory ? [industryCategory] : [],
                lastSeen: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }
    findSimilarPattern(message) {
        const normalized = normalizeText(message);
        const keywords = new Set(extractKeywords(message));
        let bestMatch = null;
        let bestScore = 0;
        for (const pattern of this.patterns.values()) {
            const patternKeywords = new Set(extractKeywords(pattern.pattern));
            const intersection = [...keywords].filter(k => patternKeywords.has(k));
            const union = new Set([...keywords, ...patternKeywords]);
            const jaccardSimilarity = intersection.length / union.size;
            // Also check substring match
            const substringMatch = normalized.includes(pattern.normalizedPattern) ||
                pattern.normalizedPattern.includes(normalized);
            const score = jaccardSimilarity * 0.6 + (substringMatch ? 0.4 : 0);
            if (score > bestScore && score > 0.3) {
                bestScore = score;
                bestMatch = pattern;
            }
        }
        return bestMatch;
    }
    getTopPatterns(count = 10) {
        return [...this.patterns.values()]
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, count);
    }
    getLowConfidencePatterns(threshold = 0.5) {
        return [...this.patterns.values()]
            .filter(p => p.avgConfidence < threshold && p.frequency >= 3);
    }
    getFailingPatterns(successThreshold = 0.3) {
        return [...this.patterns.values()]
            .filter(p => p.successRate < successThreshold && p.frequency >= 5);
    }
    getPatternsByIndustry(industryCategory) {
        return [...this.patterns.values()]
            .filter(p => p.industryCategories.includes(industryCategory));
    }
    exportPatterns() {
        return [...this.patterns.values()];
    }
    importPatterns(patterns) {
        for (const pattern of patterns) {
            this.patterns.set(pattern.normalizedPattern, pattern);
        }
    }
}
exports.PatternAnalyzer = PatternAnalyzer;
// ── Knowledge Gap Detector ─────────────────────────────────────────────────────
class KnowledgeGapDetector {
    gaps = new Map();
    detectGap(message, intent, resolved, industryCategory) {
        const key = `${intent}:${industryCategory || 'general'}`;
        if (!resolved) {
            const existing = this.gaps.get(key);
            if (existing) {
                existing.timesAsked += 1;
                existing.unresolvedCount += 1;
                existing.resolutionRate = existing.resolvedCount / existing.timesAsked;
                if (!existing.questionPattern.includes(message)) {
                    existing.questionPattern = message.slice(0, 100);
                }
            }
            else {
                this.gaps.set(key, {
                    id: `gap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                    category: intent,
                    industryCategory,
                    questionPattern: message.slice(0, 100),
                    timesAsked: 1,
                    resolvedCount: 0,
                    unresolvedCount: 1,
                    resolutionRate: 0,
                    priority: 'medium',
                    createdAt: new Date(),
                });
            }
        }
        else {
            const existing = this.gaps.get(key);
            if (existing) {
                existing.resolvedCount += 1;
                existing.timesAsked += 1;
                existing.resolutionRate = existing.resolvedCount / existing.timesAsked;
                if (existing.unresolvedCount > 2) {
                    existing.priority = 'high';
                }
            }
        }
    }
    getUnresolvedGaps(threshold = 3) {
        return [...this.gaps.values()]
            .filter(g => g.unresolvedCount >= threshold)
            .sort((a, b) => b.unresolvedCount - a.unresolvedCount);
    }
    getHighPriorityGaps() {
        return [...this.gaps.values()]
            .filter(g => g.priority === 'high');
    }
    exportGaps() {
        return [...this.gaps.values()];
    }
}
exports.KnowledgeGapDetector = KnowledgeGapDetector;
// ── Response Quality Analyzer ───────────────────────────────────────────────────
class ResponseQualityAnalyzer {
    feedbackHistory = new Map();
    metricsHistory = [];
    recordFeedback(feedback) {
        const existing = this.feedbackHistory.get(feedback.messageId) || [];
        existing.push(feedback);
        this.feedbackHistory.set(feedback.messageId, existing);
    }
    recordMetrics(metrics) {
        this.metricsHistory.push(metrics);
        // Keep only last 10000 metrics
        if (this.metricsHistory.length > 10000) {
            this.metricsHistory = this.metricsHistory.slice(-10000);
        }
    }
    getAverageRating(conversationId) {
        const relevantFeedback = conversationId
            ? [...this.feedbackHistory.values()].flat()
                .filter(f => f.conversationId === conversationId)
            : [...this.feedbackHistory.values()].flat();
        if (relevantFeedback.length === 0)
            return null;
        const withRating = relevantFeedback.filter(f => f.rating !== undefined);
        if (withRating.length === 0)
            return null;
        return withRating.reduce((sum, f) => sum + (f.rating || 0), 0) / withRating.length;
    }
    getHelpfulnessRate() {
        const allFeedback = [...this.feedbackHistory.values()].flat();
        if (allFeedback.length === 0)
            return 0;
        const helpful = allFeedback.filter(f => f.helpful).length;
        return helpful / allFeedback.length;
    }
    getAverageConfidence() {
        if (this.metricsHistory.length === 0)
            return 0;
        return this.metricsHistory.reduce((sum, m) => sum + m.confidence, 0) / this.metricsHistory.length;
    }
    getAverageResponseTime() {
        if (this.metricsHistory.length === 0)
            return 0;
        return this.metricsHistory.reduce((sum, m) => sum + m.responseTime, 0) / this.metricsHistory.length;
    }
    getTopSources() {
        const sourceCounts = {};
        for (const metrics of this.metricsHistory) {
            for (const source of metrics.knowledgeSources) {
                sourceCounts[source] = (sourceCounts[source] || 0) + 1;
            }
        }
        return Object.entries(sourceCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([source]) => source);
    }
    getResolutionRate() {
        const resolved = this.metricsHistory.filter(m => m.resolvedIntent).length;
        return this.metricsHistory.length > 0 ? resolved / this.metricsHistory.length : 0;
    }
    getImprovementAreas() {
        const areas = [];
        const avgConfidence = this.getAverageConfidence();
        if (avgConfidence < 0.7) {
            areas.push('Low confidence - need better context or knowledge base improvements');
        }
        const avgResponseTime = this.getAverageResponseTime();
        if (avgResponseTime > 2000) {
            areas.push('Slow responses - consider caching or optimization');
        }
        const resolutionRate = this.getResolutionRate();
        if (resolutionRate < 0.8) {
            areas.push('Low resolution rate - improve intent detection or response templates');
        }
        const helpfulness = this.getHelpfulnessRate();
        if (helpfulness < 0.7) {
            areas.push('Low helpfulness rating - review response quality');
        }
        return areas;
    }
}
exports.ResponseQualityAnalyzer = ResponseQualityAnalyzer;
// ── Improvement Recommender ─────────────────────────────────────────────────────
class ImprovementRecommender {
    patternAnalyzer;
    gapDetector;
    qualityAnalyzer;
    actions = [];
    constructor(patternAnalyzer, gapDetector, qualityAnalyzer) {
        this.patternAnalyzer = patternAnalyzer;
        this.gapDetector = gapDetector;
        this.qualityAnalyzer = qualityAnalyzer;
    }
    generateRecommendations() {
        const recommendations = [];
        // Check for knowledge gaps
        const gaps = this.gapDetector.getUnresolvedGaps(3);
        for (const gap of gaps) {
            recommendations.push({
                id: `improve_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                type: 'add_knowledge',
                target: gap.category,
                reason: `Unresolved gap detected ${gap.unresolvedCount} times`,
                data: {
                    category: gap.category,
                    industryCategory: gap.industryCategory,
                    questionPattern: gap.questionPattern,
                },
                status: 'pending',
                createdAt: new Date(),
            });
        }
        // Check for failing patterns
        const failingPatterns = this.patternAnalyzer.getFailingPatterns();
        for (const pattern of failingPatterns) {
            recommendations.push({
                id: `improve_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                type: 'update_response',
                target: pattern.intent,
                reason: `Low success rate (${(pattern.successRate * 100).toFixed(1)}%) for intent: ${pattern.intent}`,
                data: {
                    intent: pattern.intent,
                    pattern: pattern.pattern,
                    successRate: pattern.successRate,
                },
                status: 'pending',
                createdAt: new Date(),
            });
        }
        // Check for low confidence patterns
        const lowConfidence = this.patternAnalyzer.getLowConfidencePatterns();
        for (const pattern of lowConfidence) {
            recommendations.push({
                id: `improve_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                type: 'improve_context',
                target: pattern.intent,
                reason: `Low confidence (${(pattern.avgConfidence * 100).toFixed(1)}%) for pattern: ${pattern.pattern}`,
                data: {
                    intent: pattern.intent,
                    pattern: pattern.pattern,
                    avgConfidence: pattern.avgConfidence,
                },
                status: 'pending',
                createdAt: new Date(),
            });
        }
        // Check improvement areas
        const areas = this.qualityAnalyzer.getImprovementAreas();
        for (const area of areas) {
            recommendations.push({
                id: `improve_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                type: 'update_response',
                target: 'general',
                reason: area,
                data: {},
                status: 'pending',
                createdAt: new Date(),
            });
        }
        this.actions = recommendations;
        return recommendations;
    }
    getPendingActions() {
        return this.actions.filter(a => a.status === 'pending');
    }
    approveAction(actionId) {
        const action = this.actions.find(a => a.id === actionId);
        if (action) {
            action.status = 'approved';
        }
    }
    rejectAction(actionId) {
        const action = this.actions.find(a => a.id === actionId);
        if (action) {
            action.status = 'rejected';
        }
    }
    applyAction(actionId) {
        const action = this.actions.find(a => a.id === actionId);
        if (action) {
            action.status = 'applied';
            action.appliedAt = new Date();
        }
    }
}
exports.ImprovementRecommender = ImprovementRecommender;
// ── Conversation Outcome Tracker ─────────────────────────────────────────────────
class ConversationOutcomeTracker {
    outcomes = [];
    startConversation(conversationId, userId, appType, industryCategory, merchantId) {
        this.outcomes.push({
            conversationId,
            userId,
            appType,
            industryCategory,
            merchantId,
            messageCount: 0,
            toolCalls: 0,
            escalations: 0,
            outcome: 'resolved',
            startTime: new Date(),
        });
    }
    incrementMessage(conversationId) {
        const outcome = this.outcomes.find(o => o.conversationId === conversationId);
        if (outcome) {
            outcome.messageCount += 1;
        }
    }
    incrementToolCalls(conversationId) {
        const outcome = this.outcomes.find(o => o.conversationId === conversationId);
        if (outcome) {
            outcome.toolCalls += 1;
        }
    }
    addEscalation(conversationId) {
        const outcome = this.outcomes.find(o => o.conversationId === conversationId);
        if (outcome) {
            outcome.escalations += 1;
            outcome.outcome = 'escalated';
        }
    }
    endConversation(conversationId, outcome) {
        const found = this.outcomes.find(o => o.conversationId === conversationId);
        if (found) {
            found.outcome = outcome;
            found.endTime = new Date();
            found.duration = Math.round((found.endTime.getTime() - found.startTime.getTime()) / 1000);
        }
    }
    getSummary(days = 7) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const recentOutcomes = this.outcomes.filter(o => o.startTime >= cutoff);
        const total = recentOutcomes.length;
        const resolved = recentOutcomes.filter(o => o.outcome === 'resolved').length;
        const escalated = recentOutcomes.filter(o => o.outcome === 'escalated').length;
        const abandoned = recentOutcomes.filter(o => o.outcome === 'abandoned').length;
        const avgDuration = total > 0
            ? recentOutcomes.reduce((sum, o) => sum + (o.duration || 0), 0) / total
            : 0;
        // Calculate top intents from patterns
        const intentCounts = {};
        const toolCounts = {};
        return {
            period: { start: cutoff, end: new Date() },
            totalConversations: total,
            resolvedConversations: resolved,
            escalatedConversations: escalated,
            abandonedConversations: abandoned,
            avgResolutionRate: total > 0 ? resolved / total : 0,
            avgResponseTime: avgDuration * 1000,
            avgConfidence: 0,
            topIntents: Object.entries(intentCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([intent, count]) => ({ intent, count })),
            topTools: Object.entries(toolCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([tool, count]) => ({ tool, count })),
            knowledgeGaps: [],
            improvementActions: [],
        };
    }
    getOutcomes() {
        return this.outcomes;
    }
}
exports.ConversationOutcomeTracker = ConversationOutcomeTracker;
// ── Main Learning System ────────────────────────────────────────────────────────
class LearningSystem {
    patternAnalyzer;
    gapDetector;
    qualityAnalyzer;
    recommender;
    outcomeTracker;
    config;
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.patternAnalyzer = new PatternAnalyzer();
        this.gapDetector = new KnowledgeGapDetector();
        this.qualityAnalyzer = new ResponseQualityAnalyzer();
        this.recommender = new ImprovementRecommender(this.patternAnalyzer, this.gapDetector, this.qualityAnalyzer);
        this.outcomeTracker = new ConversationOutcomeTracker();
    }
    analyzeAndLearn(userMessage, aiResponse, context, metrics) {
        const intentResult = detectIntent(userMessage);
        const keywords = extractKeywords(userMessage);
        // Record metrics
        this.qualityAnalyzer.recordMetrics({
            messageId: `msg_${Date.now()}`,
            conversationId: context.customerId,
            confidence: metrics.confidence,
            responseTime: metrics.responseTime,
            toolUsed: metrics.toolUsed || false,
            toolName: metrics.toolName,
            knowledgeSources: metrics.knowledgeSources,
            keywordsMatched: keywords,
            resolvedIntent: metrics.resolved || false,
            timestamp: new Date(),
        });
        // Analyze patterns
        this.patternAnalyzer.addInteraction(userMessage, intentResult.intent, 'general', metrics.resolved || false, metrics.confidence, metrics.toolName, context.preferences?.industryCategory);
        // Detect knowledge gaps
        this.gapDetector.detectGap(userMessage, intentResult.intent, metrics.resolved || false, context.preferences?.industryCategory);
    }
    recordFeedback(feedback) {
        this.qualityAnalyzer.recordFeedback(feedback);
    }
    getAnalytics(days = 7) {
        const summary = this.outcomeTracker.getSummary(days);
        summary.avgConfidence = this.qualityAnalyzer.getAverageConfidence();
        summary.improvementActions = this.recommender.generateRecommendations();
        return summary;
    }
    getRecommendations() {
        return this.recommender.generateRecommendations();
    }
    getTopPatterns(count = 10) {
        return this.patternAnalyzer.getTopPatterns(count);
    }
    getKnowledgeGaps() {
        return this.gapDetector.getUnresolvedGaps(this.config.knowledgeGapThreshold);
    }
    getImprovementAreas() {
        return this.qualityAnalyzer.getImprovementAreas();
    }
    startConversation(conversationId, userId, appType, industryCategory, merchantId) {
        this.outcomeTracker.startConversation(conversationId, userId, appType, industryCategory, merchantId);
    }
    incrementMessageCount(conversationId) {
        this.outcomeTracker.incrementMessage(conversationId);
    }
    recordEscalation(conversationId) {
        this.outcomeTracker.addEscalation(conversationId);
    }
    endConversation(conversationId, outcome) {
        this.outcomeTracker.endConversation(conversationId, outcome);
    }
    exportPatterns() {
        return this.patternAnalyzer.exportPatterns();
    }
    importPatterns(patterns) {
        this.patternAnalyzer.importPatterns(patterns);
    }
}
exports.LearningSystem = LearningSystem;
// ── Singleton Instance ─────────────────────────────────────────────────────────
let learningSystemInstance = null;
function getLearningSystem() {
    if (!learningSystemInstance) {
        learningSystemInstance = new LearningSystem();
    }
    return learningSystemInstance;
}
function resetLearningSystem() {
    learningSystemInstance = null;
}
//# sourceMappingURL=learningEngine.js.map