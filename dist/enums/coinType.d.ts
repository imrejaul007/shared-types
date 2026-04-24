export declare enum CoinType {
    PROMO = "promo",
    BRANDED = "branded",
    PRIVE = "prive",
    CASHBACK = "cashback",
    REFERRAL = "referral",
    REZ = "rez"
}
export declare const COIN_TYPE_VALUES: readonly [CoinType.PROMO, CoinType.BRANDED, CoinType.PRIVE, CoinType.CASHBACK, CoinType.REFERRAL, CoinType.REZ];
export declare function isCanonicalCoinType(value: string): value is CoinType;
export declare function normalizeCoinType(type: string | null | undefined, fallback?: CoinType): CoinType;
export declare function normalizeCoinTypeAs<T extends CoinType>(type: string | null | undefined, assertType: T): T;
//# sourceMappingURL=coinType.d.ts.map