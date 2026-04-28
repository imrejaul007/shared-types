import { AppType, AIChatRequest, AIChatResponse, CustomerContext, ToolResult } from '../types';
import { MerchantKnowledgeData } from '../knowledge/providers';
export interface IntentGraphContext {
    activeIntents: Array<{
        key: string;
        category: string;
        confidence: number;
        lastSeen: string;
    }>;
    dormantIntents: Array<{
        key: string;
        category: string;
        revivalScore: number;
        daysDormant: number;
    }>;
    profile: {
        dominantCategory?: string;
        affinities?: Record<string, number>;
    } | null;
}
export interface AIContext {
    customerInfo: string;
    knowledgeContext: string;
    historyContext: string;
    intentGraph?: IntentGraphContext;
}
export interface ToolHandlerConfig {
    name: string;
    description: string;
    parameters: Record<string, {
        type: string;
        description: string;
        required: boolean;
    }>;
    execute: (params: Record<string, unknown>, context: CustomerContext) => Promise<ToolResult>;
}
export declare const BOOKING_TOOLS: ToolHandlerConfig[];
export interface AIHandlerConfig {
    appType: AppType;
    industryCategory?: string;
    merchantId?: string;
    merchantData?: MerchantKnowledgeData;
    customerContext?: CustomerContext;
    enableToolUse?: boolean;
    confidenceThreshold?: number;
    escalationKeywords?: string[];
    apiKey?: string;
}
export declare class AIChatHandler {
    private client;
    private knowledgeBase;
    private toolHandlers;
    private confidenceThreshold;
    private escalationKeywords;
    constructor(config: AIHandlerConfig);
    handleMessage(request: AIChatRequest): Promise<AIChatResponse>;
    private trackInteraction;
    private shouldEscalate;
    private handleEscalation;
    private buildContext;
    private generateAIResponse;
    private generateRuleBasedResponse;
    private detectBookingIntent;
    private detectOrderIntent;
    private handleBookingIntent;
    private handleOrderIntent;
    private getAppTypeName;
    executeTool(toolName: string, params: Record<string, unknown>, context: CustomerContext): Promise<ToolResult>;
    addToolHandler(tool: ToolHandlerConfig): void;
}
export declare function createAIHandler(config: AIHandlerConfig): AIChatHandler;
//# sourceMappingURL=aiHandler.d.ts.map