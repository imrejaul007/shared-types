import { OrderStatus, PaymentStatus } from '../enums/index';
import type { OrderPaymentStatus } from '../fsm/orderPaymentFsm';
export type FulfillmentType = 'delivery' | 'pickup' | 'drive_thru' | 'dine_in';
export type OrderItemType = 'product' | 'service' | 'event';
export type OrderServiceLocation = 'home' | 'store' | 'online';
export type OrderPaymentMethod = 'wallet' | 'card' | 'upi' | 'cod' | 'netbanking' | 'razorpay' | 'stripe';
export type OrderDeliveryMethod = 'standard' | 'express' | 'pickup' | 'drive_thru' | 'dine_in' | 'scheduled';
export type OrderDeliveryStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
export type OrderAnalyticsSource = 'app' | 'web' | 'social' | 'referral' | 'rendez';
export type OrderAddressType = 'home' | 'work' | 'other';
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';
export interface IOrderServiceBookingDetails {
    bookingDate: Date | string;
    timeSlot: {
        start: string;
        end: string;
    };
    duration: number;
    serviceType: OrderServiceLocation;
    customerNotes?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
}
export interface IOrderItem {
    product: string;
    store: string;
    storeName?: string;
    name: string;
    image: string;
    itemType: OrderItemType;
    quantity: number;
    variant?: {
        type: string;
        value: string;
    };
    price: number;
    originalPrice?: number;
    discount?: number;
    subtotal: number;
    serviceBookingId?: string;
    serviceBookingDetails?: IOrderServiceBookingDetails;
    smartSpendSource?: {
        smartSpendItemId: string;
        coinRewardRate: number;
    };
    sku?: string;
    specialInstructions?: string;
}
export interface IOrderTotals {
    subtotal: number;
    tax: number;
    delivery: number;
    discount: number;
    lockFeeDiscount?: number;
    cashback: number;
    total: number;
    paidAmount: number;
    refundAmount?: number;
    platformFee: number;
    merchantPayout: number;
}
export interface IOrderPayment {
    method: OrderPaymentMethod;
    status: OrderPaymentStatus;
    transactionId?: string;
    paymentGateway?: string;
    failureReason?: string;
    paidAt?: Date | string;
    refundId?: string;
    refundedAt?: Date | string;
    coinsUsed?: {
        rezCoins?: number;
        wasilCoins?: number;
        promoCoins?: number;
        storePromoCoins?: number;
        totalCoinsValue?: number;
    };
}
export interface IOrderAddress {
    name: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    coordinates?: [number, number];
    landmark?: string;
    addressType?: OrderAddressType;
}
export interface IFulfillmentDetails {
    storeAddress?: string;
    storeCoordinates?: [number, number];
    tableNumber?: string;
    vehicleInfo?: string;
    estimatedReadyTime?: Date | string;
    pickupInstructions?: string;
    driveThruLane?: string;
}
export interface IOrderDeliveryAttempt {
    attemptNumber: number;
    attemptedAt: Date | string;
    status: 'successful' | 'failed';
    reason?: string;
    nextAttemptAt?: Date | string;
}
export interface IOrderDelivery {
    method: OrderDeliveryMethod;
    status: OrderDeliveryStatus;
    address: IOrderAddress;
    estimatedTime?: Date | string;
    actualTime?: Date | string;
    dispatchedAt?: Date | string;
    deliveredAt?: Date | string;
    trackingId?: string;
    deliveryPartner?: string;
    deliveryFee: number;
    instructions?: string;
    deliveryOTP?: string;
    attempts?: IOrderDeliveryAttempt[];
}
export interface IOrderTimelineEntry {
    status: string;
    message: string;
    timestamp: Date | string;
    updatedBy?: string;
    metadata?: Record<string, string | number | boolean | null>;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    deliveryPartner?: {
        name: string;
        phone: string;
        vehicleNumber?: string;
        photo?: string;
    };
}
export interface IOrderAnalytics {
    source: OrderAnalyticsSource;
    campaign?: string;
    referralCode?: string;
    attributionPickId?: string;
    deviceInfo?: {
        platform: string;
        version: string;
        userAgent?: string;
    };
}
export interface IOrder {
    _id?: string;
    orderNumber: string;
    user: string;
    store?: string;
    fulfillmentType: FulfillmentType;
    fulfillmentDetails?: IFulfillmentDetails;
    items: IOrderItem[];
    totals: IOrderTotals;
    payment: IOrderPayment;
    delivery: IOrderDelivery;
    timeline: IOrderTimelineEntry[];
    analytics?: IOrderAnalytics;
    status: OrderStatus;
    couponCode?: string;
    redemption?: {
        code: string;
        discount: number;
        dealTitle?: string;
    };
    offerRedemption?: {
        code: string;
        cashback: number;
        offerTitle?: string;
    };
    notes?: string;
    specialInstructions?: string;
    cancelReason?: string;
    cancelledAt?: Date | string;
    cancelledBy?: string;
    returnReason?: string;
    returnedAt?: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
    invoiceUrl?: string;
    invoiceGeneratedAt?: Date | string;
    shippingLabelUrl?: string;
    packingSlipUrl?: string;
    cancellation?: {
        reason?: string;
        cancelledAt?: Date | string;
        cancelledBy?: string;
        refundAmount?: number;
        refundStatus?: 'pending' | 'completed' | 'failed' | 'not_applicable';
    };
    paymentStatus?: string;
    tracking?: {
        trackingId?: string;
        estimatedDelivery?: Date | string;
        deliveredAt?: Date | string;
    };
    estimatedDeliveryTime?: Date | string;
    deliveredAt?: Date | string;
    totalAmount?: number;
    rating?: {
        score: number;
        review?: string;
        ratedAt: Date | string;
    };
    paymentGateway?: {
        gatewayOrderId?: string;
        gatewayPaymentId?: string;
        gatewaySignature?: string;
        gateway: 'razorpay' | 'cod' | 'wallet';
        currency?: string;
        amountPaid?: number;
        paidAt?: Date | string;
        failureReason?: string;
        refundId?: string;
        refundedAt?: Date | string;
        refundAmount?: number;
    };
    idempotencyKey?: string;
    cashback?: {
        amount: number;
        status: 'pending' | 'credited' | 'reversed';
    };
    priority?: OrderPriority;
    deletedAt?: Date | string | null;
    isDeleted?: boolean;
    pendingOfferCashback?: number;
    disputeHold?: boolean;
    snapshotCashbackRate?: number;
    refundRetryCount?: number;
    flags?: string[];
    paymentRetryCount?: number;
    stateVersion?: number;
    stateTransitionHistory?: Array<{
        from: string;
        to: string;
        at: Date | string;
        by?: string;
    }>;
    kitchenItemStatus?: Record<string, string>;
    merchantCredit?: {
        status?: 'pending' | 'succeeded' | 'failed';
        failedAt?: Date | string;
        failureReason?: string;
        idempotencyKey?: string;
        retriedAt?: Date | string;
        retryCount?: number;
    };
    postPaymentProcessed?: boolean;
}
export type { PaymentStatus };
//# sourceMappingURL=order.d.ts.map