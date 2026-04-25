import { z } from 'zod';
export declare const PAYMENT_STATUS: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
export declare const PAYMENT_METHOD: z.ZodEnum<["upi", "card", "wallet", "netbanking", "cod", "bnpl", "razorpay", "stripe"]>;
export declare const PAYMENT_GATEWAY: z.ZodEnum<["stripe", "razorpay", "paypal"]>;
export declare const PAYMENT_PURPOSE: z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>;
export declare const PaymentUserDetailsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
}>;
export declare const PaymentMetadataSchema: z.ZodObject<{
    razorpayOrderId: z.ZodOptional<z.ZodString>;
    stripeWebhookId: z.ZodOptional<z.ZodString>;
    paypalOrderId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, z.objectOutputType<{
    razorpayOrderId: z.ZodOptional<z.ZodString>;
    stripeWebhookId: z.ZodOptional<z.ZodString>;
    paypalOrderId: z.ZodOptional<z.ZodString>;
}, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">, z.objectInputType<{
    razorpayOrderId: z.ZodOptional<z.ZodString>;
    stripeWebhookId: z.ZodOptional<z.ZodString>;
    paypalOrderId: z.ZodOptional<z.ZodString>;
}, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">>;
export declare const PaymentGatewayResponseSchema: z.ZodDiscriminatedUnion<"gateway", [z.ZodObject<{
    gateway: z.ZodLiteral<"razorpay">;
    transactionId: z.ZodOptional<z.ZodString>;
    paymentUrl: z.ZodOptional<z.ZodString>;
    razorpayPaymentId: z.ZodOptional<z.ZodString>;
    razorpaySignature: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
}, "strict", z.ZodTypeAny, {
    gateway: "razorpay";
    timestamp: string | Date;
    transactionId?: string | undefined;
    paymentUrl?: string | undefined;
    razorpayPaymentId?: string | undefined;
    razorpaySignature?: string | undefined;
}, {
    gateway: "razorpay";
    timestamp: string | Date;
    transactionId?: string | undefined;
    paymentUrl?: string | undefined;
    razorpayPaymentId?: string | undefined;
    razorpaySignature?: string | undefined;
}>, z.ZodObject<{
    gateway: z.ZodLiteral<"stripe">;
    transactionId: z.ZodOptional<z.ZodString>;
    paymentIntentId: z.ZodOptional<z.ZodString>;
    clientSecret: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
}, "strict", z.ZodTypeAny, {
    gateway: "stripe";
    timestamp: string | Date;
    transactionId?: string | undefined;
    paymentIntentId?: string | undefined;
    clientSecret?: string | undefined;
}, {
    gateway: "stripe";
    timestamp: string | Date;
    transactionId?: string | undefined;
    paymentIntentId?: string | undefined;
    clientSecret?: string | undefined;
}>, z.ZodObject<{
    gateway: z.ZodLiteral<"paypal">;
    transactionId: z.ZodOptional<z.ZodString>;
    paypalOrderId: z.ZodOptional<z.ZodString>;
    captureId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
}, "strict", z.ZodTypeAny, {
    gateway: "paypal";
    timestamp: string | Date;
    paypalOrderId?: string | undefined;
    transactionId?: string | undefined;
    captureId?: string | undefined;
}, {
    gateway: "paypal";
    timestamp: string | Date;
    paypalOrderId?: string | undefined;
    transactionId?: string | undefined;
    captureId?: string | undefined;
}>, z.ZodObject<{
    gateway: z.ZodLiteral<"upi">;
    transactionId: z.ZodOptional<z.ZodString>;
    upiId: z.ZodOptional<z.ZodString>;
    qrCode: z.ZodOptional<z.ZodString>;
    expiryTime: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
}, "strict", z.ZodTypeAny, {
    gateway: "upi";
    timestamp: string | Date;
    transactionId?: string | undefined;
    upiId?: string | undefined;
    qrCode?: string | undefined;
    expiryTime?: string | Date | undefined;
}, {
    gateway: "upi";
    timestamp: string | Date;
    transactionId?: string | undefined;
    upiId?: string | undefined;
    qrCode?: string | undefined;
    expiryTime?: string | Date | undefined;
}>, z.ZodObject<{
    gateway: z.ZodEnum<["wallet", "cod"]>;
    transactionId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
}, "strict", z.ZodTypeAny, {
    gateway: "wallet" | "cod";
    timestamp: string | Date;
    transactionId?: string | undefined;
}, {
    gateway: "wallet" | "cod";
    timestamp: string | Date;
    transactionId?: string | undefined;
}>]>;
export declare const CreatePaymentSchema: z.ZodObject<{
    paymentId: z.ZodString;
    orderId: z.ZodString;
    user: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    paymentMethod: z.ZodEnum<["upi", "card", "wallet", "netbanking", "cod", "bnpl", "razorpay", "stripe"]>;
    gateway: z.ZodOptional<z.ZodEnum<["stripe", "razorpay", "paypal"]>>;
    purpose: z.ZodDefault<z.ZodOptional<z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>>>;
    userDetails: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }>;
    metadata: z.ZodOptional<z.ZodObject<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">, z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">>>;
    gatewayResponse: z.ZodOptional<z.ZodDiscriminatedUnion<"gateway", [z.ZodObject<{
        gateway: z.ZodLiteral<"razorpay">;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        razorpayPaymentId: z.ZodOptional<z.ZodString>;
        razorpaySignature: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    }, {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"stripe">;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentIntentId: z.ZodOptional<z.ZodString>;
        clientSecret: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    }, {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"paypal">;
        transactionId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
        captureId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    }, {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"upi">;
        transactionId: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    }, {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodEnum<["wallet", "cod"]>;
        transactionId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    }, {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    }>]>>;
}, "strict", z.ZodTypeAny, {
    user: string;
    orderId: string;
    paymentId: string;
    amount: number;
    currency: string;
    paymentMethod: "upi" | "card" | "wallet" | "netbanking" | "cod" | "bnpl" | "razorpay" | "stripe";
    purpose: "other" | "wallet_topup" | "order_payment" | "event_booking" | "financial_service";
    userDetails: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    };
    metadata?: z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    gateway?: "razorpay" | "stripe" | "paypal" | undefined;
    gatewayResponse?: {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    } | {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    } | {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    } | {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    } | {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    } | undefined;
}, {
    user: string;
    orderId: string;
    paymentId: string;
    amount: number;
    paymentMethod: "upi" | "card" | "wallet" | "netbanking" | "cod" | "bnpl" | "razorpay" | "stripe";
    userDetails: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    };
    metadata?: z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    gateway?: "razorpay" | "stripe" | "paypal" | undefined;
    currency?: string | undefined;
    purpose?: "other" | "wallet_topup" | "order_payment" | "event_booking" | "financial_service" | undefined;
    gatewayResponse?: {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    } | {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    } | {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    } | {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    } | {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    } | undefined;
}>;
export declare const UpdatePaymentStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
    failureReason: z.ZodOptional<z.ZodString>;
    walletCredited: z.ZodOptional<z.ZodBoolean>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodObject<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">, z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">>>;
}, "strict", z.ZodTypeAny, {
    status: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    failureReason?: string | undefined;
    metadata?: z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    walletCredited?: boolean | undefined;
    refundedAmount?: number | undefined;
}, {
    status: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    failureReason?: string | undefined;
    metadata?: z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    walletCredited?: boolean | undefined;
    refundedAmount?: number | undefined;
}>;
export declare const PaymentResponseSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodString;
    orderId: z.ZodString;
    user: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    paymentMethod: z.ZodEnum<["upi", "card", "wallet", "netbanking", "cod", "bnpl", "razorpay", "stripe"]>;
    gateway: z.ZodOptional<z.ZodEnum<["stripe", "razorpay", "paypal"]>>;
    purpose: z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>;
    status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
    userDetails: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }>;
    metadata: z.ZodOptional<z.ZodObject<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">, z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">>>;
    gatewayResponse: z.ZodOptional<z.ZodDiscriminatedUnion<"gateway", [z.ZodObject<{
        gateway: z.ZodLiteral<"razorpay">;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        razorpayPaymentId: z.ZodOptional<z.ZodString>;
        razorpaySignature: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    }, {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"stripe">;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentIntentId: z.ZodOptional<z.ZodString>;
        clientSecret: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    }, {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"paypal">;
        transactionId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
        captureId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    }, {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"upi">;
        transactionId: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    }, {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodEnum<["wallet", "cod"]>;
        transactionId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    }, {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    }>]>>;
    failureReason: z.ZodOptional<z.ZodString>;
    walletCredited: z.ZodOptional<z.ZodBoolean>;
    walletCreditedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    completedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    failedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    expiresAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    updatedAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
}, "strip", z.ZodTypeAny, {
    user: string;
    orderId: string;
    paymentId: string;
    status: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    amount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    currency: string;
    paymentMethod: "upi" | "card" | "wallet" | "netbanking" | "cod" | "bnpl" | "razorpay" | "stripe";
    purpose: "other" | "wallet_topup" | "order_payment" | "event_booking" | "financial_service";
    userDetails: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    };
    failureReason?: string | undefined;
    metadata?: z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    _id?: string | undefined;
    gateway?: "razorpay" | "stripe" | "paypal" | undefined;
    gatewayResponse?: {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    } | {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    } | {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    } | {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    } | {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    } | undefined;
    walletCredited?: boolean | undefined;
    refundedAmount?: number | undefined;
    walletCreditedAt?: string | Date | undefined;
    completedAt?: string | Date | undefined;
    failedAt?: string | Date | undefined;
    expiresAt?: string | Date | undefined;
}, {
    user: string;
    orderId: string;
    paymentId: string;
    status: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    amount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    currency: string;
    paymentMethod: "upi" | "card" | "wallet" | "netbanking" | "cod" | "bnpl" | "razorpay" | "stripe";
    purpose: "other" | "wallet_topup" | "order_payment" | "event_booking" | "financial_service";
    userDetails: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    };
    failureReason?: string | undefined;
    metadata?: z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    _id?: string | undefined;
    gateway?: "razorpay" | "stripe" | "paypal" | undefined;
    gatewayResponse?: {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    } | {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    } | {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    } | {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    } | {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    } | undefined;
    walletCredited?: boolean | undefined;
    refundedAmount?: number | undefined;
    walletCreditedAt?: string | Date | undefined;
    completedAt?: string | Date | undefined;
    failedAt?: string | Date | undefined;
    expiresAt?: string | Date | undefined;
}>;
export declare const PaymentListResponseSchema: z.ZodArray<z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodString;
    orderId: z.ZodString;
    user: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    paymentMethod: z.ZodEnum<["upi", "card", "wallet", "netbanking", "cod", "bnpl", "razorpay", "stripe"]>;
    gateway: z.ZodOptional<z.ZodEnum<["stripe", "razorpay", "paypal"]>>;
    purpose: z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>;
    status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
    userDetails: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }>;
    metadata: z.ZodOptional<z.ZodObject<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">, z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip">>>;
    gatewayResponse: z.ZodOptional<z.ZodDiscriminatedUnion<"gateway", [z.ZodObject<{
        gateway: z.ZodLiteral<"razorpay">;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        razorpayPaymentId: z.ZodOptional<z.ZodString>;
        razorpaySignature: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    }, {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"stripe">;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentIntentId: z.ZodOptional<z.ZodString>;
        clientSecret: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    }, {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"paypal">;
        transactionId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
        captureId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    }, {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodLiteral<"upi">;
        transactionId: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    }, {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    }>, z.ZodObject<{
        gateway: z.ZodEnum<["wallet", "cod"]>;
        transactionId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    }, "strict", z.ZodTypeAny, {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    }, {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    }>]>>;
    failureReason: z.ZodOptional<z.ZodString>;
    walletCredited: z.ZodOptional<z.ZodBoolean>;
    walletCreditedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    completedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    failedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    expiresAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    updatedAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
}, "strip", z.ZodTypeAny, {
    user: string;
    orderId: string;
    paymentId: string;
    status: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    amount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    currency: string;
    paymentMethod: "upi" | "card" | "wallet" | "netbanking" | "cod" | "bnpl" | "razorpay" | "stripe";
    purpose: "other" | "wallet_topup" | "order_payment" | "event_booking" | "financial_service";
    userDetails: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    };
    failureReason?: string | undefined;
    metadata?: z.objectOutputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    _id?: string | undefined;
    gateway?: "razorpay" | "stripe" | "paypal" | undefined;
    gatewayResponse?: {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    } | {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    } | {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    } | {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    } | {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    } | undefined;
    walletCredited?: boolean | undefined;
    refundedAmount?: number | undefined;
    walletCreditedAt?: string | Date | undefined;
    completedAt?: string | Date | undefined;
    failedAt?: string | Date | undefined;
    expiresAt?: string | Date | undefined;
}, {
    user: string;
    orderId: string;
    paymentId: string;
    status: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    amount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    currency: string;
    paymentMethod: "upi" | "card" | "wallet" | "netbanking" | "cod" | "bnpl" | "razorpay" | "stripe";
    purpose: "other" | "wallet_topup" | "order_payment" | "event_booking" | "financial_service";
    userDetails: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    };
    failureReason?: string | undefined;
    metadata?: z.objectInputType<{
        razorpayOrderId: z.ZodOptional<z.ZodString>;
        stripeWebhookId: z.ZodOptional<z.ZodString>;
        paypalOrderId: z.ZodOptional<z.ZodString>;
    }, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>, "strip"> | undefined;
    _id?: string | undefined;
    gateway?: "razorpay" | "stripe" | "paypal" | undefined;
    gatewayResponse?: {
        gateway: "razorpay";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentUrl?: string | undefined;
        razorpayPaymentId?: string | undefined;
        razorpaySignature?: string | undefined;
    } | {
        gateway: "stripe";
        timestamp: string | Date;
        transactionId?: string | undefined;
        paymentIntentId?: string | undefined;
        clientSecret?: string | undefined;
    } | {
        gateway: "paypal";
        timestamp: string | Date;
        paypalOrderId?: string | undefined;
        transactionId?: string | undefined;
        captureId?: string | undefined;
    } | {
        gateway: "upi";
        timestamp: string | Date;
        transactionId?: string | undefined;
        upiId?: string | undefined;
        qrCode?: string | undefined;
        expiryTime?: string | Date | undefined;
    } | {
        gateway: "wallet" | "cod";
        timestamp: string | Date;
        transactionId?: string | undefined;
    } | undefined;
    walletCredited?: boolean | undefined;
    refundedAmount?: number | undefined;
    walletCreditedAt?: string | Date | undefined;
    completedAt?: string | Date | undefined;
    failedAt?: string | Date | undefined;
    expiresAt?: string | Date | undefined;
}>, "many">;
export type CreatePaymentRequest = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentStatusRequest = z.infer<typeof UpdatePaymentStatusSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
export type PaymentListResponse = z.infer<typeof PaymentListResponseSchema>;
export type PaymentStatus = z.infer<typeof PAYMENT_STATUS>;
export type PaymentMethod = z.infer<typeof PAYMENT_METHOD>;
export type PaymentGateway = z.infer<typeof PAYMENT_GATEWAY>;
export type PaymentPurpose = z.infer<typeof PAYMENT_PURPOSE>;
export type PaymentMetadata = z.infer<typeof PaymentMetadataSchema>;
//# sourceMappingURL=payment.schema.d.ts.map