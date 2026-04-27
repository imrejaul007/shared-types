// ── Autonomous Chat Service ─────────────────────────────────────────────────────────
// Phase 7: ReZ Chat communicates autonomously with consumers
// Uses merchant knowledge + user intent context for personalized responses
import { merchantKnowledgeService } from '../integrations/merchantKnowledge.js';
import { intentGraphMemory } from '../integrations/agentOsIntegration.js';
import { sharedMemory } from '../agents/shared-memory.js';
// ── Response Templates ─────────────────────────────────────────────────────────────
const RESPONSE_TEMPLATES = {
    greeting: [
        "Hi! I'm here to help. What would you like to know about {merchant}?",
        "Welcome! Ask me anything about {merchant} or browse our menu and offers.",
        "Hello! I can help with orders, menu questions, or anything about {merchant}.",
    ],
    menu: [
        "Here's what we offer at {merchant}: {content}",
        "Our menu includes: {content}. Would you like to order?",
        "I'd be happy to share our menu! {content}",
    ],
    order: [
        "I can help you place an order! {content}",
        "Ready to order? {content}",
        "Let me help you with your order. {content}",
    ],
    offer: [
        "Great choice! {content}",
        "We have a special offer for you: {content}",
        "You're making a smart choice! {content}",
    ],
    follow_up: [
        "Is there anything else I can help you with?",
        "Would you like to know more about anything else?",
        "Feel free to ask if you have other questions!",
    ],
    no_knowledge: [
        "I don't have specific information about that. Would you like me to connect you with our team?",
        "That's outside my knowledge base. Let me note that for our team to address.",
        "I'm not sure about that. Would you like to speak with our staff?",
    ],
};
// ── Autonomous Chat Service ───────────────────────────────────────────────────────
export class AutonomousChatService {
    /**
     * Process user message and generate autonomous response
     */
    async processMessage(params) {
        const sessionId = params.sessionId || `session_${Date.now()}`;
        // Get or create session
        let session = await this.getSession(sessionId);
        if (!session) {
            session = await this.createSession(params.userId, params.merchantId, sessionId);
        }
        // Build context from merchant knowledge + user intents
        const context = await this.buildContext(params.userId, params.merchantId, session.messages);
        // Add user message to session
        const userMessage = {
            id: `msg_${Date.now()}_user`,
            role: 'user',
            content: params.message,
            timestamp: new Date(),
        };
        session.messages.push(userMessage);
        // Analyze intent from user message
        const intent = this.analyzeUserIntent(params.message);
        // Find relevant knowledge
        const relevantKnowledge = await this.findRelevantKnowledge(params.merchantId, params.message, intent);
        // Generate response using context
        const response = await this.generateResponse({
            context,
            intent,
            relevantKnowledge,
            userMessage: params.message,
        });
        // Add assistant message to session
        const assistantMessage = {
            id: `msg_${Date.now()}_assistant`,
            role: 'assistant',
            content: response.message.content,
            timestamp: new Date(),
            metadata: {
                merchantId: params.merchantId,
                intentKey: intent.category,
                confidence: response.contextUsed ? 0.85 : 0.5,
            },
        };
        session.messages.push(assistantMessage);
        session.lastActivity = new Date();
        // Save session
        await this.saveSession(session);
        // Publish chat event
        await this.publishChatEvent(params.userId, params.merchantId, intent, response);
        return {
            message: assistantMessage,
            suggestions: response.suggestions,
            actions: response.actions,
            contextUsed: response.contextUsed,
        };
    }
    /**
     * Build context from various sources
     */
    async buildContext(userId, merchantId, history = []) {
        // Get user intents from ReZ Mind
        let userIntents = [];
        let userPreferences = {};
        try {
            const context = await intentGraphMemory.enrichContext(userId);
            userIntents = context.activeIntents.map((i) => i.intentKey);
            userPreferences = {
                affinities: context.affinities,
                recentActivity: context.recentActivity.length,
            };
        }
        catch {
            // Ignore if user context not available
        }
        // Get merchant knowledge if merchantId provided
        let merchantKnowledge = [];
        if (merchantId) {
            const knowledgeBase = await merchantKnowledgeService.getKnowledgeBase(merchantId);
            merchantKnowledge = knowledgeBase?.entries || [];
        }
        return {
            userId,
            merchantId,
            merchantKnowledge,
            userIntents,
            recentOrders: [],
            preferences: userPreferences,
            conversationHistory: history.slice(-5), // Last 5 messages
        };
    }
    /**
     * Analyze user message intent
     */
    analyzeUserIntent(message) {
        const lower = message.toLowerCase();
        // Intent categories
        if (lower.includes('menu') || lower.includes('dish') || lower.includes('food') || lower.includes('order')) {
            return { category: 'menu', action: 'inquiry', entities: this.extractEntities(message) };
        }
        if (lower.includes('price') || lower.includes('cost') || lower.includes('cheap') || lower.includes('affordable')) {
            return { category: 'pricing', action: 'inquiry', entities: this.extractEntities(message) };
        }
        if (lower.includes('hour') || lower.includes('open') || lower.includes('close') || lower.includes('time')) {
            return { category: 'hours', action: 'inquiry', entities: this.extractEntities(message) };
        }
        if (lower.includes('book') || lower.includes('reservation') || lower.includes('table')) {
            return { category: 'booking', action: 'booking', entities: this.extractEntities(message) };
        }
        if (lower.includes('offer') || lower.includes('discount') || lower.includes('deal') || lower.includes('special')) {
            return { category: 'offer', action: 'inquiry', entities: this.extractEntities(message) };
        }
        if (lower.includes('location') || lower.includes('address') || lower.includes('where') || lower.includes('directions')) {
            return { category: 'location', action: 'inquiry', entities: this.extractEntities(message) };
        }
        if (lower.includes('help') || lower.includes('support') || lower.includes('question')) {
            return { category: 'support', action: 'help', entities: this.extractEntities(message) };
        }
        return { category: 'general', action: 'chat', entities: this.extractEntities(message) };
    }
    /**
     * Extract entities from message
     */
    extractEntities(message) {
        // Simple entity extraction - in production use NER
        const words = message.split(/\s+/);
        return words.filter((w) => w.length > 3);
    }
    /**
     * Find relevant knowledge entries
     */
    async findRelevantKnowledge(merchantId, query, intent) {
        if (!merchantId)
            return [];
        try {
            // Search by query first
            const byQuery = await merchantKnowledgeService.searchKnowledge({
                merchantId,
                query,
                limit: 5,
            });
            // If no results, try category
            const byCategory = byQuery.length === 0
                ? await merchantKnowledgeService.searchKnowledge({
                    merchantId,
                    query: intent.category, // Use category as fallback query
                    category: intent.category,
                    limit: 3,
                })
                : [];
            // Combine and dedupe
            const seen = new Set();
            const combined = [];
            for (const entry of [...byCategory, ...byQuery]) {
                if (!seen.has(entry.id)) {
                    seen.add(entry.id);
                    combined.push(entry);
                }
            }
            return combined;
        }
        catch {
            return [];
        }
    }
    /**
     * Generate response using context and knowledge
     */
    async generateResponse(params) {
        const { context, intent, relevantKnowledge } = params;
        // Check if we have relevant knowledge
        if (relevantKnowledge.length === 0) {
            return {
                message: {
                    id: `msg_${Date.now()}`,
                    role: 'assistant',
                    content: this.getRandomTemplate('no_knowledge'),
                    timestamp: new Date(),
                },
                suggestions: ['Talk to a human', 'Leave feedback', 'Browse menu'],
                actions: [],
                contextUsed: false,
            };
        }
        // Build response content from knowledge
        const knowledgeContent = relevantKnowledge
            .slice(0, 2)
            .map((k) => `${k.title}: ${k.content}`)
            .join(' | ');
        // Determine response type
        let responseType = 'follow_up';
        if (intent.category === 'menu')
            responseType = 'menu';
        if (intent.category === 'booking')
            responseType = 'order';
        if (intent.category === 'offer')
            responseType = 'offer';
        if (intent.category === 'general')
            responseType = 'greeting';
        // Get template
        let content = this.getTemplate(responseType, { content: knowledgeContent, merchant: 'our restaurant' });
        // Add personalization if we have user context
        if (context.userIntents.length > 0) {
            const relatedIntent = context.userIntents.find((i) => i.toLowerCase().includes(intent.category.toLowerCase()));
            if (relatedIntent) {
                content += " I noticed you were interested in this before!";
            }
        }
        // Generate suggestions
        const suggestions = this.generateSuggestions(intent.category, relevantKnowledge);
        // Generate actions
        const actions = this.generateActions(intent.category);
        return {
            message: {
                id: `msg_${Date.now()}`,
                role: 'assistant',
                content,
                timestamp: new Date(),
                metadata: {
                    intentKey: intent.category,
                    confidence: relevantKnowledge.length > 0 ? 0.85 : 0.5,
                },
            },
            suggestions,
            actions,
            contextUsed: true,
        };
    }
    /**
     * Get random template
     */
    getRandomTemplate(type) {
        const templates = RESPONSE_TEMPLATES[type];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    /**
     * Get template with variables
     */
    getTemplate(type, vars) {
        let template = this.getRandomTemplate(type);
        for (const [key, value] of Object.entries(vars)) {
            template = template.replace(`{${key}}`, value);
        }
        return template;
    }
    /**
     * Generate suggestions based on context
     */
    generateSuggestions(category, knowledge) {
        const suggestions = [];
        if (category === 'menu' || knowledge.some((k) => k.type === 'menu')) {
            suggestions.push('Show me the full menu');
            suggestions.push('What are your best sellers?');
        }
        if (category === 'offer' || knowledge.some((k) => k.type === 'offer')) {
            suggestions.push('Show me current offers');
            suggestions.push('How do I redeem this?');
        }
        if (category === 'hours' || knowledge.some((k) => k.type === 'hours')) {
            suggestions.push('What are your hours?');
            suggestions.push('Are you open now?');
        }
        suggestions.push('Place an order');
        suggestions.push('Talk to staff');
        return suggestions.slice(0, 4);
    }
    /**
     * Generate suggested actions
     */
    generateActions(category) {
        switch (category) {
            case 'menu':
                return ['view_menu', 'add_to_cart'];
            case 'booking':
                return ['create_reservation'];
            case 'offer':
                return ['apply_offer', 'view_offers'];
            default:
                return ['create_order'];
        }
    }
    /**
     * Session management
     */
    async getSession(sessionId) {
        try {
            const session = await sharedMemory.get(`chat:session:${sessionId}`);
            return session;
        }
        catch {
            return null;
        }
    }
    async createSession(userId, merchantId, sessionId) {
        const session = {
            id: sessionId,
            userId,
            merchantId,
            messages: [],
            createdAt: new Date(),
            lastActivity: new Date(),
        };
        await this.saveSession(session);
        return session;
    }
    async saveSession(session) {
        await sharedMemory.set(`chat:session:${session.id}`, session, 3600); // 1 hour
    }
    /**
     * Publish chat event for analytics
     */
    async publishChatEvent(userId, merchantId, intent, response) {
        await sharedMemory.publish({
            from: 'autonomous-chat',
            to: 'analytics',
            type: 'notification',
            payload: {
                userId,
                merchantId,
                intent: intent.category,
                action: intent.action,
                contextUsed: response.contextUsed,
                timestamp: new Date(),
            },
            timestamp: new Date(),
        });
        // Record metrics
        await sharedMemory.publish({
            from: 'autonomous-chat',
            to: 'metrics',
            type: 'signal',
            payload: {
                event: response.contextUsed ? 'chat_with_context' : 'chat_without_context',
                intent: intent.category,
            },
            timestamp: new Date(),
        });
    }
    /**
     * Get chat history for a user
     */
    async getChatHistory(userId, limit = 10) {
        // In production, query from database
        return [];
    }
    /**
     * End chat session
     */
    async endSession(sessionId) {
        await sharedMemory.delete(`chat:session:${sessionId}`);
    }
}
// ── Singleton ─────────────────────────────────────────────────────────────────────
export const autonomousChatService = new AutonomousChatService();
//# sourceMappingURL=autonomousChat.js.map