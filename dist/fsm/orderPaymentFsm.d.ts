export type OrderPaymentStatus = 'pending' | 'awaiting_payment' | 'processing' | 'authorized' | 'paid' | 'partially_refunded' | 'refunded' | 'failed';
export declare const ORDER_PAYMENT_STATUSES: readonly OrderPaymentStatus[];
export declare const ORDER_PAYMENT_STATE_TRANSITIONS: Readonly<Record<OrderPaymentStatus, readonly OrderPaymentStatus[]>>;
export declare function isValidOrderPaymentTransition(from: OrderPaymentStatus, to: OrderPaymentStatus): boolean;
export declare function assertValidOrderPaymentTransition(from: OrderPaymentStatus, to: OrderPaymentStatus): void;
export declare function getValidNextOrderPaymentStates(from: OrderPaymentStatus): readonly OrderPaymentStatus[];
export declare function mapPaymentStatusToOrderPaymentStatus(paymentStatus: string): OrderPaymentStatus | undefined;
//# sourceMappingURL=orderPaymentFsm.d.ts.map