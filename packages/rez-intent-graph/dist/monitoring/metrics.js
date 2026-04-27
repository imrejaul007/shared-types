// ── Metrics Collection & Monitoring ─────────────────────────────────────────────────
// Phase 6: System metrics, performance monitoring, and alerting
// Tracks intent capture rates, nudge performance, agent health, and service health
import { sharedMemory } from '../agents/shared-memory.js';
// ── Metrics Store ─────────────────────────────────────────────────────────────────
class MetricsStore {
    metrics = new Map();
    summaries = new Map();
    maxHistorySize = 1000;
    /**
     * Record a metric
     */
    record(name, value, type, labels = {}) {
        const key = this.getKey(name, labels);
        const metric = {
            name,
            type,
            value,
            timestamp: Date.now(),
            labels,
        };
        if (!this.metrics.has(key)) {
            this.metrics.set(key, []);
        }
        const history = this.metrics.get(key);
        history.push(metric);
        // Trim history
        if (history.length > this.maxHistorySize) {
            history.shift();
        }
        // Update summary
        this.updateSummary(key, name, type, labels);
    }
    /**
     * Increment a counter
     */
    increment(name, labels = {}) {
        this.record(name, 1, 'counter', labels);
    }
    /**
     * Set a gauge value
     */
    gauge(name, value, labels = {}) {
        this.record(name, value, 'gauge', labels);
    }
    /**
     * Record timing
     */
    timing(name, durationMs, labels = {}) {
        this.record(name, durationMs, 'timer', labels);
    }
    /**
     * Update summary statistics
     */
    updateSummary(key, name, type, labels) {
        const history = this.metrics.get(key) || [];
        if (history.length === 0)
            return;
        const values = history.map((m) => m.value);
        const summary = {
            name,
            type,
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            labels,
        };
        this.summaries.set(key, summary);
    }
    /**
     * Get current value for a gauge
     */
    getGauge(name, labels = {}) {
        const key = this.getKey(name, labels);
        const summary = this.summaries.get(key);
        if (!summary || summary.type !== 'gauge')
            return null;
        return summary.avg;
    }
    /**
     * Get summary statistics
     */
    getSummary(name, labels = {}) {
        const key = this.getKey(name, labels);
        return this.summaries.get(key) || null;
    }
    /**
     * Get all summaries
     */
    getAllSummaries() {
        return Array.from(this.summaries.values());
    }
    /**
     * Get metrics history
     */
    getHistory(name, labels = {}, limit = 100) {
        const key = this.getKey(name, labels);
        const history = this.metrics.get(key) || [];
        return history.slice(-limit);
    }
    /**
     * Clear all metrics
     */
    clear() {
        this.metrics.clear();
        this.summaries.clear();
    }
    /**
     * Generate key from name and labels
     */
    getKey(name, labels) {
        const sortedLabels = Object.entries(labels)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join(',');
        return sortedLabels ? `${name}{${sortedLabels}}` : name;
    }
}
// ── Singleton Instance ──────────────────────────────────────────────────────────
export const metricsStore = new MetricsStore();
// ── Key Metrics ─────────────────────────────────────────────────────────────────
export const METRICS = {
    // Intent capture
    INTENT_CAPTURED: 'intent_captured',
    INTENT_DORMANT: 'intent_dormant',
    INTENT_FULFILLED: 'intent_fulfilled',
    // Nudge performance
    NUDGE_SENT: 'nudge_sent',
    NUDGE_DELIVERED: 'nudge_delivered',
    NUDGE_CLICKED: 'nudge_clicked',
    NUDGE_CONVERTED: 'nudge_converted',
    NUDGE_FAILED: 'nudge_failed',
    // Agent performance
    AGENT_RUN_DURATION: 'agent_run_duration',
    AGENT_RUN_SUCCESS: 'agent_run_success',
    AGENT_RUN_FAILED: 'agent_run_failed',
    // Service health
    SERVICE_REQUEST_TOTAL: 'service_request_total',
    SERVICE_REQUEST_DURATION: 'service_request_duration',
    SERVICE_ERROR_TOTAL: 'service_error_total',
    CIRCUIT_BREAKER_OPEN: 'circuit_breaker_open',
    // Memory usage
    MEMORY_USAGE_BYTES: 'memory_usage_bytes',
    SHARED_MEMORY_ENTRIES: 'shared_memory_entries',
    // Queue performance
    QUEUE_SIZE: 'queue_size',
    QUEUE_PROCESSING_TIME: 'queue_processing_time',
    // WebSocket
    WS_CLIENTS_CONNECTED: 'ws_clients_connected',
    WS_MESSAGES_SENT: 'ws_messages_sent',
};
// ── Metrics Collector ─────────────────────────────────────────────────────────────
class MetricsCollector {
    collectionInterval = null;
    alertThresholds = new Map();
    /**
     * Start periodic collection
     */
    startCollection(intervalMs = 30000) {
        if (this.collectionInterval)
            return;
        this.collectionInterval = setInterval(() => {
            this.collectSystemMetrics();
        }, intervalMs);
        // Run immediately
        this.collectSystemMetrics();
    }
    /**
     * Stop periodic collection
     */
    stopCollection() {
        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
            this.collectionInterval = null;
        }
    }
    /**
     * Collect system metrics
     */
    async collectSystemMetrics() {
        // Memory usage
        const memUsage = process.memoryUsage();
        metricsStore.gauge(METRICS.MEMORY_USAGE_BYTES, memUsage.heapUsed, { type: 'heap' });
        metricsStore.gauge(METRICS.MEMORY_USAGE_BYTES, memUsage.rss, { type: 'rss' });
        // Shared memory entries
        try {
            const stats = await sharedMemory.stats();
            metricsStore.gauge(METRICS.SHARED_MEMORY_ENTRIES, stats.keys, { type: 'total' });
        }
        catch {
            // Ignore errors
        }
    }
    /**
     * Set alert threshold
     */
    setAlertThreshold(metric, threshold) {
        this.alertThresholds.set(metric, threshold);
    }
    /**
     * Check if threshold exceeded
     */
    checkThreshold(metric) {
        const threshold = this.alertThresholds.get(metric);
        if (threshold === undefined)
            return null;
        const summary = metricsStore.getSummary(metric);
        if (!summary)
            return null;
        return {
            exceeded: summary.avg > threshold,
            value: summary.avg,
            threshold,
        };
    }
}
export const metricsCollector = new MetricsCollector();
class AlertManager {
    alerts = new Map();
    listeners = [];
    /**
     * Trigger an alert
     */
    trigger(metric, severity, message, value, threshold) {
        const id = `alert_${metric}_${Date.now()}`;
        const alert = {
            id,
            metric,
            severity,
            message,
            value,
            threshold,
            timestamp: Date.now(),
            acknowledged: false,
        };
        this.alerts.set(id, alert);
        this.notifyListeners(alert);
        // Auto-clear after 5 minutes for non-critical
        if (severity !== 'critical') {
            setTimeout(() => {
                this.clear(alert.id);
            }, 5 * 60 * 1000);
        }
        return alert;
    }
    /**
     * Acknowledge an alert
     */
    acknowledge(alertId) {
        const alert = this.alerts.get(alertId);
        if (alert) {
            alert.acknowledged = true;
            return true;
        }
        return false;
    }
    /**
     * Clear an alert
     */
    clear(alertId) {
        return this.alerts.delete(alertId);
    }
    /**
     * Get all active alerts
     */
    getActiveAlerts() {
        return Array.from(this.alerts.values()).filter((a) => !a.acknowledged);
    }
    /**
     * Get alert history
     */
    getAlertHistory(limit = 100) {
        return Array.from(this.alerts.values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }
    /**
     * Subscribe to alerts
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
    notifyListeners(alert) {
        this.listeners.forEach((listener) => {
            try {
                listener(alert);
            }
            catch {
                // Ignore listener errors
            }
        });
    }
}
export const alertManager = new AlertManager();
class HealthChecker {
    checks = new Map();
    /**
     * Register a health check
     */
    register(name, check) {
        this.checks.set(name, check);
    }
    /**
     * Run all health checks
     */
    async check() {
        const results = {};
        let allHealthy = true;
        const checkPromises = Array.from(this.checks.entries()).map(async ([name, check]) => {
            try {
                const healthy = await check();
                results[name] = healthy;
                if (!healthy)
                    allHealthy = false;
            }
            catch {
                results[name] = false;
                allHealthy = false;
            }
        });
        await Promise.all(checkPromises);
        return {
            healthy: allHealthy,
            checks: results,
            timestamp: Date.now(),
            uptime: process.uptime(),
        };
    }
}
export const healthChecker = new HealthChecker();
/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics() {
    // Get intent metrics
    const intentCaptured = metricsStore.getSummary(METRICS.INTENT_CAPTURED);
    const intentDormant = metricsStore.getSummary(METRICS.INTENT_DORMANT);
    const intentFulfilled = metricsStore.getSummary(METRICS.INTENT_FULFILLED);
    // Get nudge metrics
    const nudgeSent = metricsStore.getSummary(METRICS.NUDGE_SENT);
    const nudgeDelivered = metricsStore.getSummary(METRICS.NUDGE_DELIVERED);
    const nudgeClicked = metricsStore.getSummary(METRICS.NUDGE_CLICKED);
    const nudgeConverted = metricsStore.getSummary(METRICS.NUDGE_CONVERTED);
    // Get agent metrics
    const agentSuccess = metricsStore.getSummary(METRICS.AGENT_RUN_SUCCESS);
    const agentFailed = metricsStore.getSummary(METRICS.AGENT_RUN_FAILED);
    const agentDuration = metricsStore.getSummary(METRICS.AGENT_RUN_DURATION);
    // Calculate conversion rate
    const conversionRate = nudgeSent?.sum && nudgeSent.sum > 0
        ? ((nudgeConverted?.sum || 0) / nudgeSent.sum) * 100
        : 0;
    // Get memory stats
    const memUsage = process.memoryUsage();
    let sharedMemoryEntries = 0;
    try {
        const stats = await sharedMemory.stats();
        sharedMemoryEntries = stats.keys;
    }
    catch {
        // Ignore
    }
    // Get active alerts
    const activeAlerts = alertManager.getActiveAlerts();
    return {
        timestamp: Date.now(),
        uptime: process.uptime(),
        system: {
            memoryUsageMB: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
            sharedMemoryEntries,
            uptime: process.uptime(),
        },
        intents: {
            captured: intentCaptured?.sum || 0,
            dormant: intentDormant?.sum || 0,
            fulfilled: intentFulfilled?.sum || 0,
        },
        nudges: {
            sent: nudgeSent?.sum || 0,
            delivered: nudgeDelivered?.sum || 0,
            clicked: nudgeClicked?.sum || 0,
            converted: nudgeConverted?.sum || 0,
            conversionRate: Math.round(conversionRate * 100) / 100,
        },
        agents: {
            totalRuns: (agentSuccess?.count || 0) + (agentFailed?.count || 0),
            successRate: ((agentSuccess?.count || 0) / ((agentSuccess?.count || 0) + (agentFailed?.count || 0))) * 100 || 0,
            avgDuration: agentDuration?.avg || 0,
        },
        services: {
            healthyCount: 0, // Would come from service health checks
            unhealthyCount: 0,
        },
        alerts: {
            activeCount: activeAlerts.length,
            criticalCount: activeAlerts.filter((a) => a.severity === 'critical').length,
        },
    };
}
//# sourceMappingURL=metrics.js.map