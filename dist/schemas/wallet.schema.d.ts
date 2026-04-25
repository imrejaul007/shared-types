import { z } from 'zod';
export declare const COIN_TYPE: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
export declare const COIN_TRANSACTION_TYPE: z.ZodEnum<["earned", "spent", "expired", "refunded", "bonus", "branded_award"]>;
export declare const TRANSACTION_STATUS: z.ZodEnum<["pending", "completed", "failed"]>;
export declare const WalletBalanceSchema: z.ZodObject<{
    total: z.ZodNumber;
    available: z.ZodNumber;
    pending: z.ZodNumber;
    cashback: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    cashback: number;
    pending: number;
    total: number;
    available: number;
}, {
    cashback: number;
    pending: number;
    total: number;
    available: number;
}>;
export declare const CoinSchema: z.ZodObject<{
    type: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
    amount: z.ZodNumber;
    isActive: z.ZodBoolean;
    earnedDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    lastUsed: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    lastEarned: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    color: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    amount: number;
    type: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    isActive: boolean;
    earnedDate?: string | Date | undefined;
    lastUsed?: string | Date | undefined;
    lastEarned?: string | Date | undefined;
    expiryDate?: string | Date | undefined;
    color?: string | undefined;
}, {
    amount: number;
    type: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    isActive: boolean;
    earnedDate?: string | Date | undefined;
    lastUsed?: string | Date | undefined;
    lastEarned?: string | Date | undefined;
    expiryDate?: string | Date | undefined;
    color?: string | undefined;
}>;
export declare const BrandedCoinSchema: z.ZodObject<{
    merchantId: z.ZodString;
    merchantName: z.ZodString;
    merchantLogo: z.ZodOptional<z.ZodString>;
    merchantColor: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    earnedDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    lastUsed: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    expiresAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    isActive: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    merchantId: string;
    amount: number;
    isActive: boolean;
    earnedDate: string | Date;
    merchantName: string;
    expiresAt?: string | Date | undefined;
    lastUsed?: string | Date | undefined;
    merchantLogo?: string | undefined;
    merchantColor?: string | undefined;
}, {
    merchantId: string;
    amount: number;
    isActive: boolean;
    earnedDate: string | Date;
    merchantName: string;
    expiresAt?: string | Date | undefined;
    lastUsed?: string | Date | undefined;
    merchantLogo?: string | undefined;
    merchantColor?: string | undefined;
}>;
export declare const WalletDebitSchema: z.ZodObject<{
    user: z.ZodString;
    amount: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    idempotencyKey: z.ZodString;
}, "strict", z.ZodTypeAny, {
    user: string;
    amount: number;
    idempotencyKey: string;
    description: string;
    source: string;
    merchantId?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    sourceId?: string | undefined;
}, {
    user: string;
    amount: number;
    idempotencyKey: string;
    description: string;
    source: string;
    merchantId?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    sourceId?: string | undefined;
}>;
export declare const WalletCreditSchema: z.ZodObject<{
    user: z.ZodString;
    coinType: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
    amount: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    idempotencyKey: z.ZodString;
}, "strict", z.ZodTypeAny, {
    user: string;
    amount: number;
    idempotencyKey: string;
    description: string;
    source: string;
    coinType: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    merchantId?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    expiryDate?: string | Date | undefined;
    sourceId?: string | undefined;
}, {
    user: string;
    amount: number;
    idempotencyKey: string;
    description: string;
    source: string;
    coinType: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    merchantId?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    expiryDate?: string | Date | undefined;
    sourceId?: string | undefined;
}>;
export declare const CoinTransactionResponseSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    user: z.ZodString;
    type: z.ZodEnum<["earned", "spent", "expired", "refunded", "bonus", "branded_award"]>;
    coinType: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
    amount: z.ZodNumber;
    balanceBefore: z.ZodNumber;
    balanceAfter: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "completed", "failed"]>;
    createdAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    user: string;
    status: "pending" | "completed" | "failed";
    amount: number;
    type: "bonus" | "refunded" | "expired" | "earned" | "spent" | "branded_award";
    createdAt: string | Date;
    description: string;
    source: string;
    coinType: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore: number;
    balanceAfter: number;
    merchantId?: string | undefined;
    idempotencyKey?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    _id?: string | undefined;
    updatedAt?: string | Date | undefined;
    sourceId?: string | undefined;
}, {
    user: string;
    status: "pending" | "completed" | "failed";
    amount: number;
    type: "bonus" | "refunded" | "expired" | "earned" | "spent" | "branded_award";
    createdAt: string | Date;
    description: string;
    source: string;
    coinType: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore: number;
    balanceAfter: number;
    merchantId?: string | undefined;
    idempotencyKey?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    _id?: string | undefined;
    updatedAt?: string | Date | undefined;
    sourceId?: string | undefined;
}>;
export declare const CoinTransactionListResponseSchema: z.ZodArray<z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    user: z.ZodString;
    type: z.ZodEnum<["earned", "spent", "expired", "refunded", "bonus", "branded_award"]>;
    coinType: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
    amount: z.ZodNumber;
    balanceBefore: z.ZodNumber;
    balanceAfter: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "completed", "failed"]>;
    createdAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    user: string;
    status: "pending" | "completed" | "failed";
    amount: number;
    type: "bonus" | "refunded" | "expired" | "earned" | "spent" | "branded_award";
    createdAt: string | Date;
    description: string;
    source: string;
    coinType: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore: number;
    balanceAfter: number;
    merchantId?: string | undefined;
    idempotencyKey?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    _id?: string | undefined;
    updatedAt?: string | Date | undefined;
    sourceId?: string | undefined;
}, {
    user: string;
    status: "pending" | "completed" | "failed";
    amount: number;
    type: "bonus" | "refunded" | "expired" | "earned" | "spent" | "branded_award";
    createdAt: string | Date;
    description: string;
    source: string;
    coinType: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore: number;
    balanceAfter: number;
    merchantId?: string | undefined;
    idempotencyKey?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    _id?: string | undefined;
    updatedAt?: string | Date | undefined;
    sourceId?: string | undefined;
}>, "many">;
export declare const WalletBalanceResponseSchema: z.ZodObject<{
    user: z.ZodString;
    balance: z.ZodObject<{
        total: z.ZodNumber;
        available: z.ZodNumber;
        pending: z.ZodNumber;
        cashback: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        cashback: number;
        pending: number;
        total: number;
        available: number;
    }, {
        cashback: number;
        pending: number;
        total: number;
        available: number;
    }>;
    coins: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
        amount: z.ZodNumber;
        isActive: z.ZodBoolean;
        earnedDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        lastUsed: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        lastEarned: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        color: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        amount: number;
        type: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
        isActive: boolean;
        earnedDate?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        lastEarned?: string | Date | undefined;
        expiryDate?: string | Date | undefined;
        color?: string | undefined;
    }, {
        amount: number;
        type: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
        isActive: boolean;
        earnedDate?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        lastEarned?: string | Date | undefined;
        expiryDate?: string | Date | undefined;
        color?: string | undefined;
    }>, "many">;
    brandedCoins: z.ZodOptional<z.ZodArray<z.ZodObject<{
        merchantId: z.ZodString;
        merchantName: z.ZodString;
        merchantLogo: z.ZodOptional<z.ZodString>;
        merchantColor: z.ZodOptional<z.ZodString>;
        amount: z.ZodNumber;
        earnedDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
        lastUsed: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        expiresAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        isActive: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        merchantId: string;
        amount: number;
        isActive: boolean;
        earnedDate: string | Date;
        merchantName: string;
        expiresAt?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        merchantLogo?: string | undefined;
        merchantColor?: string | undefined;
    }, {
        merchantId: string;
        amount: number;
        isActive: boolean;
        earnedDate: string | Date;
        merchantName: string;
        expiresAt?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        merchantLogo?: string | undefined;
        merchantColor?: string | undefined;
    }>, "many">>;
    currency: z.ZodString;
    isFrozen: z.ZodBoolean;
    isActive: z.ZodBoolean;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    user: string;
    coins: {
        amount: number;
        type: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
        isActive: boolean;
        earnedDate?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        lastEarned?: string | Date | undefined;
        expiryDate?: string | Date | undefined;
        color?: string | undefined;
    }[];
    balance: {
        cashback: number;
        pending: number;
        total: number;
        available: number;
    };
    currency: string;
    isActive: boolean;
    isFrozen: boolean;
    updatedAt?: string | Date | undefined;
    brandedCoins?: {
        merchantId: string;
        amount: number;
        isActive: boolean;
        earnedDate: string | Date;
        merchantName: string;
        expiresAt?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        merchantLogo?: string | undefined;
        merchantColor?: string | undefined;
    }[] | undefined;
}, {
    user: string;
    coins: {
        amount: number;
        type: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
        isActive: boolean;
        earnedDate?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        lastEarned?: string | Date | undefined;
        expiryDate?: string | Date | undefined;
        color?: string | undefined;
    }[];
    balance: {
        cashback: number;
        pending: number;
        total: number;
        available: number;
    };
    currency: string;
    isActive: boolean;
    isFrozen: boolean;
    updatedAt?: string | Date | undefined;
    brandedCoins?: {
        merchantId: string;
        amount: number;
        isActive: boolean;
        earnedDate: string | Date;
        merchantName: string;
        expiresAt?: string | Date | undefined;
        lastUsed?: string | Date | undefined;
        merchantLogo?: string | undefined;
        merchantColor?: string | undefined;
    }[] | undefined;
}>;
export type WalletDebitRequest = z.infer<typeof WalletDebitSchema>;
export type WalletCreditRequest = z.infer<typeof WalletCreditSchema>;
export type CoinTransactionResponse = z.infer<typeof CoinTransactionResponseSchema>;
export type CoinTransactionListResponse = z.infer<typeof CoinTransactionListResponseSchema>;
export type WalletBalanceResponse = z.infer<typeof WalletBalanceResponseSchema>;
export type CoinType = z.infer<typeof COIN_TYPE>;
export type CoinTransactionType = z.infer<typeof COIN_TRANSACTION_TYPE>;
export type TransactionStatus = z.infer<typeof TRANSACTION_STATUS>;
export declare const COIN_PRIORITY_ORDER: readonly CoinType[];
//# sourceMappingURL=wallet.schema.d.ts.map