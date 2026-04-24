import { z } from 'zod';
export declare const NOTIFICATION_TYPE: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
export declare const NOTIFICATION_CHANNEL: z.ZodEnum<["push", "email", "sms", "in_app"]>;
export declare const NotificationEventSchema: z.ZodObject<{
    type: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
    entityId: z.ZodOptional<z.ZodString>;
    entityType: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    entityId?: string | undefined;
    entityType?: string | undefined;
    data?: Record<string, any> | undefined;
}, {
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    entityId?: string | undefined;
    entityType?: string | undefined;
    data?: Record<string, any> | undefined;
}>;
export declare const NotificationRecipientSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    pushToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    email?: string | undefined;
    phone?: string | undefined;
    pushToken?: string | undefined;
}, {
    userId: string;
    email?: string | undefined;
    phone?: string | undefined;
    pushToken?: string | undefined;
}>;
export declare const SendNotificationSchema: z.ZodObject<{
    event: z.ZodObject<{
        type: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
        entityId: z.ZodOptional<z.ZodString>;
        entityType: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    }, {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    }>;
    recipients: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        pushToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }, {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }>, "many">;
    type: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
    channel: z.ZodEnum<["push", "email", "sms", "in_app"]>;
    title: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    scheduledFor: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    event: {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    };
    message: string;
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    channel: "email" | "sms" | "push" | "in_app";
    recipients: {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }[];
    title?: string | undefined;
    payload?: Record<string, any> | undefined;
    scheduledFor?: Date | undefined;
}, {
    event: {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    };
    message: string;
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    channel: "email" | "sms" | "push" | "in_app";
    recipients: {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }[];
    title?: string | undefined;
    payload?: Record<string, any> | undefined;
    scheduledFor?: Date | undefined;
}>;
export declare const NotificationResponseSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    event: z.ZodObject<{
        type: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
        entityId: z.ZodOptional<z.ZodString>;
        entityType: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    }, {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    }>;
    recipients: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        pushToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }, {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }>, "many">;
    type: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
    channel: z.ZodEnum<["push", "email", "sms", "in_app"]>;
    title: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    isRead: z.ZodOptional<z.ZodBoolean>;
    readAt: z.ZodOptional<z.ZodDate>;
    sentAt: z.ZodOptional<z.ZodDate>;
    failureReason: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    event: {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    };
    message: string;
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    createdAt: Date;
    channel: "email" | "sms" | "push" | "in_app";
    recipients: {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }[];
    failureReason?: string | undefined;
    _id?: string | undefined;
    updatedAt?: Date | undefined;
    sentAt?: Date | undefined;
    title?: string | undefined;
    payload?: Record<string, any> | undefined;
    isRead?: boolean | undefined;
    readAt?: Date | undefined;
}, {
    event: {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    };
    message: string;
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    createdAt: Date;
    channel: "email" | "sms" | "push" | "in_app";
    recipients: {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }[];
    failureReason?: string | undefined;
    _id?: string | undefined;
    updatedAt?: Date | undefined;
    sentAt?: Date | undefined;
    title?: string | undefined;
    payload?: Record<string, any> | undefined;
    isRead?: boolean | undefined;
    readAt?: Date | undefined;
}>;
export declare const NotificationListResponseSchema: z.ZodArray<z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    event: z.ZodObject<{
        type: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
        entityId: z.ZodOptional<z.ZodString>;
        entityType: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    }, {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    }>;
    recipients: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        pushToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }, {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }>, "many">;
    type: z.ZodEnum<["order", "payment", "promotion", "wallet", "referral", "system", "alert"]>;
    channel: z.ZodEnum<["push", "email", "sms", "in_app"]>;
    title: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    isRead: z.ZodOptional<z.ZodBoolean>;
    readAt: z.ZodOptional<z.ZodDate>;
    sentAt: z.ZodOptional<z.ZodDate>;
    failureReason: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    event: {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    };
    message: string;
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    createdAt: Date;
    channel: "email" | "sms" | "push" | "in_app";
    recipients: {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }[];
    failureReason?: string | undefined;
    _id?: string | undefined;
    updatedAt?: Date | undefined;
    sentAt?: Date | undefined;
    title?: string | undefined;
    payload?: Record<string, any> | undefined;
    isRead?: boolean | undefined;
    readAt?: Date | undefined;
}, {
    event: {
        type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
        entityId?: string | undefined;
        entityType?: string | undefined;
        data?: Record<string, any> | undefined;
    };
    message: string;
    type: "referral" | "wallet" | "order" | "payment" | "promotion" | "system" | "alert";
    createdAt: Date;
    channel: "email" | "sms" | "push" | "in_app";
    recipients: {
        userId: string;
        email?: string | undefined;
        phone?: string | undefined;
        pushToken?: string | undefined;
    }[];
    failureReason?: string | undefined;
    _id?: string | undefined;
    updatedAt?: Date | undefined;
    sentAt?: Date | undefined;
    title?: string | undefined;
    payload?: Record<string, any> | undefined;
    isRead?: boolean | undefined;
    readAt?: Date | undefined;
}>, "many">;
export declare const MarkNotificationAsReadSchema: z.ZodObject<{
    notificationId: z.ZodString;
    readAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    notificationId: string;
    readAt?: Date | undefined;
}, {
    notificationId: string;
    readAt?: Date | undefined;
}>;
export declare const BatchMarkAsReadSchema: z.ZodObject<{
    notificationIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    notificationIds: string[];
}, {
    notificationIds: string[];
}>;
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;
export type NotificationRecipient = z.infer<typeof NotificationRecipientSchema>;
export type SendNotificationRequest = z.infer<typeof SendNotificationSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;
export type NotificationType = z.infer<typeof NOTIFICATION_TYPE>;
export type NotificationChannel = z.infer<typeof NOTIFICATION_CHANNEL>;
//# sourceMappingURL=notification.schema.d.ts.map