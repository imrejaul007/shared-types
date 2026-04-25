import { PaymentStatus, PaymentMethod, PaymentGateway } from '../enums/index';
export type PaymentPurpose = 'wallet_topup' | 'order_payment' | 'event_booking' | 'financial_service' | 'other';
export interface IPaymentUserDetails {
    name?: string;
    email?: string;
    phone?: string;
}
export interface PaymentMetadata {
    razorpayOrderId?: string;
    stripeWebhookId?: string;
    paypalOrderId?: string;
    [key: string]: string | number | boolean | null | undefined;
}
export type IPaymentGatewayResponse = {
    gateway: 'razorpay';
    transactionId?: string;
    paymentUrl?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    timestamp: Date | string;
} | {
    gateway: 'stripe';
    transactionId?: string;
    paymentIntentId?: string;
    clientSecret?: string;
    timestamp: Date | string;
} | {
    gateway: 'paypal';
    transactionId?: string;
    paypalOrderId?: string;
    captureId?: string;
    timestamp: Date | string;
} | {
    gateway: 'upi';
    transactionId?: string;
    upiId?: string;
    qrCode?: string;
    expiryTime?: Date | string;
    timestamp: Date | string;
} | {
    gateway: 'wallet' | 'cod';
    transactionId?: string;
    timestamp: Date | string;
};
export interface IPayment {
    _id?: string;
    paymentId: string;
    orderId: string;
    user: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    gateway?: PaymentGateway;
    purpose: PaymentPurpose;
    status: PaymentStatus;
    userDetails: IPaymentUserDetails;
    metadata: PaymentMetadata;
    gatewayResponse?: IPaymentGatewayResponse;
    failureReason?: string;
    walletCredited?: boolean;
    walletCreditedAt?: Date | string;
    completedAt?: Date | string;
    failedAt?: Date | string;
    expiresAt?: Date | string;
    refundedAmount?: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export { PAYMENT_STATE_TRANSITIONS } from '../fsm/paymentFsm';
//# sourceMappingURL=payment.d.ts.map