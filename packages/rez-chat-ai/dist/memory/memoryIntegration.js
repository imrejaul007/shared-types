"use strict";
// ── Shared Memory Integration ─────────────────────────────────────────────────────
// Connects AgentMemory to AI Chat for cross-app context
// Uses local types to avoid dependency issues
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
exports.getMemoryService = getMemoryService;
exports.initializeMemoryService = initializeMemoryService;
const logger_1 = require("../logger");
const rez_intent_graph_1 = require("rez-intent-graph");
// ── Simple In-Memory Store (for when external memory isn't available) ─────────────
class SimpleMemoryStore {
    preferences = new Map();
    signals = new Map();
    contexts = new Map();
    _cachedAt = new Map();
    _signals = new Map();
    async setPreference(userId, pref) {
        const userPrefs = this.preferences.get(userId) || [];
        const existingIndex = userPrefs.findIndex(p => p.category === pref.category && p.key === pref.key);
        const newPref = {
            ...pref,
            id: `pref_${Date.now()}`,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (existingIndex >= 0) {
            userPrefs[existingIndex] = newPref;
        }
        else {
            userPrefs.push(newPref);
        }
        this.preferences.set(userId, userPrefs);
    }
    async getPreferences(userId, _categories) {
        return this.preferences.get(userId) || [];
    }
    async getSignals(userId) {
        const cached = this.signals.get(userId);
        if (cached)
            return cached;
        return {
            userId,
            engagementScore: 50,
            satisfactionScore: 50,
            churnRisk: 'low',
            lifetimeValue: 0,
            preferredChannels: ['in_app'],
            tier: 'bronze',
            lastActive: new Date().toISOString(),
            activeApps: [],
        };
    }
    async updateSignals(userId, signals) {
        const current = await this.getSignals(userId);
        const updated = { ...current, ...signals, userId };
        this.signals.set(userId, updated);
    }
    async getUserContext(userId) {
        const preferences = await this.getPreferences(userId);
        const signals = await this.getSignals(userId);
        return {
            userId,
            preferences,
            signals,
            recentContext: this.contexts.get(userId) || [],
            sharedKnowledge: [],
        };
    }
    async addToContext(userId, appType, message) {
        const convId = `${appType}:${Date.now()}`;
        const contexts = this.contexts.get(userId) || [];
        let conversation = contexts.find(c => c.appType === appType);
        if (!conversation) {
            conversation = {
                userId,
                appType,
                conversationId: convId,
                messages: [],
                pendingIntents: [],
                lastActive: new Date().toISOString(),
            };
            contexts.push(conversation);
        }
        conversation.messages.push({
            ...message,
            timestamp: new Date().toISOString(),
        });
        conversation.lastActive = new Date().toISOString();
        // Keep only last 20 messages
        if (conversation.messages.length > 20) {
            conversation.messages = conversation.messages.slice(-20);
        }
        this.contexts.set(userId, contexts);
    }
    async logIntent(userId, appType, intent, _outcome) {
        logger_1.logger.debug('[Memory] Intent logged', { userId, appType, intent: intent.category });
        // Learn high-confidence preferences
        if (intent.confidence > 0.8) {
            await this.setPreference(userId, {
                category: intent.category,
                key: intent.specific,
                value: intent.specific,
                confidence: intent.confidence * 0.5,
                source: 'inferred',
            });
        }
    }
    async setSignal(userId, signalKey, value) {
        const signals = this._signals.get(userId) || {};
        signals[signalKey] = value;
        this._signals.set(userId, signals);
    }
    getSignal(userId, signalKey) {
        const signals = this._signals.get(userId) || {};
        return signals[signalKey];
    }
    async clearUserCache(userId) {
        this.preferences.delete(userId);
        this.signals.delete(userId);
        this.contexts.delete(userId);
        this._cachedAt.delete(userId);
    }
}
// ── Memory Service ────────────────────────────────────────────────────────────────
class MemoryService {
    store;
    userContexts = new Map();
    contextTTL = 5 * 60 * 1000; // 5 minutes
    constructor(_config) {
        this.store = new SimpleMemoryStore();
        logger_1.logger.info('[MemoryService] Initialized with in-memory store');
    }
    /**
     * Get enriched customer context from shared memory
     */
    async getCustomerContext(userId, appType) {
        const cacheKey = `${userId}:${appType}`;
        const cached = this.userContexts.get(cacheKey);
        if (cached && Date.now() - cached._cachedAt < this.contextTTL) {
            logger_1.logger.debug('[MemoryService] Using cached context', { userId, appType });
            return this.toCustomerContext(cached);
        }
        try {
            const context = await this.store.getUserContext(userId);
            context._cachedAt = Date.now();
            // Enrich from intent graph
            await this.enrichFromIntentGraph(userId);
            this.userContexts.set(cacheKey, context);
            logger_1.logger.info('[MemoryService] Loaded context', {
                userId,
                appType,
                preferences: context.preferences.length,
                tier: context.signals.tier,
            });
            return this.toCustomerContext(context);
        }
        catch (error) {
            logger_1.logger.error('[MemoryService] Failed to load context', { userId, error });
            return { customerId: userId };
        }
    }
    /**
     * Enrich in-memory store with data from the intent graph
     */
    async enrichFromIntentGraph(userId) {
        try {
            const enriched = await rez_intent_graph_1.crossAppAggregationService.getEnrichedContext(userId);
            if (!enriched)
                return;
            // Compute dominant category from affinities (not stored on profile)
            if (enriched.crossAppProfile) {
                const { travelAffinity, diningAffinity, retailAffinity } = enriched.crossAppProfile;
                const dominantCategory = travelAffinity >= diningAffinity && travelAffinity >= retailAffinity
                    ? 'TRAVEL'
                    : diningAffinity >= retailAffinity
                        ? 'DINING'
                        : 'RETAIL';
                await this.store.setPreference(userId, {
                    category: 'general',
                    key: 'dominantCategory',
                    value: dominantCategory,
                    confidence: 0.8,
                    source: 'behavior',
                });
            }
            // Store affinities as individual preferences
            if (enriched.crossAppProfile) {
                await this.store.setPreference(userId, {
                    category: 'general',
                    key: 'travelAffinity',
                    value: enriched.crossAppProfile.travelAffinity,
                    confidence: 0.7,
                    source: 'behavior',
                });
                await this.store.setPreference(userId, {
                    category: 'general',
                    key: 'diningAffinity',
                    value: enriched.crossAppProfile.diningAffinity,
                    confidence: 0.7,
                    source: 'behavior',
                });
                await this.store.setPreference(userId, {
                    category: 'general',
                    key: 'retailAffinity',
                    value: enriched.crossAppProfile.retailAffinity,
                    confidence: 0.7,
                    source: 'behavior',
                });
            }
            // Store top dormant intent as a signal
            if (enriched.dormantIntents?.length > 0) {
                const topDormant = enriched.dormantIntents[0];
                await this.store.setSignal(userId, 'topDormantIntent', {
                    key: topDormant.key,
                    category: topDormant.category,
                    revivalScore: topDormant.revivalScore,
                    daysDormant: topDormant.daysDormant,
                });
            }
        }
        catch (err) {
            logger_1.logger.debug('[MemoryService] Intent graph enrichment failed:', err);
        }
    }
    /**
     * Update user preferences based on interaction
     */
    async learnPreference(userId, category, key, value, confidence = 0.7, source = 'inferred') {
        try {
            await this.store.setPreference(userId, {
                category,
                key,
                value: value,
                confidence,
                source,
            });
            // Invalidate cache
            this.userContexts.forEach((_, key) => {
                if (key.startsWith(userId)) {
                    this.userContexts.delete(key);
                }
            });
            logger_1.logger.debug('[MemoryService] Learned preference', { userId, category, key, confidence });
        }
        catch (error) {
            logger_1.logger.error('[MemoryService] Failed to learn preference', { userId, error });
        }
    }
    /**
     * Log an intent for the intent graph
     */
    async logIntent(userId, appType, intent, outcome) {
        try {
            await this.store.logIntent(userId, appType, intent, outcome);
            logger_1.logger.debug('[MemoryService] Logged intent', { userId, appType, intent: intent.category });
        }
        catch (error) {
            logger_1.logger.error('[MemoryService] Failed to log intent', { userId, error });
        }
    }
    /**
     * Update user signals based on interaction
     */
    async updateSignals(userId, signals) {
        try {
            await this.store.updateSignals(userId, signals);
            logger_1.logger.debug('[MemoryService] Updated signals', { userId, signals });
        }
        catch (error) {
            logger_1.logger.error('[MemoryService] Failed to update signals', { userId, error });
        }
    }
    /**
     * Add message to conversation context
     */
    async addToContext(userId, appType, message) {
        try {
            await this.store.addToContext(userId, appType, message);
            logger_1.logger.debug('[MemoryService] Added to context', { userId, appType, role: message.role });
        }
        catch (error) {
            logger_1.logger.error('[MemoryService] Failed to add to context', { userId, error });
        }
    }
    /**
     * Get relevant preferences for a specific app
     */
    async getRelevantPreferences(userId, _categories) {
        try {
            return await this.store.getPreferences(userId);
        }
        catch (error) {
            logger_1.logger.error('[MemoryService] Failed to get preferences', { userId, error });
            return [];
        }
    }
    /**
     * Get user signals (tier, engagement, etc.)
     */
    async getUserSignals(userId) {
        try {
            return await this.store.getSignals(userId);
        }
        catch (error) {
            logger_1.logger.error('[MemoryService] Failed to get signals', { userId, error });
            return null;
        }
    }
    /**
     * Clear user cache
     */
    async clearUserCache(userId) {
        this.userContexts.forEach((_, key) => {
            if (key.startsWith(userId)) {
                this.userContexts.delete(key);
            }
        });
        await this.store.clearUserCache(userId);
        logger_1.logger.info('[MemoryService] Cleared cache', { userId });
    }
    /**
     * Convert CrossAppContext to CustomerContext for AI handler
     */
    toCustomerContext(context) {
        return {
            customerId: context.userId,
            name: this.extractPreference(context.preferences, 'name'),
            email: this.extractPreference(context.preferences, 'email'),
            phone: this.extractPreference(context.preferences, 'phone'),
            tier: context.signals.tier,
            preferences: {
                karmaPoints: context.signals.lifetimeValue,
                defaultAddress: this.extractPreference(context.preferences, 'defaultAddress'),
                dietaryRestrictions: this.extractPreference(context.preferences, 'dietaryRestrictions'),
                roomPreferences: this.extractPreference(context.preferences, 'roomPreferences'),
                favoriteCuisine: this.extractPreference(context.preferences, 'favoriteCuisine'),
                ...Object.fromEntries(context.preferences.map((p) => [p.key, p.value])),
            },
            recentOrders: context.recentContext
                .filter((c) => c.appType !== 'general')
                .slice(0, 5)
                .map((c) => ({
                orderId: c.conversationId,
                type: 'restaurant_order',
                status: 'completed',
                total: 0,
                date: new Date(c.lastActive),
            })),
            activeApps: context.signals.activeApps,
        };
    }
    extractPreference(preferences, key) {
        const pref = preferences.find(p => p.key === key);
        return pref?.value;
    }
}
exports.MemoryService = MemoryService;
// ── Default Instance ─────────────────────────────────────────────────────────────
let memoryServiceInstance = null;
function getMemoryService() {
    if (!memoryServiceInstance) {
        memoryServiceInstance = new MemoryService({});
    }
    return memoryServiceInstance;
}
function initializeMemoryService(config) {
    memoryServiceInstance = new MemoryService(config);
    return memoryServiceInstance;
}
exports.default = MemoryService;
//# sourceMappingURL=memoryIntegration.js.map