import { FinanceTransactionType, FinanceTransactionStatus } from '../enums/index';
export interface IFinanceTransactionMetadata {
    customerRef?: string;
    receiptNumber?: string;
    circle?: string;
    planId?: string;
    bbpsRequestId?: string;
    [key: string]: string | number | boolean | null | undefined;
}
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
    metadata?: IFinanceTransactionMetadata;
    createdAt: Date | string;
    updatedAt: Date | string;
}
//# sourceMappingURL=finance.d.ts.map