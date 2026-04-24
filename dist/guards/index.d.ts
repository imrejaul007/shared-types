import type { IOrder } from '../entities/order';
import type { IPayment } from '../entities/payment';
import type { IWallet } from '../entities/wallet';
import type { IUser } from '../entities/user';
import type { IProduct } from '../entities/product';
import { OrderStatus, PaymentStatus, CoinType } from '../enums/index';
export declare function isOrderResponse(value: unknown): value is IOrder;
export declare function isPaymentResponse(value: unknown): value is IPayment;
export declare function isWalletResponse(value: unknown): value is IWallet;
export declare function isUserResponse(value: unknown): value is IUser;
export declare function isProductResponse(value: unknown): value is IProduct;
export declare function asOrderStatus(v: unknown): OrderStatus | null;
export declare function asPaymentStatus(v: unknown): PaymentStatus | null;
export declare function asCoinType(v: unknown): CoinType | null;
export declare function isArrayOf<T>(value: unknown, itemGuard: (x: unknown) => x is T): value is T[];
export declare const __internal: {
    isObj: (v: unknown) => v is Record<string, unknown>;
    isNonEmptyString: (v: unknown) => v is string;
    isObjectIdString: (v: unknown) => v is string;
    isFiniteNumber: (v: unknown) => v is number;
    isDateOrString: (v: unknown) => boolean;
};
//# sourceMappingURL=index.d.ts.map