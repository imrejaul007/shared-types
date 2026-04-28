export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 'api' | 'tool' | 'memory' | 'socket' | 'auth' | 'validation' | 'unknown';
export interface TrackedError {
    id: string;
    timestamp: Date;
    severity: ErrorSeverity;
    category: ErrorCategory;
    message: string;
    stack?: string;
    context: ErrorContext;
    userId?: string;
    conversationId?: string;
    retryable: boolean;
    resolved: boolean;
    resolvedAt?: Date;
}
export interface ErrorContext {
    appType?: string;
    toolName?: string;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    duration?: number;
    metadata?: Record<string, unknown>;
}
export interface ErrorSummary {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<ErrorCategory, number>;
    recent: TrackedError[];
    criticalErrors: TrackedError[];
    errorRate: number;
    topErrors: Array<{
        message: string;
        count: number;
        lastSeen: Date;
    }>;
}
export declare class ErrorTracker {
    private errors;
    private errorCounts;
    private lastSeen;
    private maxErrors;
    private alertCallbacks;
    trackError(error: {
        severity: ErrorSeverity;
        category: ErrorCategory;
        message: string;
        stack?: string;
        context?: ErrorContext;
        userId?: string;
        conversationId?: string;
        retryable?: boolean;
    }): string;
    private getErrorKey;
    onAlert(callback: (error: TrackedError) => void): void;
    private triggerAlerts;
    resolveError(errorId: string): boolean;
    resolveByContext(conversationId: string): number;
    getError(errorId: string): TrackedError | undefined;
    getErrorsByConversation(conversationId: string): TrackedError[];
    getErrorsByUser(userId: string): TrackedError[];
    getUnresolved(): TrackedError[];
    getCritical(): TrackedError[];
    getSummary(): ErrorSummary;
    private cleanup;
    export(): TrackedError[];
    clear(): void;
}
export declare function getErrorTracker(): ErrorTracker;
export default ErrorTracker;
//# sourceMappingURL=errorTracker.d.ts.map