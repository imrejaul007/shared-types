"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRefundId = exports.toCouponId = exports.toCampaignId = exports.toCategoryId = exports.toWalletId = exports.toPaymentId = exports.toProductId = exports.toStoreId = exports.toMerchantId = exports.toUserId = exports.toOrderId = void 0;
exports.isObjectIdLike = isObjectIdLike;
const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/;
function isObjectIdLike(s) {
    return typeof s === 'string' && OBJECT_ID_REGEX.test(s);
}
function assertObjectIdLike(s, label) {
    if (!isObjectIdLike(s)) {
        throw new Error(`${label} must be a 24-char hex ObjectId, got: ${JSON.stringify(s)}`);
    }
    return s;
}
const toOrderId = (s) => assertObjectIdLike(s, 'OrderId');
exports.toOrderId = toOrderId;
const toUserId = (s) => assertObjectIdLike(s, 'UserId');
exports.toUserId = toUserId;
const toMerchantId = (s) => assertObjectIdLike(s, 'MerchantId');
exports.toMerchantId = toMerchantId;
const toStoreId = (s) => assertObjectIdLike(s, 'StoreId');
exports.toStoreId = toStoreId;
const toProductId = (s) => assertObjectIdLike(s, 'ProductId');
exports.toProductId = toProductId;
const toPaymentId = (s) => {
    if (typeof s !== 'string' || s.trim().length === 0) {
        throw new Error(`PaymentId must be a non-empty string, got: ${JSON.stringify(s)}`);
    }
    return s;
};
exports.toPaymentId = toPaymentId;
const toWalletId = (s) => assertObjectIdLike(s, 'WalletId');
exports.toWalletId = toWalletId;
const toCategoryId = (s) => assertObjectIdLike(s, 'CategoryId');
exports.toCategoryId = toCategoryId;
const toCampaignId = (s) => assertObjectIdLike(s, 'CampaignId');
exports.toCampaignId = toCampaignId;
const toCouponId = (s) => assertObjectIdLike(s, 'CouponId');
exports.toCouponId = toCouponId;
const toRefundId = (s) => assertObjectIdLike(s, 'RefundId');
exports.toRefundId = toRefundId;
//# sourceMappingURL=ids.js.map