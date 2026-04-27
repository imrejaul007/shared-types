import type { AgentConfig, AgentResult, UserResponseProfile } from './types.js';
export declare const personalizationAgentConfig: AgentConfig;
type Channel = 'push' | 'email' | 'sms' | 'in_app';
interface NudgeEvent {
    nudgeId: string;
    userId: string;
    channel: Channel;
    eventType: 'delivered' | 'opened' | 'clicked' | 'converted';
    timestamp: Date;
    metadata?: Record<string, unknown>;
}
export interface NudgeVariant {
    id: string;
    message: string;
    tone: 'formal' | 'casual' | 'friendly' | 'urgent';
    channel: Channel;
}
export declare function selectOptimalVariant(userId: string, variants: NudgeVariant[]): Promise<NudgeVariant>;
export declare function processNudgeEvent(event: NudgeEvent): Promise<void>;
export declare function analyzeABTestResults(): Promise<void>;
export declare function runPersonalizationAgent(): Promise<AgentResult>;
export declare function getUserPersonalizationProfile(userId: string): Promise<UserResponseProfile | null>;
export declare function startPersonalizationCron(): void;
export declare function stopPersonalizationCron(): void;
export {};
//# sourceMappingURL=personalization-agent.d.ts.map