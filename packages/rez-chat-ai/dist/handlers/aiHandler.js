"use strict";
// ── AI Message Handler ───────────────────────────────────────────────────────────
// Handles AI-powered chat responses with knowledge base integration
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIChatHandler = exports.BOOKING_TOOLS = void 0;
exports.createAIHandler = createAIHandler;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const providers_1 = require("../knowledge/providers");
const sanitize_1 = require("../sanitizers/sanitize");
const analytics_1 = require("../analytics");
const commerceMemoryContext_1 = require("../memory/commerceMemoryContext");
const rez_intent_graph_1 = require("rez-intent-graph");
const logger_1 = require("../logger");
// ── Intent Capture from Chat ───────────────────────────────────────────────────
async function captureIntentFromChat(userId, message, _response) {
    const lower = message.toLowerCase();
    // Detect hotel/travel intent
    const hotelKeywords = [
        'hotel', 'stay', 'room', 'book', 'travel', 'trip',
        'goa', 'mumbai', 'bangalore', 'delhi', 'checkout', 'checkin'
    ];
    if (hotelKeywords.some(k => lower.includes(k))) {
        const intentKey = `chat_${Date.now()}_hotel_${message.substring(0, 50).replace(/\s+/g, '_')}`;
        rez_intent_graph_1.intentCaptureService.capture({
            userId,
            appType: 'chat_ai',
            eventType: 'search',
            category: 'TRAVEL',
            intentKey,
            metadata: { message: message.substring(0, 200), channel: 'chat' },
        }).catch(() => { });
    }
    // Detect dining/restaurant intent
    const diningKeywords = [
        'restaurant', 'food', 'dinner', 'lunch', 'cafe',
        'order', 'eat', 'meal', 'biryani', 'pizza', 'menu'
    ];
    if (diningKeywords.some(k => lower.includes(k))) {
        const intentKey = `chat_${Date.now()}_dining_${message.substring(0, 50).replace(/\s+/g, '_')}`;
        rez_intent_graph_1.intentCaptureService.capture({
            userId,
            appType: 'chat_ai',
            eventType: 'search',
            category: 'DINING',
            intentKey,
            metadata: { message: message.substring(0, 200), channel: 'chat' },
        }).catch(() => { });
    }
    // Detect retail/shopping intent
    const retailKeywords = ['buy', 'shop', 'product', 'price', 'discount', 'clothes', 'shoes'];
    if (retailKeywords.some(k => lower.includes(k))) {
        const intentKey = `chat_${Date.now()}_retail_${message.substring(0, 50).replace(/\s+/g, '_')}`;
        rez_intent_graph_1.intentCaptureService.capture({
            userId,
            appType: 'chat_ai',
            eventType: 'search',
            category: 'RETAIL',
            intentKey,
            metadata: { message: message.substring(0, 200), channel: 'chat' },
        }).catch(() => { });
    }
}
function getDominantAffinity(profile) {
    const { travelAffinity, diningAffinity, retailAffinity } = profile;
    const max = Math.max(travelAffinity, diningAffinity, retailAffinity);
    if (max === travelAffinity)
        return 'TRAVEL';
    if (max === diningAffinity)
        return 'DINING';
    if (max === retailAffinity)
        return 'RETAIL';
    return 'MIXED';
}
function buildPromptWithIntentGraph(ctx) {
    let prompt = ctx.customerInfo;
    if (ctx.knowledgeContext) {
        prompt += '\n' + ctx.knowledgeContext;
    }
    if (ctx.historyContext) {
        prompt += '\n' + ctx.historyContext;
    }
    if (ctx.intentGraph) {
        const ig = ctx.intentGraph;
        if (ig.activeIntents.length > 0) {
            prompt += '\n\n### User\'s Active Interests:\n';
            ig.activeIntents.forEach(i => {
                prompt += `- ${i.category}: ${i.key} (confidence: ${i.confidence.toFixed(2)}, ${i.lastSeen})\n`;
            });
        }
        if (ig.dormantIntents.length > 0) {
            prompt += '\n### Dormant Interests (potential nudges):\n';
            ig.dormantIntents.slice(0, 3).forEach(d => {
                prompt += `- ${d.category}: ${d.key} (revival score: ${d.revivalScore.toFixed(2)}, ${d.daysDormant}d dormant)\n`;
            });
        }
        if (ig.profile?.dominantCategory) {
            prompt += `\n### User Profile: Primary interest in ${ig.profile.dominantCategory}\n`;
        }
    }
    return prompt;
}
exports.BOOKING_TOOLS = [
    {
        name: 'create_hotel_booking',
        description: 'Create a new hotel reservation',
        parameters: {
            checkIn: { type: 'string', description: 'Check-in date (YYYY-MM-DD)', required: true },
            checkOut: { type: 'string', description: 'Check-out date (YYYY-MM-DD)', required: true },
            roomType: { type: 'string', description: 'Room type preference', required: false },
            guests: { type: 'number', description: 'Number of guests', required: true },
            specialRequests: { type: 'string', description: 'Special requests or preferences', required: false },
        },
        execute: async (params, context) => {
            // Placeholder - actual implementation would call hotel PMS API
            return {
                success: true,
                data: {
                    bookingId: `BK${Date.now()}`,
                    status: 'pending',
                    message: `Reservation request received for ${context.name || 'guest'}. ${params.guests} guest(s), ${params.checkIn} to ${params.checkOut}`,
                },
            };
        },
    },
    {
        name: 'create_restaurant_reservation',
        description: 'Create a restaurant reservation',
        parameters: {
            date: { type: 'string', description: 'Reservation date (YYYY-MM-DD)', required: true },
            time: { type: 'string', description: 'Reservation time (HH:MM)', required: true },
            partySize: { type: 'number', description: 'Number of guests', required: true },
            seatingPreference: { type: 'string', description: 'Indoor, outdoor, or private', required: false },
            occasion: { type: 'string', description: 'Special occasion if any', required: false },
        },
        execute: async (params, context) => {
            // Placeholder - actual implementation would call restaurant API
            return {
                success: true,
                data: {
                    reservationId: `RES${Date.now()}`,
                    status: 'confirmed',
                    message: `Table reserved for ${context.name || 'guest'} on ${params.date} at ${params.time} for ${params.partySize} guest(s)`,
                },
            };
        },
    },
    {
        name: 'place_order',
        description: 'Place a new order for delivery or pickup',
        parameters: {
            items: { type: 'array', description: 'Array of {itemId, quantity, notes}', required: true },
            deliveryAddress: { type: 'string', description: 'Delivery address', required: false },
            pickupTime: { type: 'string', description: 'Preferred pickup time (HH:MM)', required: false },
            specialInstructions: { type: 'string', description: 'Special instructions for order', required: false },
        },
        execute: async (params, context) => {
            // Placeholder - actual implementation would call order API
            return {
                success: true,
                data: {
                    orderId: `ORD${Date.now()}`,
                    status: 'received',
                    estimatedTime: '30-45 minutes',
                    message: `Order placed for ${context.name || 'guest'}. Estimated delivery/pickup: 30-45 minutes`,
                },
            };
        },
    },
    {
        name: 'modify_booking',
        description: 'Modify an existing reservation',
        parameters: {
            bookingId: { type: 'string', description: 'Booking or reservation ID', required: true },
            modifications: { type: 'object', description: 'Fields to modify', required: true },
        },
        execute: async (params, context) => {
            // Placeholder
            return {
                success: true,
                data: {
                    bookingId: params.bookingId,
                    status: 'updated',
                    message: `Booking ${params.bookingId} has been updated`,
                },
            };
        },
    },
    {
        name: 'cancel_booking',
        description: 'Cancel an existing reservation',
        parameters: {
            bookingId: { type: 'string', description: 'Booking or reservation ID to cancel', required: true },
            reason: { type: 'string', description: 'Reason for cancellation', required: false },
        },
        execute: async (params, context) => {
            // Placeholder
            return {
                success: true,
                data: {
                    bookingId: params.bookingId,
                    status: 'cancelled',
                    message: `Booking ${params.bookingId} has been cancelled`,
                },
            };
        },
    },
    {
        name: 'get_order_status',
        description: 'Check the status of an order',
        parameters: {
            orderId: { type: 'string', description: 'Order ID to check', required: true },
        },
        execute: async (params) => {
            // Placeholder
            return {
                success: true,
                data: {
                    orderId: params.orderId,
                    status: 'preparing',
                    estimatedTime: '15-20 minutes',
                    message: `Order ${params.orderId} is being prepared`,
                },
            };
        },
    },
    {
        name: 'escalate_to_staff',
        description: 'Transfer conversation to human staff member',
        parameters: {
            reason: { type: 'string', description: 'Reason for escalation', required: true },
            department: { type: 'string', description: 'Department (front_desk, concierge, support, etc.)', required: false },
            priority: { type: 'string', description: 'Priority level: normal, high, urgent', required: false },
        },
        execute: async (params) => {
            return {
                success: true,
                data: {
                    escalated: true,
                    reason: params.reason,
                    department: params.department || 'support',
                    message: 'Connecting you with a staff member. Please hold...',
                },
            };
        },
    },
    {
        name: 'request_room_service',
        description: 'Request room service',
        parameters: {
            items: { type: 'array', description: 'Array of {itemId, quantity}', required: true },
            deliveryTime: { type: 'string', description: 'Requested delivery time (HH:MM) or "asap"', required: true },
            specialRequests: { type: 'string', description: 'Special instructions', required: false },
        },
        execute: async (params, context) => {
            return {
                success: true,
                data: {
                    requestId: `RS${Date.now()}`,
                    status: 'confirmed',
                    estimatedDelivery: params.deliveryTime === 'asap' ? '20-30 minutes' : params.deliveryTime,
                    message: `Room service order confirmed for ${context.name || 'guest'}`,
                },
            };
        },
    },
    {
        name: 'request_housekeeping',
        description: 'Request housekeeping service',
        parameters: {
            serviceType: { type: 'string', description: 'Type: regular_clean, deep_clean, towels, toiletries, turndown', required: true },
            preferredTime: { type: 'string', description: 'Preferred time (HH:MM) or "asap"', required: false },
            notes: { type: 'string', description: 'Additional notes', required: false },
        },
        execute: async (params, context) => {
            return {
                success: true,
                data: {
                    requestId: `HK${Date.now()}`,
                    status: 'scheduled',
                    serviceType: params.serviceType,
                    message: `Housekeeping request for ${context.name || 'guest'} has been ${params.preferredTime === 'asap' || !params.preferredTime ? 'scheduled' : 'scheduled at ' + params.preferredTime}`,
                },
            };
        },
    },
];
// ── Response Templates ──────────────────────────────────────────────────────────
const GREETING_TEMPLATES = [
    "Hello {name}! Welcome to {app}. How can I assist you today?",
    "Hi {name}! I'm here to help. What can I do for you?",
    "Welcome back {name}! How may I help you today?",
];
const ORDER_CONFIRMATION_TEMPLATE = "I've {action} for you, {name}. {details}. Is there anything else I can help with?";
const BOOKING_CONFIRMATION_TEMPLATE = "Your {type} has been {action}, {name}. {details}. {additionalInfo}";
const ESCALATION_TEMPLATE = "I'd like to connect you with a {department} team member who can better assist. {reason}. Please hold while I transfer you.";
class AIChatHandler {
    client = null;
    knowledgeBase;
    toolHandlers;
    confidenceThreshold;
    escalationKeywords;
    constructor(config) {
        this.knowledgeBase = (0, providers_1.createKnowledgeBase)(config.appType, config.merchantData, config.customerContext, config.industryCategory);
        this.toolHandlers = new Map();
        exports.BOOKING_TOOLS.forEach(tool => this.toolHandlers.set(tool.name, tool));
        this.confidenceThreshold = config.confidenceThreshold || 0.7;
        this.escalationKeywords = config.escalationKeywords || [
            'manager', 'supervisor', 'human', 'real person', 'person', 'complaint',
            'refund now', 'cancel everything', 'lawsuit', 'lawyer', 'speak to someone'
        ];
        if (config.apiKey) {
            this.client = new sdk_1.default({ apiKey: config.apiKey });
        }
    }
    async handleMessage(request) {
        const { message, customerContext, chatHistory } = request;
        const startTime = Date.now();
        // Sanitize the incoming message to prevent prompt injection and remove sensitive data
        const sanitizedMessage = sanitize_1.defaultSanitizer.sanitizeChatMessage(message);
        // Check for escalation keywords first
        if (this.shouldEscalate(sanitizedMessage)) {
            const response = await this.handleEscalation(sanitizedMessage, customerContext);
            // Track for learning
            this.trackInteraction(sanitizedMessage, response.message, customerContext, {
                confidence: response.confidence,
                responseTime: Date.now() - startTime,
                toolUsed: false,
                resolved: false,
            });
            return response;
        }
        // Get relevant knowledge for the query
        const relevantKnowledge = await this.knowledgeBase.getRelevantEntries(customerContext || {}, sanitizedMessage);
        // Build context for AI
        const aiContext = await this.buildContext(customerContext, relevantKnowledge, chatHistory);
        // Generate response
        let response;
        if (this.client) {
            response = await this.generateAIResponse(sanitizedMessage, aiContext, relevantKnowledge);
        }
        else {
            response = await this.generateRuleBasedResponse(sanitizedMessage, relevantKnowledge, customerContext);
        }
        // Capture intent from chat message
        const userId = customerContext?.customerId || 'anonymous';
        await captureIntentFromChat(userId, sanitizedMessage, response.message);
        // Track for learning
        this.trackInteraction(sanitizedMessage, response.message, customerContext, {
            confidence: response.confidence,
            responseTime: Date.now() - startTime,
            toolUsed: (response.actions?.length ?? 0) > 0,
            toolName: response.actions?.[0]?.type,
            knowledgeSources: response.knowledgeUsed,
            resolved: response.confidence > 0.7 && !response.actions?.some(a => a.type === 'escalate'),
        });
        return response;
    }
    trackInteraction(userMessage, aiResponse, context, metrics) {
        try {
            const learningSystem = (0, analytics_1.getLearningSystem)();
            learningSystem.analyzeAndLearn(userMessage, aiResponse, context || { customerId: 'anonymous' }, {
                confidence: metrics.confidence,
                responseTime: metrics.responseTime,
                toolUsed: metrics.toolUsed,
                toolName: metrics.toolName,
                knowledgeSources: metrics.knowledgeSources || [],
                resolved: metrics.resolved,
            });
        }
        catch (error) {
            // Don't let analytics errors affect the main flow
            console.error('[AIChatHandler] Learning tracking error:', error);
        }
    }
    shouldEscalate(message) {
        const lowerMessage = message.toLowerCase();
        return this.escalationKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    async handleEscalation(message, context) {
        const lowerMessage = message.toLowerCase();
        let department = 'support';
        if (lowerMessage.includes('manager') || lowerMessage.includes('supervisor')) {
            department = 'management';
        }
        else if (lowerMessage.includes('complaint')) {
            department = 'guest_relations';
        }
        return {
            message: `I understand you'd like to speak with our team. I'm connecting you with a ${department} representative who can better assist you. Please hold for a moment.`,
            actions: [{
                    type: 'escalate',
                    data: { department, reason: message },
                    reason: 'Customer requested human assistance',
                }],
            confidence: 1.0,
            knowledgeUsed: [],
        };
    }
    async buildContext(context, knowledge, history) {
        const parts = [];
        // Customer info (without sensitive data)
        if (context) {
            const safeContext = (0, sanitize_1.sanitizeCustomerContext)(context);
            if (safeContext.name)
                parts.push(`Customer: ${safeContext.name}`);
            if (safeContext.tier)
                parts.push(`Membership: ${safeContext.tier}`);
            if (safeContext.visitCount)
                parts.push(`Previous visits: ${safeContext.visitCount}`);
        }
        // Knowledge base context
        const knowledgeParts = [];
        if (knowledge.length > 0) {
            knowledgeParts.push('Relevant Information:');
            knowledge.forEach(k => {
                knowledgeParts.push(`- ${k.title}: ${k.content}`);
            });
        }
        // Recent conversation history (last 4 messages)
        const historyParts = [];
        if (history && history.length > 0) {
            const recentHistory = history.slice(-4);
            historyParts.push('Recent conversation:');
            recentHistory.forEach(m => {
                historyParts.push(`${m.sender === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`);
            });
        }
        // Load intent graph context
        let intentGraph;
        const userId = context?.customerId || 'anonymous';
        try {
            const memoryCtx = await (0, commerceMemoryContext_1.getCommerceMemoryContext)(userId);
            if (memoryCtx) {
                intentGraph = {
                    activeIntents: memoryCtx.activeIntents.map(i => ({
                        key: i.key,
                        category: i.category,
                        confidence: i.confidence,
                        lastSeen: i.lastSeen,
                    })),
                    dormantIntents: memoryCtx.dormantIntents.map(d => ({
                        key: d.key,
                        category: d.category,
                        revivalScore: d.revivalScore,
                        daysDormant: d.daysDormant,
                    })),
                    profile: memoryCtx.profile ? {
                        dominantCategory: getDominantAffinity(memoryCtx.profile),
                        affinities: {
                            travel: memoryCtx.profile.travelAffinity / 100,
                            dining: memoryCtx.profile.diningAffinity / 100,
                            retail: memoryCtx.profile.retailAffinity / 100,
                        },
                    } : null,
                };
            }
        }
        catch (err) {
            logger_1.logger.debug('[AIHandler] Failed to load intent graph context:', err);
        }
        return {
            customerInfo: parts.join('\n'),
            knowledgeContext: knowledgeParts.join('\n'),
            historyContext: historyParts.join('\n'),
            intentGraph,
        };
    }
    async generateAIResponse(message, aiContext, knowledge) {
        if (!this.client) {
            throw new Error('AI client not configured');
        }
        const systemPrompt = `You are a helpful AI assistant for a ${this.getAppTypeName()} chat service.

IMPORTANT RULES:
1. NEVER mention card numbers, CVV, passwords, full email addresses, phone numbers, or any financial identifiers
2. NEVER share internal booking IDs, transaction IDs, or session IDs with customers
3. Be friendly, helpful, and concise
4. Use available information to provide personalized responses
5. When customers want to make bookings or orders, use the appropriate tools
6. If you cannot help with something, offer to connect them with staff

You have access to knowledge about:
- Check-in/out procedures and policies
- Hotel/restaurant/retail services and amenities
- Order and booking management
- Account and membership information
- Available promotions and offers

When responding, reference relevant knowledge naturally in your conversation.`;
        const prompt = buildPromptWithIntentGraph(aiContext);
        const msg = await this.client.messages.create({
            model: 'claude-sonnet-4-7',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                { role: 'user', content: `Context:\n${prompt}\n\nCustomer question: ${message}` },
            ],
        });
        const responseText = msg.content[0].type === 'text' ? msg.content[0].text : '';
        return {
            message: responseText,
            confidence: 0.85,
            knowledgeUsed: knowledge.map(k => k.id),
        };
    }
    async generateRuleBasedResponse(message, knowledge, context) {
        const lowerMessage = message.toLowerCase();
        const name = context?.name || 'there';
        let response = '';
        let confidence = 0.5;
        const knowledgeUsed = [];
        // Greetings
        if (/^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(lowerMessage)) {
            const template = GREETING_TEMPLATES[Math.floor(Math.random() * GREETING_TEMPLATES.length)];
            response = template.replace('{name}', name).replace('{app}', this.getAppTypeName());
            confidence = 0.95;
        }
        // Check-in queries
        else if (lowerMessage.includes('check in') || lowerMessage.includes('check-in')) {
            const checkInInfo = knowledge.find(k => k.id.includes('check-in'));
            response = checkInInfo?.content || 'Standard check-in is at 3:00 PM. Early check-in may be available upon request. Would you like me to check availability?';
            knowledgeUsed.push(checkInInfo?.id || 'hotel:check-in');
            confidence = 0.9;
        }
        // Check-out queries
        else if (lowerMessage.includes('check out') || lowerMessage.includes('check-out')) {
            const checkOutInfo = knowledge.find(k => k.id.includes('check-out'));
            response = checkOutInfo?.content || 'Standard check-out is at 11:00 AM. Late check-out may be available until 2:00 PM. Would you like me to arrange late check-out?';
            knowledgeUsed.push(checkOutInfo?.id || 'hotel:check-out');
            confidence = 0.9;
        }
        // Room service
        else if (lowerMessage.includes('room service') || lowerMessage.includes('food') || lowerMessage.includes('order food')) {
            const roomServiceInfo = knowledge.find(k => k.id.includes('room-service'));
            response = roomServiceInfo?.content || 'Room service is available 24 hours. Would you like to see our menu or place an order?';
            knowledgeUsed.push(roomServiceInfo?.id || 'hotel:room-service');
            confidence = 0.85;
        }
        // Housekeeping
        else if (lowerMessage.includes('housekeeping') || lowerMessage.includes('clean') || lowerMessage.includes('towels')) {
            const houseKeepingInfo = knowledge.find(k => k.id.includes('housekeeping'));
            response = houseKeepingInfo?.content || 'Housekeeping is available daily from 9 AM to 4 PM. Would you like me to schedule a service?';
            knowledgeUsed.push(houseKeepingInfo?.id || 'hotel:housekeeping');
            confidence = 0.85;
        }
        // Amenities
        else if (lowerMessage.includes('ameniti') || lowerMessage.includes('facilities') || lowerMessage.includes('pool') || lowerMessage.includes('wifi')) {
            const amenitiesInfo = knowledge.find(k => k.id.includes('amenities'));
            response = amenitiesInfo?.content || 'We offer free WiFi, pool access, fitness center, and more. What would you like to know more about?';
            knowledgeUsed.push(amenitiesInfo?.id || 'hotel:amenities');
            confidence = 0.85;
        }
        // Concierge
        else if (lowerMessage.includes('concierge') || lowerMessage.includes('recommendation') || lowerMessage.includes('local') || lowerMessage.includes('restaurant reservation')) {
            const conciergeInfo = knowledge.find(k => k.id.includes('concierge'));
            response = conciergeInfo?.content || 'Our concierge can help with restaurant reservations, tour bookings, transportation, and local recommendations. How can I assist?';
            knowledgeUsed.push(conciergeInfo?.id || 'hotel:concierge');
            confidence = 0.85;
        }
        // Spa
        else if (lowerMessage.includes('spa') || lowerMessage.includes('massage') || lowerMessage.includes('wellness')) {
            const spaInfo = knowledge.find(k => k.id.includes('spa'));
            response = spaInfo?.content || 'Our spa offers massage, facial, and body treatments from 9 AM to 8 PM. Would you like to book an appointment?';
            knowledgeUsed.push(spaInfo?.id || 'hotel:spa');
            confidence = 0.85;
        }
        // Reservation/booking intent
        else if (this.detectBookingIntent(lowerMessage)) {
            return this.handleBookingIntent(lowerMessage, context);
        }
        // Order intent
        else if (this.detectOrderIntent(lowerMessage)) {
            return this.handleOrderIntent(lowerMessage, context);
        }
        // Status inquiry
        else if (lowerMessage.includes('status') || lowerMessage.includes('where is') || lowerMessage.includes('track')) {
            response = `I can help track your order or booking. Could you provide your order ID or booking reference?`;
            confidence = 0.7;
        }
        // Membership/tier info
        else if (lowerMessage.includes('membership') || lowerMessage.includes('tier') || lowerMessage.includes('benefits') || lowerMessage.includes('points')) {
            const tierInfo = knowledge.find(k => k.id.includes('tier'));
            if (tierInfo) {
                response = tierInfo.content;
                knowledgeUsed.push(tierInfo.id);
            }
            else {
                response = `As a ${context?.tier || 'member'}, you enjoy various benefits including priority support and exclusive offers. What would you like to know more about?`;
            }
            confidence = 0.8;
        }
        // Help
        else if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
            response = `I can help you with:\n- Check-in/out procedures\n- Room service orders\n- Housekeeping requests\n- Concierge services\n- Restaurant reservations\n- Booking management\n- General inquiries\n\nWhat would you like assistance with?`;
            confidence = 0.95;
        }
        // Fallback
        else {
            response = `I'm here to help! I can assist with reservations, orders, information about our services, and more. Could you let me know what you're looking for?`;
            confidence = 0.6;
        }
        return {
            message: response,
            confidence,
            knowledgeUsed,
        };
    }
    detectBookingIntent(message) {
        const bookingKeywords = ['book', 'reserve', 'reservation', 'schedule', 'appointment'];
        return bookingKeywords.some(keyword => message.includes(keyword));
    }
    detectOrderIntent(message) {
        const orderKeywords = ['order', 'buy', 'purchase', 'get me', 'i want', 'i\'d like'];
        return orderKeywords.some(keyword => message.includes(keyword));
    }
    handleBookingIntent(message, context) {
        const name = context?.name || 'there';
        let bookingType = 'service';
        if (message.includes('hotel') || message.includes('room') || message.includes('stay')) {
            bookingType = 'hotel room';
        }
        else if (message.includes('restaurant') || message.includes('table') || message.includes('dinner') || message.includes('lunch')) {
            bookingType = 'restaurant table';
        }
        else if (message.includes('spa') || message.includes('massage')) {
            bookingType = 'spa appointment';
        }
        return {
            message: `I'd be happy to help you book a ${bookingType}, ${name}! Could you please provide:\n\n1. Your preferred date(s)\n2. Number of guests\n3. Any special requests or preferences\n\nI can then check availability and complete the reservation for you.`,
            suggestions: ['Check availability', 'View current promotions', 'Set a reminder'],
            confidence: 0.85,
            actions: [{
                    type: 'create_booking',
                    data: { bookingType },
                    reason: 'Customer wants to make a booking',
                }],
        };
    }
    handleOrderIntent(message, context) {
        const name = context?.name || 'there';
        return {
            message: `I'd be happy to help you place an order, ${name}! Could you tell me:\n\n1. What items would you like to order?\n2. Is this for delivery or pickup?\n3. Any special instructions or dietary requirements?\n\nI can then process your order right away.`,
            suggestions: ['View menu', 'Popular items', 'Special offers'],
            confidence: 0.85,
            actions: [{
                    type: 'place_order',
                    data: {},
                    reason: 'Customer wants to place an order',
                }],
        };
    }
    getAppTypeName() {
        return 'ReZ'; // This would be customized based on appType
    }
    // Tool execution
    async executeTool(toolName, params, context) {
        const tool = this.toolHandlers.get(toolName);
        if (!tool) {
            return { success: false, error: `Unknown tool: ${toolName}` };
        }
        // Validate required parameters
        for (const [paramName, paramDef] of Object.entries(tool.parameters)) {
            if (paramDef.required && !(paramName in params)) {
                return { success: false, error: `Missing required parameter: ${paramName}` };
            }
        }
        return tool.execute(params, context);
    }
    // Add custom tool handler
    addToolHandler(tool) {
        this.toolHandlers.set(tool.name, tool);
    }
}
exports.AIChatHandler = AIChatHandler;
// ── Default Export ───────────────────────────────────────────────────────────────
function createAIHandler(config) {
    return new AIChatHandler(config);
}
//# sourceMappingURL=aiHandler.js.map