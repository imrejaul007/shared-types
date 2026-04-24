export type Brand<T, B extends string> = T & {
    readonly __brand: B;
};
export type OrderId = Brand<string, 'OrderId'>;
export type UserId = Brand<string, 'UserId'>;
export type MerchantId = Brand<string, 'MerchantId'>;
export type StoreId = Brand<string, 'StoreId'>;
export type ProductId = Brand<string, 'ProductId'>;
export type PaymentId = Brand<string, 'PaymentId'>;
export type WalletId = Brand<string, 'WalletId'>;
export type CategoryId = Brand<string, 'CategoryId'>;
export type CampaignId = Brand<string, 'CampaignId'>;
export type CouponId = Brand<string, 'CouponId'>;
export type RefundId = Brand<string, 'RefundId'>;
export declare function isObjectIdLike(s: unknown): s is string;
export declare const toOrderId: (s: unknown) => OrderId;
export declare const toUserId: (s: unknown) => UserId;
export declare const toMerchantId: (s: unknown) => MerchantId;
export declare const toStoreId: (s: unknown) => StoreId;
export declare const toProductId: (s: unknown) => ProductId;
export declare const toPaymentId: (s: unknown) => PaymentId;
export declare const toWalletId: (s: unknown) => WalletId;
export declare const toCategoryId: (s: unknown) => CategoryId;
export declare const toCampaignId: (s: unknown) => CampaignId;
export declare const toCouponId: (s: unknown) => CouponId;
export declare const toRefundId: (s: unknown) => RefundId;
//# sourceMappingURL=ids.d.ts.map