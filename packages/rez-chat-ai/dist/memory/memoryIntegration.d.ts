import { CustomerContext } from '../types';
export interface UserPreference {
    id: string;
    userId: string;
    category: 'dining' | 'travel' | 'social' | 'shopping' | 'general';
    key: string;
    value: string | string[] | boolean | number;
    confidence: number;
    source: 'explicit' | 'inferred' | 'behavior';
    createdAt: string;
    updatedAt: string;
}
export interface UserSignals {
    userId: string;
    engagementScore: number;
    satisfactionScore: number;
    churnRisk: 'low' | 'medium' | 'high';
    lifetimeValue: number;
    preferredChannels: ('push' | 'sms' | 'email' | 'in_app')[];
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    lastActive: string;
    activeApps: string[];
}
export interface ConversationContext {
    userId: string;
    appType: string;
    conversationId: string;
    messages: {
        role: 'user' | 'agent';
        content: string;
        timestamp: string;
        toolsUsed?: string[];
    }[];
    pendingIntents: string[];
    lastActive: string;
}
export interface CrossAppContext {
    userId: string;
    preferences: UserPreference[];
    signals: UserSignals;
    recentContext: ConversationContext[];
    sharedKnowledge: {
        key: string;
        value: unknown;
        expiresAt?: string;
    }[];
}
export interface MemoryIntegrationConfig {
    supabaseUrl?: string;
    supabaseKey?: string;
    redisUrl?: string;
    enableCache?: boolean;
    cacheTTL?: number;
}
export declare class MemoryService {
    private store;
    private userContexts;
    private contextTTL;
    constructor(_config: MemoryIntegrationConfig);
    /**
     * Get enriched customer context from shared memory
     */
    getCustomerContext(userId: string, appType: string): Promise<CustomerContext>;
    /**
     * Enrich in-memory store with data from the intent graph
     */
    enrichFromIntentGraph(userId: string): Promise<void>;
    /**
     * Update user preferences based on interaction
     */
    learnPreference(userId: string, category: UserPreference['category'], key: string, value: unknown, confidence?: number, source?: 'explicit' | 'inferred' | 'behavior'): Promise<void>;
    /**
     * Log an intent for the intent graph
     */
    logIntent(userId: string, appType: string, intent: {
        category: string;
        specific: string;
        confidence: number;
    }, outcome?: {
        converted: boolean;
        appUsed?: string;
        value?: number;
    }): Promise<void>;
    /**
     * Update user signals based on interaction
     */
    updateSignals(userId: string, signals: Partial<UserSignals>): Promise<void>;
    /**
     * Add message to conversation context
     */
    addToContext(userId: string, appType: string, message: {
        role: 'user' | 'agent';
        content: string;
        toolsUsed?: string[];
    }): Promise<void>;
    /**
     * Get relevant preferences for a specific app
     */
    getRelevantPreferences(userId: string, _categories?: UserPreference['category'][]): Promise<UserPreference[]>;
    /**
     * Get user signals (tier, engagement, etc.)
     */
    getUserSignals(userId: string): Promise<UserSignals | null>;
    /**
     * Clear user cache
     */
    clearUserCache(userId: string): Promise<void>;
    /**
     * Convert CrossAppContext to CustomerContext for AI handler
     */
    private toCustomerContext;
    private extractPreference;
}
export declare function getMemoryService(): MemoryService;
export declare function initializeMemoryService(config: MemoryIntegrationConfig): MemoryService;
export default MemoryService;
//# sourceMappingURL=memoryIntegration.d.ts.map