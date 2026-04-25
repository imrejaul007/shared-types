"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_REFUND_STATES = exports.PAYMENT_FAILURE_STATES = exports.PAYMENT_SUCCESS_STATES = exports.PAYMENT_STATE_TRANSITIONS = void 0;
exports.isValidPaymentTransition = isValidPaymentTransition;
exports.assertValidPaymentTransition = assertValidPaymentTransition;
exports.getValidNextPaymentStates = getValidNextPaymentStates;
exports.isTerminalPaymentStatus = isTerminalPaymentStatus;
exports.isPaymentOutcomeState = isPaymentOutcomeState;
const index_1 = require("../enums/index");
exports.PAYMENT_STATE_TRANSITIONS = {
    [index_1.PaymentStatus.PENDING]: [index_1.PaymentStatus.PROCESSING, index_1.PaymentStatus.CANCELLED, index_1.PaymentStatus.EXPIRED],
    [index_1.PaymentStatus.PROCESSING]: [index_1.PaymentStatus.COMPLETED, index_1.PaymentStatus.FAILED],
    [index_1.PaymentStatus.COMPLETED]: [index_1.PaymentStatus.REFUND_INITIATED],
    [index_1.PaymentStatus.FAILED]: [index_1.PaymentStatus.PENDING],
    [index_1.PaymentStatus.CANCELLED]: [],
    [index_1.PaymentStatus.EXPIRED]: [],
    [index_1.PaymentStatus.REFUND_INITIATED]: [index_1.PaymentStatus.REFUND_PROCESSING],
    [index_1.PaymentStatus.REFUND_PROCESSING]: [
        index_1.PaymentStatus.REFUNDED,
        index_1.PaymentStatus.PARTIALLY_REFUNDED,
        index_1.PaymentStatus.REFUND_FAILED,
    ],
    [index_1.PaymentStatus.REFUNDED]: [],
    [index_1.PaymentStatus.REFUND_FAILED]: [index_1.PaymentStatus.REFUND_INITIATED],
    [index_1.PaymentStatus.PARTIALLY_REFUNDED]: [index_1.PaymentStatus.REFUND_INITIATED],
};
function isValidPaymentTransition(from, to) {
    const allowed = exports.PAYMENT_STATE_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
}
function assertValidPaymentTransition(from, to) {
    if (!isValidPaymentTransition(from, to)) {
        const allowed = exports.PAYMENT_STATE_TRANSITIONS[from] ?? [];
        throw new Error(`Invalid payment status transition: ${from} → ${to}. ` +
            `Allowed from ${from}: [${allowed.join(', ') || 'none (terminal)'}]`);
    }
}
function getValidNextPaymentStates(from) {
    return exports.PAYMENT_STATE_TRANSITIONS[from] ?? [];
}
function isTerminalPaymentStatus(status) {
    return getValidNextPaymentStates(status).length === 0;
}
exports.PAYMENT_SUCCESS_STATES = new Set([index_1.PaymentStatus.COMPLETED]);
exports.PAYMENT_FAILURE_STATES = new Set([
    index_1.PaymentStatus.FAILED,
    index_1.PaymentStatus.CANCELLED,
    index_1.PaymentStatus.EXPIRED,
]);
exports.PAYMENT_REFUND_STATES = new Set([
    index_1.PaymentStatus.REFUND_INITIATED,
    index_1.PaymentStatus.REFUND_PROCESSING,
    index_1.PaymentStatus.REFUNDED,
    index_1.PaymentStatus.REFUND_FAILED,
    index_1.PaymentStatus.PARTIALLY_REFUNDED,
]);
function isPaymentOutcomeState(s) {
    return (exports.PAYMENT_SUCCESS_STATES.has(s) ||
        exports.PAYMENT_FAILURE_STATES.has(s) ||
        s === index_1.PaymentStatus.REFUNDED ||
        s === index_1.PaymentStatus.REFUND_FAILED);
}
//# sourceMappingURL=paymentFsm.js.map