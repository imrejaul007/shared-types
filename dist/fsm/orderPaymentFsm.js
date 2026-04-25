"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_PAYMENT_STATE_TRANSITIONS = exports.ORDER_PAYMENT_STATUSES = void 0;
exports.isValidOrderPaymentTransition = isValidOrderPaymentTransition;
exports.assertValidOrderPaymentTransition = assertValidOrderPaymentTransition;
exports.getValidNextOrderPaymentStates = getValidNextOrderPaymentStates;
exports.mapPaymentStatusToOrderPaymentStatus = mapPaymentStatusToOrderPaymentStatus;
exports.ORDER_PAYMENT_STATUSES = [
    'pending',
    'awaiting_payment',
    'processing',
    'authorized',
    'paid',
    'partially_refunded',
    'refunded',
    'failed',
];
exports.ORDER_PAYMENT_STATE_TRANSITIONS = {
    pending: ['awaiting_payment', 'failed'],
    awaiting_payment: ['processing', 'failed'],
    processing: ['authorized', 'paid', 'failed'],
    authorized: ['paid', 'failed'],
    paid: ['partially_refunded', 'refunded'],
    partially_refunded: ['partially_refunded', 'refunded'],
    failed: [],
    refunded: [],
};
function isValidOrderPaymentTransition(from, to) {
    const allowed = exports.ORDER_PAYMENT_STATE_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
}
function assertValidOrderPaymentTransition(from, to) {
    if (!isValidOrderPaymentTransition(from, to)) {
        const allowed = exports.ORDER_PAYMENT_STATE_TRANSITIONS[from] ?? [];
        throw new Error(`Invalid order-payment status transition: ${from} → ${to}. ` +
            `Allowed from ${from}: [${allowed.join(', ') || 'none (terminal)'}]`);
    }
}
function getValidNextOrderPaymentStates(from) {
    return exports.ORDER_PAYMENT_STATE_TRANSITIONS[from] ?? [];
}
function mapPaymentStatusToOrderPaymentStatus(paymentStatus) {
    switch (paymentStatus) {
        case 'pending':
            return 'pending';
        case 'processing':
            return 'processing';
        case 'completed':
            return 'paid';
        case 'failed':
            return 'failed';
        case 'cancelled':
        case 'expired':
            return 'failed';
        case 'refunded':
            return 'refunded';
        case 'partially_refunded':
            return 'partially_refunded';
        default:
            return undefined;
    }
}
//# sourceMappingURL=orderPaymentFsm.js.map