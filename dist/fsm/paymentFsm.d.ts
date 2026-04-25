import { PaymentStatus } from '../enums/index';
export declare const PAYMENT_STATE_TRANSITIONS: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>>;
export declare function isValidPaymentTransition(from: PaymentStatus, to: PaymentStatus): boolean;
export declare function assertValidPaymentTransition(from: PaymentStatus, to: PaymentStatus): void;
export declare function getValidNextPaymentStates(from: PaymentStatus): readonly PaymentStatus[];
export declare function isTerminalPaymentStatus(status: PaymentStatus): boolean;
export declare const PAYMENT_SUCCESS_STATES: ReadonlySet<PaymentStatus>;
export declare const PAYMENT_FAILURE_STATES: ReadonlySet<PaymentStatus>;
export declare const PAYMENT_REFUND_STATES: ReadonlySet<PaymentStatus>;
export declare function isPaymentOutcomeState(s: PaymentStatus): boolean;
//# sourceMappingURL=paymentFsm.d.ts.map