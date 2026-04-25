import { NotificationType, NotificationChannel } from '../enums/index';
export interface INotificationPayload {
    deepLinkUrl?: string;
    orderId?: string;
    paymentId?: string;
    merchantId?: string;
    ctaText?: string;
    imageUrl?: string;
    [key: string]: string | number | boolean | null | undefined;
}
export interface INotificationEvent {
    type: NotificationType;
    entityId?: string;
    entityType?: string;
    data?: INotificationPayload;
}
export interface INotificationRecipient {
    userId: string;
    email?: string;
    phone?: string;
    pushToken?: string;
}
export interface INotification {
    _id?: string;
    event: INotificationEvent;
    recipients: INotificationRecipient[];
    type: NotificationType;
    channel: NotificationChannel;
    title?: string;
    message: string;
    payload?: INotificationPayload;
    isRead?: boolean;
    readAt?: Date | string;
    sentAt?: Date | string;
    failureReason?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}
//# sourceMappingURL=notification.d.ts.map