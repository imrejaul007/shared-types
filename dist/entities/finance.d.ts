import { FinanceTransactionType, FinanceTransactionStatus } from '../enums/index';
export interface IFinanceTransaction {
    _id?: string;
    userId: string;
    type: FinanceTransactionType;
    status: FinanceTransactionStatus;
    amount: number;
    currency: string;
    operator?: string;
    billerId?: string;
    accountNumber?: string;
    loanApplicationId?: string;
    orderId?: string;
    partnerId: string;
    partnerTxId?: string;
    failureReason?: string;
    coinsAwarded: number;
    parentId?: string;
    parentType?: 'Payment' | 'LoanApplication' | 'Order';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=finance.d.ts.map