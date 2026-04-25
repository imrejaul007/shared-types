"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__internal = void 0;
exports.isOrderResponse = isOrderResponse;
exports.isPaymentResponse = isPaymentResponse;
exports.isWalletResponse = isWalletResponse;
exports.isUserResponse = isUserResponse;
exports.isProductResponse = isProductResponse;
exports.asOrderStatus = asOrderStatus;
exports.asPaymentStatus = asPaymentStatus;
exports.asCoinType = asCoinType;
exports.isArrayOf = isArrayOf;
const index_1 = require("../enums/index");
const OBJECT_ID = /^[a-fA-F0-9]{24}$/;
const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const isObjectIdString = (v) => typeof v === 'string' && OBJECT_ID.test(v);
const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v);
const isDateOrString = (v) => typeof v === 'string' || (v instanceof Date && !Number.isNaN(v.getTime()));
const ORDER_STATUS_SET = new Set(Object.values(index_1.OrderStatus));
const PAYMENT_STATUS_SET = new Set(Object.values(index_1.PaymentStatus));
const COIN_TYPE_SET = new Set(Object.values(index_1.CoinType));
function isOrderResponse(value) {
    if (!isObj(value))
        return false;
    if (!isNonEmptyString(value.orderNumber))
        return false;
    if (!isObjectIdString(value.user))
        return false;
    if (typeof value.status !== 'string' || !ORDER_STATUS_SET.has(value.status))
        return false;
    if (!Array.isArray(value.items) || value.items.length === 0)
        return false;
    const totals = value.totals;
    if (!isObj(totals) || !isFiniteNumber(totals.total))
        return false;
    return true;
}
function isPaymentResponse(value) {
    if (!isObj(value))
        return false;
    if (!isNonEmptyString(value.paymentId))
        return false;
    if (!isNonEmptyString(value.orderId))
        return false;
    if (!isObjectIdString(value.user))
        return false;
    if (typeof value.status !== 'string' || !PAYMENT_STATUS_SET.has(value.status))
        return false;
    if (!isFiniteNumber(value.amount) || value.amount < 0)
        return false;
    return true;
}
function isWalletResponse(value) {
    if (!isObj(value))
        return false;
    if (!isObjectIdString(value.user) && !isNonEmptyString(value.user))
        return false;
    const balance = value.balance;
    if (!isObj(balance))
        return false;
    if (!isFiniteNumber(balance.total) ||
        !isFiniteNumber(balance.available) ||
        !isFiniteNumber(balance.pending) ||
        !isFiniteNumber(balance.cashback)) {
        return false;
    }
    if (!Array.isArray(value.coins))
        return false;
    return true;
}
function isUserResponse(value) {
    if (!isObj(value))
        return false;
    if (!isNonEmptyString(value.phoneNumber))
        return false;
    if (!isObj(value.profile))
        return false;
    if (!isObj(value.auth))
        return false;
    if (!isObj(value.referral))
        return false;
    if (!isNonEmptyString(value.role))
        return false;
    return true;
}
function isProductResponse(value) {
    if (!isObj(value))
        return false;
    if (!isNonEmptyString(value.name))
        return false;
    if (!isNonEmptyString(value.sku))
        return false;
    const pricing = value.pricing;
    if (!isObj(pricing))
        return false;
    if (!isFiniteNumber(pricing.selling) || pricing.selling <= 0)
        return false;
    if (!isFiniteNumber(pricing.original) || pricing.original <= 0)
        return false;
    if (pricing.selling > pricing.original)
        return false;
    return true;
}
function asOrderStatus(v) {
    return typeof v === 'string' && ORDER_STATUS_SET.has(v) ? v : null;
}
function asPaymentStatus(v) {
    return typeof v === 'string' && PAYMENT_STATUS_SET.has(v) ? v : null;
}
function asCoinType(v) {
    return typeof v === 'string' && COIN_TYPE_SET.has(v) ? v : null;
}
function isArrayOf(value, itemGuard) {
    return Array.isArray(value) && value.every(itemGuard);
}
exports.__internal = { isObj, isNonEmptyString, isObjectIdString, isFiniteNumber, isDateOrString };
//# sourceMappingURL=index.js.map