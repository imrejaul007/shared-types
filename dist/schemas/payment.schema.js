"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentListResponseSchema = exports.PaymentResponseSchema = exports.UpdatePaymentStatusSchema = exports.CreatePaymentSchema = exports.PaymentGatewayResponseSchema = exports.PaymentMetadataSchema = exports.PaymentUserDetailsSchema = exports.PAYMENT_PURPOSE = exports.PAYMENT_GATEWAY = exports.PAYMENT_METHOD = exports.PAYMENT_STATUS = void 0;
const zod_1 = require("zod");
exports.PAYMENT_STATUS = zod_1.z.enum([
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'expired',
    'refund_initiated',
    'refund_processing',
    'refunded',
    'refund_failed',
    'partially_refunded',
]);
exports.PAYMENT_METHOD = zod_1.z.enum([
    'upi',
    'card',
    'wallet',
    'netbanking',
    'cod',
    'bnpl',
    'razorpay',
    'stripe',
]);
exports.PAYMENT_GATEWAY = zod_1.z.enum(['stripe', 'razorpay', 'paypal']);
exports.PAYMENT_PURPOSE = zod_1.z.enum([
    'wallet_topup',
    'order_payment',
    'event_booking',
    'financial_service',
    'other',
]);
exports.PaymentUserDetailsSchema = zod_1.z
    .object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email('Invalid email').optional(),
    phone: zod_1.z.string().optional(),
})
    .strict();
exports.PaymentMetadataSchema = zod_1.z
    .object({
    razorpayOrderId: zod_1.z.string().optional(),
    stripeWebhookId: zod_1.z.string().optional(),
    paypalOrderId: zod_1.z.string().optional(),
})
    .catchall(zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean(), zod_1.z.null()]));
const DateOrString = zod_1.z.union([zod_1.z.date(), zod_1.z.string()]);
exports.PaymentGatewayResponseSchema = zod_1.z.discriminatedUnion('gateway', [
    zod_1.z
        .object({
        gateway: zod_1.z.literal('razorpay'),
        transactionId: zod_1.z.string().optional(),
        paymentUrl: zod_1.z.string().url().optional(),
        razorpayPaymentId: zod_1.z.string().optional(),
        razorpaySignature: zod_1.z.string().optional(),
        timestamp: DateOrString,
    })
        .strict(),
    zod_1.z
        .object({
        gateway: zod_1.z.literal('stripe'),
        transactionId: zod_1.z.string().optional(),
        paymentIntentId: zod_1.z.string().optional(),
        clientSecret: zod_1.z.string().optional(),
        timestamp: DateOrString,
    })
        .strict(),
    zod_1.z
        .object({
        gateway: zod_1.z.literal('paypal'),
        transactionId: zod_1.z.string().optional(),
        paypalOrderId: zod_1.z.string().optional(),
        captureId: zod_1.z.string().optional(),
        timestamp: DateOrString,
    })
        .strict(),
    zod_1.z
        .object({
        gateway: zod_1.z.literal('upi'),
        transactionId: zod_1.z.string().optional(),
        upiId: zod_1.z.string().optional(),
        qrCode: zod_1.z.string().optional(),
        expiryTime: DateOrString.optional(),
        timestamp: DateOrString,
    })
        .strict(),
    zod_1.z
        .object({
        gateway: zod_1.z.enum(['wallet', 'cod']),
        transactionId: zod_1.z.string().optional(),
        timestamp: DateOrString,
    })
        .strict(),
]);
exports.CreatePaymentSchema = zod_1.z
    .object({
    paymentId: zod_1.z.string().min(1, 'Payment ID is required'),
    orderId: zod_1.z.string().min(1, 'Order ID is required'),
    user: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, 'user must be an ObjectId'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    currency: zod_1.z.string().min(1, 'Currency is required').default('INR'),
    paymentMethod: exports.PAYMENT_METHOD,
    gateway: exports.PAYMENT_GATEWAY.optional(),
    purpose: exports.PAYMENT_PURPOSE.optional().default('order_payment'),
    userDetails: exports.PaymentUserDetailsSchema,
    metadata: exports.PaymentMetadataSchema.optional(),
    gatewayResponse: exports.PaymentGatewayResponseSchema.optional(),
})
    .strict();
exports.UpdatePaymentStatusSchema = zod_1.z
    .object({
    status: exports.PAYMENT_STATUS,
    failureReason: zod_1.z.string().optional(),
    walletCredited: zod_1.z.boolean().optional(),
    refundedAmount: zod_1.z.number().min(0).optional(),
    metadata: exports.PaymentMetadataSchema.optional(),
})
    .strict();
exports.PaymentResponseSchema = zod_1.z
    .object({
    _id: zod_1.z.string().optional(),
    paymentId: zod_1.z.string(),
    orderId: zod_1.z.string(),
    user: zod_1.z.string(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    paymentMethod: exports.PAYMENT_METHOD,
    gateway: exports.PAYMENT_GATEWAY.optional(),
    purpose: exports.PAYMENT_PURPOSE,
    status: exports.PAYMENT_STATUS,
    userDetails: exports.PaymentUserDetailsSchema,
    metadata: exports.PaymentMetadataSchema.optional(),
    gatewayResponse: exports.PaymentGatewayResponseSchema.optional(),
    failureReason: zod_1.z.string().optional(),
    walletCredited: zod_1.z.boolean().optional(),
    walletCreditedAt: DateOrString.optional(),
    completedAt: DateOrString.optional(),
    failedAt: DateOrString.optional(),
    expiresAt: DateOrString.optional(),
    refundedAmount: zod_1.z.number().min(0).optional(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
})
    .strip();
exports.PaymentListResponseSchema = zod_1.z.array(exports.PaymentResponseSchema);
//# sourceMappingURL=payment.schema.js.map