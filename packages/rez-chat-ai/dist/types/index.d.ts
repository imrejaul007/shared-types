export type ReZAppType = 'going_out' | 'home_delivery' | 'earn' | 'play' | 'general';
export type AppType = ReZAppType | 'hotel' | 'restaurant' | 'retail' | 'support';
export type IndustryCategory = 'restaurant' | 'cafe' | 'bar' | 'food_court' | 'cloud_kitchen' | 'fashion' | 'grocery' | 'pharmacy' | 'electronics' | 'beauty' | 'home_services' | 'entertainment' | 'travel' | 'events' | 'movies' | 'gaming' | 'earn' | 'financial' | 'education' | 'healthcare' | 'fitness' | 'hotel' | 'hotel_restaurant' | 'hotel_spa' | 'hotel_lounge' | 'support';
export interface KnowledgeEntry {
    id: string;
    type: 'product' | 'service' | 'offer' | 'faq' | 'policy' | 'info';
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
    relevanceScore?: number;
}
export interface KnowledgeBase {
    appType: AppType;
    merchantId?: string;
    entries: KnowledgeEntry[];
    lastUpdated: Date;
}
export interface CustomerContext {
    customerId: string;
    name?: string;
    email?: string;
    phone?: string;
    tier?: string;
    preferences?: Record<string, unknown>;
    recentOrders?: OrderSummary[];
    bookings?: BookingSummary[];
    totalSpent?: number;
    visitCount?: number;
}
export interface OrderSummary {
    orderId: string;
    type: 'hotel_booking' | 'restaurant_order' | 'retail_purchase';
    status: string;
    total: number;
    date: Date;
    items?: string[];
}
export interface BookingSummary {
    bookingId: string;
    type: 'hotel' | 'restaurant' | 'service';
    status: string;
    date: Date;
    details?: string;
}
export interface AIChatMessage {
    id: string;
    conversationId: string;
    sender: 'user' | 'ai' | 'staff';
    content: string;
    timestamp: Date;
    metadata?: {
        isAutomated?: boolean;
        confidence?: number;
        suggestions?: string[];
        toolsUsed?: string[];
    };
}
export interface AIChatRequest {
    conversationId: string;
    message: string;
    userId: string;
    appType: AppType;
    merchantId?: string;
    customerContext?: CustomerContext;
    chatHistory?: AIChatMessage[];
}
export interface AIChatResponse {
    message: string;
    suggestions?: string[];
    actions?: AIAction[];
    confidence: number;
    knowledgeUsed?: string[];
}
export interface AIAction {
    type: 'create_booking' | 'place_order' | 'send_to_staff' | 'provide_info' | 'suggest_product' | 'escalate';
    data: Record<string, unknown>;
    reason: string;
}
export interface ToolHandler {
    name: string;
    description: string;
    execute: (params: Record<string, unknown>, context: CustomerContext) => Promise<ToolResult>;
}
export interface ToolResult {
    success: boolean;
    data?: unknown;
    error?: string;
}
export interface KnowledgeProvider {
    type: 'global' | 'merchant' | 'customer' | 'app' | 'industry';
    priority: number;
    getEntries: (context: CustomerContext) => Promise<KnowledgeEntry[]>;
}
export interface Sanitizer {
    name: string;
    sanitize: (text: string) => string;
}
export interface ChatSession {
    id: string;
    userId: string;
    appType: AppType;
    merchantId?: string;
    customerContext?: CustomerContext;
    createdAt: Date;
    lastActivity: Date;
    isActive: boolean;
}
export interface ChatConfig {
    appType: AppType;
    merchantId?: string;
    enableAutoReply: boolean;
    autoReplyDelay: number;
    enableSuggestions: boolean;
    maxSuggestions: number;
    enableToolUse: boolean;
    confidenceThreshold: number;
    escalationKeywords: string[];
}
//# sourceMappingURL=index.d.ts.map