import { EventType } from '../enums/index';
export type IAnalyticsProperties = Record<string, string | number | boolean | null | string[] | number[]>;
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
    timestamp: Date | string;
    context: IAnalyticsEventContext;
    properties?: IAnalyticsProperties;
    metrics?: Record<string, number>;
    source?: string;
    version?: string;
}
//# sourceMappingURL=analytics.d.ts.map