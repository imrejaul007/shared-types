import { CoinType, CoinTransactionType, TransactionStatus } from '../enums/index';
import type { MerchantId, UserId, WalletId } from '../branded/ids';
export interface IBrandedCoinDetails {
    merchantId: string | MerchantId;
    merchantName: string;
    merchantLogo?: string;
    merchantColor?: string;
}
export interface IPromoCoinDetails {
    campaignId?: string;
    campaignName?: string;
    maxRedemptionPercentage: number;
    expiryDate: Date | string;
}
export interface ICoin {
    type: CoinType;
    amount: number;
    isActive: boolean;
    earnedDate?: Date | string;
    lastUsed?: Date | string;
    lastEarned?: Date | string;
    expiryDate?: Date | string;
    color: string;
    brandedDetails?: IBrandedCoinDetails;
    promoDetails?: IPromoCoinDetails;
}
export interface IBrandedCoin {
    merchantId: string | MerchantId;
    merchantName: string;
    merchantLogo?: string;
    merchantColor?: string;
    amount: number;
    earnedDate: Date | string;
    lastUsed?: Date | string;
    expiresAt?: Date | string;
    isActive: boolean;
}
export interface ICategoryBalance {
    available: number;
    earned: number;
    spent: number;
}
export interface IWalletBalance {
    total: number;
    available: number;
    pending: number;
    cashback: number;
}
export interface IWalletStatistics {
    totalEarned: number;
    totalSpent: number;
    totalCashback: number;
    totalRefunds: number;
    totalTopups: number;
    totalWithdrawals: number;
}
export interface IWalletLimits {
    maxBalance: number;
    minWithdrawal: number;
    dailySpendLimit: number;
    dailySpent: number;
    lastResetDate: Date | string;
}
export interface IWalletSavingsInsights {
    totalSaved: number;
    thisMonth: number;
    avgPerVisit: number;
    lastCalculated: Date | string;
    topCategory: string;
    topMerchant: {
        id: string;
        name: string;
    };
    monthlyTrend: number[];
    weeklySpend: number;
    savedVsAvgUser: number;
    potentialMissedSavings: number;
    favoriteStores: Array<{
        id: string;
        name: string;
        visits: number;
    }>;
}
export interface IWalletSettings {
    autoTopup: boolean;
    autoTopupThreshold: number;
    autoTopupAmount: number;
    lowBalanceAlert: boolean;
    lowBalanceThreshold: number;
    smartAlertsEnabled: boolean;
    expiringCoinsAlertDays: number;
}
export interface IWallet {
    _id?: string | WalletId;
    user: string | UserId;
    balance: IWalletBalance;
    coins: ICoin[];
    brandedCoins: IBrandedCoin[];
    categoryBalances: Record<string, ICategoryBalance>;
    currency: string;
    statistics: IWalletStatistics;
    savingsInsights: IWalletSavingsInsights;
    limits: IWalletLimits;
    settings: IWalletSettings;
    isActive: boolean;
    isFrozen: boolean;
    frozenReason?: string;
    frozenAt?: Date | string;
    lastTransactionAt?: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface ICoinTransaction {
    _id?: string;
    user: string;
    type: CoinTransactionType;
    coinType: CoinType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    source: string;
    sourceId?: string;
    description: string;
    merchantId?: string;
    metadata?: Record<string, string | number | boolean | null>;
    idempotencyKey?: string;
    status: TransactionStatus;
    createdAt: Date | string;
    updatedAt?: Date | string;
}
export declare const COIN_PRIORITY_ORDER: readonly CoinType[];
export declare function getValidNextWalletDebitCoin(availableCoins: ReadonlySet<CoinType>): CoinType | null;
//# sourceMappingURL=wallet.d.ts.map