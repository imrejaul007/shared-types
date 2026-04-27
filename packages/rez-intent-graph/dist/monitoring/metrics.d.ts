export type MetricType = 'counter' | 'gauge' | 'histogram' | 'timer';
export interface Metric {
    name: string;
    type: MetricType;
    value: number;
    timestamp: number;
    labels: Record<string, string>;
}
export interface MetricSummary {
    name: string;
    type: MetricType;
    count: number;
    sum: number;
    min: number;
    max: number;
    avg: number;
    labels: Record<string, string>;
}
declare class MetricsStore {
    private metrics;
    private summaries;
    private maxHistorySize;
    /**
     * Record a metric
     */
    record(name: string, value: number, type: MetricType, labels?: Record<string, string>): void;
    /**
     * Increment a counter
     */
    increment(name: string, labels?: Record<string, string>): void;
    /**
     * Set a gauge value
     */
    gauge(name: string, value: number, labels?: Record<string, string>): void;
    /**
     * Record timing
     */
    timing(name: string, durationMs: number, labels?: Record<string, string>): void;
    /**
     * Update summary statistics
     */
    private updateSummary;
    /**
     * Get current value for a gauge
     */
    getGauge(name: string, labels?: Record<string, string>): number | null;
    /**
     * Get summary statistics
     */
    getSummary(name: string, labels?: Record<string, string>): MetricSummary | null;
    /**
     * Get all summaries
     */
    getAllSummaries(): MetricSummary[];
    /**
     * Get metrics history
     */
    getHistory(name: string, labels?: Record<string, string>, limit?: number): Metric[];
    /**
     * Clear all metrics
     */
    clear(): void;
    /**
     * Generate key from name and labels
     */
    private getKey;
}
export declare const metricsStore: MetricsStore;
export declare const METRICS: {
    readonly INTENT_CAPTURED: "intent_captured";
    readonly INTENT_DORMANT: "intent_dormant";
    readonly INTENT_FULFILLED: "intent_fulfilled";
    readonly NUDGE_SENT: "nudge_sent";
    readonly NUDGE_DELIVERED: "nudge_delivered";
    readonly NUDGE_CLICKED: "nudge_clicked";
    readonly NUDGE_CONVERTED: "nudge_converted";
    readonly NUDGE_FAILED: "nudge_failed";
    readonly AGENT_RUN_DURATION: "agent_run_duration";
    readonly AGENT_RUN_SUCCESS: "agent_run_success";
    readonly AGENT_RUN_FAILED: "agent_run_failed";
    readonly SERVICE_REQUEST_TOTAL: "service_request_total";
    readonly SERVICE_REQUEST_DURATION: "service_request_duration";
    readonly SERVICE_ERROR_TOTAL: "service_error_total";
    readonly CIRCUIT_BREAKER_OPEN: "circuit_breaker_open";
    readonly MEMORY_USAGE_BYTES: "memory_usage_bytes";
    readonly SHARED_MEMORY_ENTRIES: "shared_memory_entries";
    readonly QUEUE_SIZE: "queue_size";
    readonly QUEUE_PROCESSING_TIME: "queue_processing_time";
    readonly WS_CLIENTS_CONNECTED: "ws_clients_connected";
    readonly WS_MESSAGES_SENT: "ws_messages_sent";
};
declare class MetricsCollector {
    private collectionInterval;
    private alertThresholds;
    /**
     * Start periodic collection
     */
    startCollection(intervalMs?: number): void;
    /**
     * Stop periodic collection
     */
    stopCollection(): void;
    /**
     * Collect system metrics
     */
    private collectSystemMetrics;
    /**
     * Set alert threshold
     */
    setAlertThreshold(metric: string, threshold: number): void;
    /**
     * Check if threshold exceeded
     */
    checkThreshold(metric: string): {
        exceeded: boolean;
        value: number;
        threshold: number;
    } | null;
}
export declare const metricsCollector: MetricsCollector;
export type AlertSeverity = 'info' | 'warning' | 'critical';
export interface Alert {
    id: string;
    metric: string;
    severity: AlertSeverity;
    message: string;
    value: number;
    threshold: number;
    timestamp: number;
    acknowledged: boolean;
}
declare class AlertManager {
    private alerts;
    private listeners;
    /**
     * Trigger an alert
     */
    trigger(metric: string, severity: AlertSeverity, message: string, value: number, threshold: number): Alert;
    /**
     * Acknowledge an alert
     */
    acknowledge(alertId: string): boolean;
    /**
     * Clear an alert
     */
    clear(alertId: string): boolean;
    /**
     * Get all active alerts
     */
    getActiveAlerts(): Alert[];
    /**
     * Get alert history
     */
    getAlertHistory(limit?: number): Alert[];
    /**
     * Subscribe to alerts
     */
    subscribe(listener: (alert: Alert) => void): () => void;
    private notifyListeners;
}
export declare const alertManager: AlertManager;
export interface HealthStatus {
    healthy: boolean;
    checks: Record<string, boolean>;
    timestamp: number;
    uptime: number;
}
declare class HealthChecker {
    private checks;
    /**
     * Register a health check
     */
    register(name: string, check: () => Promise<boolean>): void;
    /**
     * Run all health checks
     */
    check(): Promise<HealthStatus>;
}
export declare const healthChecker: HealthChecker;
export interface DashboardMetrics {
    timestamp: number;
    uptime: number;
    system: {
        memoryUsageMB: number;
        sharedMemoryEntries: number;
        uptime: number;
    };
    intents: {
        captured: number;
        dormant: number;
        fulfilled: number;
    };
    nudges: {
        sent: number;
        delivered: number;
        clicked: number;
        converted: number;
        conversionRate: number;
    };
    agents: {
        totalRuns: number;
        successRate: number;
        avgDuration: number;
    };
    services: {
        healthyCount: number;
        unhealthyCount: number;
    };
    alerts: {
        activeCount: number;
        criticalCount: number;
    };
}
/**
 * Get dashboard metrics
 */
export declare function getDashboardMetrics(): Promise<DashboardMetrics>;
export {};
//# sourceMappingURL=metrics.d.ts.map