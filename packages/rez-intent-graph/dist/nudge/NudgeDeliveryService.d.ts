export type NudgeChannel = 'push' | 'email' | 'sms' | 'in_app';
export type NudgeStatus = 'pending' | 'sent' | 'delivered' | 'clicked' | 'converted' | 'failed';
export interface Nudge {
    id: string;
    dormantIntentId: string;
    userId: string;
    channel: NudgeChannel;
    message: string;
    status: NudgeStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    clickedAt?: Date;
    convertedAt?: Date;
    error?: string;
}
export interface NudgeTemplate {
    category: string;
    triggerType: string;
    channels: NudgeChannel[];
    templates: Record<NudgeChannel, string[]>;
}
export declare class NudgeDeliveryService {
    private channelHandlers;
    constructor();
    /**
     * Register a channel handler
     */
    registerChannelHandler(channel: NudgeChannel, handler: NudgeChannelHandler): void;
    /**
     * Send a nudge directly (for action trigger)
     */
    send(params: {
        userId: string;
        intentKey: string;
        message: string;
        channel: NudgeChannel;
        template?: string;
    }): Promise<Nudge>;
    /**
     * Send nudges for scheduled revival candidates
     */
    processScheduledNudges(): Promise<{
        processed: number;
        sent: number;
        failed: number;
    }>;
    /**
     * Send a nudge for a revival candidate
     */
    sendNudge(candidate: any): Promise<Nudge>;
    /**
     * Record nudge sent to database
     */
    recordNudgeSent(dormantIntentId: string, userId: string, channel: string, message: string, nudgeId?: string): Promise<void>;
    /**
     * Update nudge status (delivered, clicked, converted)
     */
    updateNudgeStatus(nudgeId: string, status: 'delivered' | 'clicked' | 'converted' | 'failed', error?: string): Promise<void>;
    /**
     * Get nudge statistics
     */
    getNudgeStats(): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byChannel: Record<string, number>;
        conversionRate: number;
    }>;
    /**
     * Get user preferences for channel selection
     */
    private getUserPreferences;
    private registerDefaultHandlers;
    private inferTriggerType;
    private getTemplate;
    private selectBestChannel;
    private renderTemplate;
    private formatIntentKey;
    private generateDeepLink;
}
export interface NudgeChannelHandler {
    send(params: {
        userId: string;
        message: string;
        data?: Record<string, unknown>;
    }): Promise<{
        success: boolean;
        error?: string;
    }>;
}
export declare const nudgeDeliveryService: NudgeDeliveryService;
//# sourceMappingURL=NudgeDeliveryService.d.ts.map