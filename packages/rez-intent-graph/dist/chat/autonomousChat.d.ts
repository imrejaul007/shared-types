import { type MerchantKnowledgeEntry } from '../integrations/merchantKnowledge.js';
export type MessageRole = 'user' | 'assistant' | 'system';
export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    metadata?: {
        merchantId?: string;
        intentKey?: string;
        confidence?: number;
        suggestedAction?: string;
    };
}
export interface ChatSession {
    id: string;
    userId: string;
    merchantId?: string;
    messages: ChatMessage[];
    context?: ChatContext;
    createdAt: Date;
    lastActivity: Date;
}
export interface ChatContext {
    userId: string;
    merchantId?: string;
    merchantKnowledge: MerchantKnowledgeEntry[];
    userIntents: string[];
    recentOrders?: string[];
    preferences?: Record<string, unknown>;
    conversationHistory: ChatMessage[];
}
export interface ChatResponse {
    message: ChatMessage;
    suggestions: string[];
    actions?: string[];
    contextUsed: boolean;
}
export declare class AutonomousChatService {
    /**
     * Process user message and generate autonomous response
     */
    processMessage(params: {
        userId: string;
        merchantId?: string;
        message: string;
        sessionId?: string;
    }): Promise<ChatResponse>;
    /**
     * Build context from various sources
     */
    private buildContext;
    /**
     * Analyze user message intent
     */
    private analyzeUserIntent;
    /**
     * Extract entities from message
     */
    private extractEntities;
    /**
     * Find relevant knowledge entries
     */
    private findRelevantKnowledge;
    /**
     * Generate response using context and knowledge
     */
    private generateResponse;
    /**
     * Get random template
     */
    private getRandomTemplate;
    /**
     * Get template with variables
     */
    private getTemplate;
    /**
     * Generate suggestions based on context
     */
    private generateSuggestions;
    /**
     * Generate suggested actions
     */
    private generateActions;
    /**
     * Session management
     */
    private getSession;
    private createSession;
    private saveSession;
    /**
     * Publish chat event for analytics
     */
    private publishChatEvent;
    /**
     * Get chat history for a user
     */
    getChatHistory(userId: string, limit?: number): Promise<ChatSession[]>;
    /**
     * End chat session
     */
    endSession(sessionId: string): Promise<void>;
}
export declare const autonomousChatService: AutonomousChatService;
//# sourceMappingURL=autonomousChat.d.ts.map