"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COIN_TYPE_VALUES = exports.CoinType = void 0;
exports.isCanonicalCoinType = isCanonicalCoinType;
exports.normalizeCoinType = normalizeCoinType;
exports.normalizeCoinTypeAs = normalizeCoinTypeAs;
var CoinType;
(function (CoinType) {
    CoinType["PROMO"] = "promo";
    CoinType["BRANDED"] = "branded";
    CoinType["PRIVE"] = "prive";
    CoinType["CASHBACK"] = "cashback";
    CoinType["REFERRAL"] = "referral";
    CoinType["REZ"] = "rez";
})(CoinType || (exports.CoinType = CoinType = {}));
const COIN_TYPE_ALIASES = {
    nuqta: CoinType.REZ,
    wasil_coins: CoinType.REZ,
    wasil_bonus: CoinType.REZ,
    earning: CoinType.REZ,
    earnings: CoinType.REZ,
    karma_points: CoinType.REZ,
    karma_coins: CoinType.REZ,
    rez_coins: CoinType.REZ,
    branded_coin: CoinType.BRANDED,
    branded_coins: CoinType.BRANDED,
    prive_coins: CoinType.PRIVE,
    loyalty: CoinType.REZ,
    reward: CoinType.PROMO,
    bonus: CoinType.PROMO,
    promotional: CoinType.PROMO,
    promotional_coins: CoinType.PROMO,
    promo: CoinType.PROMO,
    branded: CoinType.BRANDED,
    prive: CoinType.PRIVE,
    cashback: CoinType.CASHBACK,
    referral: CoinType.REFERRAL,
    rez: CoinType.REZ,
};
exports.COIN_TYPE_VALUES = [
    CoinType.PROMO,
    CoinType.BRANDED,
    CoinType.PRIVE,
    CoinType.CASHBACK,
    CoinType.REFERRAL,
    CoinType.REZ,
];
function isCanonicalCoinType(value) {
    return exports.COIN_TYPE_VALUES.includes(value);
}
function normalizeCoinType(type, fallback = CoinType.REZ) {
    if (!type)
        return fallback;
    const normalized = type.toLowerCase().trim();
    return COIN_TYPE_ALIASES[normalized] ?? fallback;
}
function normalizeCoinTypeAs(type, assertType) {
    const normalized = normalizeCoinType(type, assertType);
    if (normalized === assertType)
        return assertType;
    throw new Error(`Expected coin type ${assertType} but got ${normalized} (from input ${type})`);
}
//# sourceMappingURL=coinType.js.map