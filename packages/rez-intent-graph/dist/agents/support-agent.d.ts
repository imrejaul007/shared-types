import type { AgentConfig, AgentResult } from './types.js';
export declare const supportAgentConfig: AgentConfig;
export type SupportCategory = 'hotel_ota' | 'room_qr' | 'rez_consumer' | 'web_menu' | 'merchant_os' | 'karma' | 'rendez' | 'adbazaar' | 'nextabiz';
export interface SupportRequest {
    category: SupportCategory;
    userId: string;
    message: string;
    context?: Record<string, unknown>;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}
export interface SupportResponse {
    success: boolean;
    message: string;
    actions?: SupportAction[];
    escalation?: EscalationRequest;
    data?: Record<string, unknown>;
}
export interface SupportAction {
    type: 'ticket' | 'refund' | 'status_update' | 'notification' | 'lookup';
    payload: Record<string, unknown>;
}
export interface EscalationRequest {
    reason: string;
    department: string;
    priority: 'medium' | 'high' | 'critical';
    metadata: Record<string, unknown>;
}
export declare function handleSupportRequest(request: SupportRequest): Promise<SupportResponse>;
export declare function getSupportStats(): Promise<{
    totalRequests: number;
    byCategory: Record<SupportCategory, number>;
    escalations: number;
    avgResolutionTime: number;
}>;
export declare function runSupportAgent(): Promise<AgentResult>;
//# sourceMappingURL=support-agent.d.ts.map