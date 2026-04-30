import { AppType, IndustryCategory, AIChatRequest, AIChatResponse, AIChatMessage, CustomerContext, AIAction } from '../types';
import { MerchantKnowledgeData } from '../knowledge/providers';
export interface AIChatServiceConfig {
    appType: AppType;
    industryCategory?: IndustryCategory;
    merchantId?: string;
    merchantData?: MerchantKnowledgeData;
    enableAutoReply?: boolean;
    autoReplyDelay?: number;
    enableSuggestions?: boolean;
    maxSuggestions?: number;
    enableToolUse?: boolean;
    confidenceThreshold?: number;
    escalationKeywords?: string[];
    apiKey?: string;
}
export interface ChatContext {
    conversationId: string;
    userId: string;
    customerContext?: CustomerContext;
    chatHistory: AIChatMessage[];
    createdAt: Date;
    lastActivity: Date;
}
export declare class AIChatService {
    private handlers;
    private contexts;
    private sanitizer;
    private config;
    constructor(config: AIChatServiceConfig);
    createSession(conversationId: string, userId: string, customerContext?: CustomerContext): ChatContext;
    getSession(conversationId: string): ChatContext | undefined;
    updateSession(conversationId: string, updates: Partial<ChatContext>): void;
    deleteSession(conversationId: string): void;
    private getOrCreateHandler;
    processMessage(request: AIChatRequest): Promise<AIChatResponse>;
    private generateSuggestions;
    executeAction(conversationId: string, action: AIAction, customerContext: CustomerContext): Promise<{
        success: boolean;
        message: string;
        data?: unknown;
    }>;
    private mapActionToTool;
    streamResponse(request: AIChatRequest): AsyncGenerator<string, void, unknown>;
    getContextForCustomer(customerId: string): CustomerContext | undefined;
    updateCustomerContext(conversationId: string, context: Partial<CustomerContext>): void;
    getConversationHistory(conversationId: string, limit?: number): AIChatMessage[];
    clearConversationHistory(conversationId: string): void;
    sanitizeForLogging(data: unknown): unknown;
    updateConfig(updates: Partial<AIChatServiceConfig>): void;
    getConfig(): Readonly<AIChatServiceConfig>;
}
export declare function createAIChatService(config: AIChatServiceConfig): AIChatService;
export default AIChatService;
//# sourceMappingURL=aiChatService.d.ts.map