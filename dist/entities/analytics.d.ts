import { EventType } from '../enums/index';
export interface IAnalyticsEventContext {
    userId?: string;
    sessionId?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
}
export interface IAnalyticsEvent {
    _id?: string;
    type: EventType;
    name: string;
    timestamp: Date;
    context: IAnalyticsEventContext;
    properties?: Record<string, any>;
    metrics?: Record<string, number>;
    source?: string;
    version?: string;
}
//# sourceMappingURL=analytics.d.ts.map