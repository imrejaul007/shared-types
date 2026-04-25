"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COIN_PRIORITY_ORDER = void 0;
exports.getValidNextWalletDebitCoin = getValidNextWalletDebitCoin;
const index_1 = require("../enums/index");
exports.COIN_PRIORITY_ORDER = [
    index_1.CoinType.PROMO,
    index_1.CoinType.BRANDED,
    index_1.CoinType.PRIVE,
    index_1.CoinType.CASHBACK,
    index_1.CoinType.REFERRAL,
    index_1.CoinType.REZ,
];
function getValidNextWalletDebitCoin(availableCoins) {
    for (const type of exports.COIN_PRIORITY_ORDER) {
        if (availableCoins.has(type))
            return type;
    }
    return null;
}
//# sourceMappingURL=wallet.js.map