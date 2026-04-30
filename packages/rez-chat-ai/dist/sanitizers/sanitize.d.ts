import { Sanitizer } from '../types';
export declare const sensitiveDataSanitizer: Sanitizer;
export declare const cardNumberSanitizer: Sanitizer;
export declare const emailSanitizer: Sanitizer;
export declare const phoneSanitizer: Sanitizer;
export declare const idSanitizer: Sanitizer;
export declare const transactionSanitizer: Sanitizer;
export declare class DataSanitizer {
    private sanitizers;
    constructor(sanitizers?: Sanitizer[]);
    sanitize(text: string): string;
    sanitizeObject(obj: Record<string, unknown>): Record<string, unknown>;
    sanitizeChatMessage(message: string): string;
}
export declare const defaultSanitizer: DataSanitizer;
export interface SanitizedCustomerContext {
    name?: string;
    tier?: string;
    preferences?: Record<string, unknown>;
    totalSpent?: number;
    visitCount?: number;
    recentActivity?: string;
}
export declare function sanitizeCustomerContext(context: Record<string, unknown>): SanitizedCustomerContext;
//# sourceMappingURL=sanitize.d.ts.map