import { CustomerContext } from '../types';
export interface TriggerEvent {
    type: EventType;
    userId: string;
    customerContext?: CustomerContext;
    data: Record<string, unknown>;
    scheduledAt?: Date;
}
export type EventType = 'booking_reminder' | 'checkout_reminder' | 'coin_expiry' | 'loyalty_tier_upgrade' | 'engagement_nudge' | 'order_ready' | 'payment_due' | 'checkin_reminder' | 'review_request' | 'birthday_offer';
export interface NotificationPayload {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    priority?: 'low' | 'normal' | 'high';
    channels?: ('push' | 'email' | 'sms')[];
}
export interface TriggerConfig {
    bookingReminderHours?: number;
    coinExpiryDays?: number;
    engagementNudgeHours?: number;
    reviewRequestHours?: number;
}
export type NotificationHandler = (payload: NotificationPayload) => Promise<boolean | void>;
export declare class EventTriggerManager {
    private config;
    private handlers;
    private queue;
    private processing;
    constructor(config?: TriggerConfig);
    registerChannel(channel: string, handler: NotificationHandler): void;
    scheduleEvent(event: TriggerEvent): void;
    trigger(event: TriggerEvent): Promise<void>;
    processQueue(): Promise<void>;
    scheduleBookingReminder(userId: string, customerContext: CustomerContext, booking: {
        bookingId: string;
        hotelName: string;
        checkIn: string;
    }): void;
    scheduleCoinExpiry(userId: string, expiringCoins: number, expiryDate: Date): void;
    scheduleEngagementNudge(userId: string, offerId: string, lastOrderDate: Date): void;
    triggerOrderReady(userId: string, orderId: string, orderNumber: string): void;
    triggerLoyaltyUpgrade(userId: string, newTier: string): void;
    triggerBirthdayOffer(userId: string, bonusCoins: number, offerId: string): void;
    triggerReviewRequest(userId: string, orderId: string, storeId: string, storeName: string): void;
}
export declare function getEventTriggerManager(): EventTriggerManager;
export declare function initializeEventTriggers(config?: TriggerConfig): EventTriggerManager;
export default EventTriggerManager;
//# sourceMappingURL=eventTriggers.d.ts.map