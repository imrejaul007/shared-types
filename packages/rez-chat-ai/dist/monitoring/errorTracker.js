"use strict";
// ── ReZ Agent OS - Error Tracking ─────────────────────────────────────────────
// Error monitoring and alerting system
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTracker = void 0;
exports.getErrorTracker = getErrorTracker;
const logger_1 = require("../logger");
class ErrorTracker {
    errors = new Map();
    errorCounts = new Map();
    lastSeen = new Map();
    maxErrors = 1000;
    alertCallbacks = [];
    // ── Error Tracking ────────────────────────────────────────────────────────────
    trackError(error) {
        const id = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const trackedError = {
            id,
            timestamp: new Date(),
            severity: error.severity,
            category: error.category,
            message: error.message,
            stack: error.stack,
            context: error.context || {},
            userId: error.userId,
            conversationId: error.conversationId,
            retryable: error.retryable ?? false,
            resolved: false,
        };
        this.errors.set(id, trackedError);
        // Track error counts for aggregation
        const countKey = this.getErrorKey(error.category, error.message);
        const count = (this.errorCounts.get(countKey) || 0) + 1;
        this.errorCounts.set(countKey, count);
        this.lastSeen.set(countKey, new Date());
        // Log the error
        logger_1.logger.error('[ErrorTracker]', {
            id,
            severity: error.severity,
            category: error.category,
            message: error.message,
            userId: error.userId,
            conversationId: error.conversationId,
        });
        // Trigger alerts for critical/high severity
        if (error.severity === 'critical' || error.severity === 'high') {
            this.triggerAlerts(trackedError);
        }
        // Cleanup old errors if exceeding max
        if (this.errors.size > this.maxErrors) {
            this.cleanup();
        }
        return id;
    }
    getErrorKey(category, message) {
        // Normalize message for grouping
        const normalized = message.toLowerCase().replace(/\d+/g, 'X');
        return `${category}:${normalized}`;
    }
    // ── Alerting ─────────────────────────────────────────────────────────────────
    onAlert(callback) {
        this.alertCallbacks.push(callback);
    }
    triggerAlerts(error) {
        for (const callback of this.alertCallbacks) {
            try {
                callback(error);
            }
            catch (err) {
                logger_1.logger.error('[ErrorTracker] Alert callback failed', { error: err.message });
            }
        }
    }
    // ── Resolution ────────────────────────────────────────────────────────────────
    resolveError(errorId) {
        const error = this.errors.get(errorId);
        if (!error)
            return false;
        error.resolved = true;
        error.resolvedAt = new Date();
        logger_1.logger.info('[ErrorTracker] Error resolved', { errorId });
        return true;
    }
    resolveByContext(conversationId) {
        let resolved = 0;
        for (const [id, error] of this.errors.entries()) {
            if (error.conversationId === conversationId && !error.resolved) {
                error.resolved = true;
                error.resolvedAt = new Date();
                resolved++;
            }
        }
        return resolved;
    }
    // ── Error Retrieval ─────────────────────────────────────────────────────────
    getError(errorId) {
        return this.errors.get(errorId);
    }
    getErrorsByConversation(conversationId) {
        return Array.from(this.errors.values()).filter((e) => e.conversationId === conversationId);
    }
    getErrorsByUser(userId) {
        return Array.from(this.errors.values()).filter((e) => e.userId === userId);
    }
    getUnresolved() {
        return Array.from(this.errors.values()).filter((e) => !e.resolved);
    }
    getCritical() {
        return Array.from(this.errors.values()).filter((e) => (e.severity === 'critical' || e.severity === 'high') && !e.resolved);
    }
    // ── Summary ────────────────────────────────────────────────────────────────
    getSummary() {
        const allErrors = Array.from(this.errors.values());
        // Count by severity
        const bySeverity = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
        };
        // Count by category
        const byCategory = {
            api: 0,
            tool: 0,
            memory: 0,
            socket: 0,
            auth: 0,
            validation: 0,
            unknown: 0,
        };
        for (const error of allErrors) {
            bySeverity[error.severity]++;
            byCategory[error.category]++;
        }
        // Recent errors (last 10)
        const recent = allErrors
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
        // Critical errors
        const criticalErrors = allErrors
            .filter((e) => (e.severity === 'critical' || e.severity === 'high') && !e.resolved)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        // Top errors by frequency
        const topErrors = Array.from(this.errorCounts.entries())
            .map(([key, count]) => {
            const [category, message] = key.split(':');
            return {
                message: message.replace(/X/g, 'X'),
                count,
                lastSeen: this.lastSeen.get(key) || new Date(),
                category: category,
            };
        })
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((e) => ({
            message: e.message,
            count: e.count,
            lastSeen: e.lastSeen,
        }));
        // Calculate error rate (errors in last hour)
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        const recentCount = allErrors.filter((e) => e.timestamp.getTime() > oneHourAgo).length;
        return {
            total: allErrors.length,
            bySeverity,
            byCategory,
            recent,
            criticalErrors,
            errorRate: recentCount,
            topErrors,
        };
    }
    // ── Cleanup ─────────────────────────────────────────────────────────────────
    cleanup() {
        const sortedErrors = Array.from(this.errors.entries())
            .sort((a, b) => b[1].timestamp.getTime() - a[1].timestamp.getTime());
        // Keep the most recent 80% of maxErrors
        const keepCount = Math.floor(this.maxErrors * 0.8);
        const toRemove = sortedErrors.slice(keepCount);
        for (const [id] of toRemove) {
            this.errors.delete(id);
        }
        logger_1.logger.debug('[ErrorTracker] Cleanup complete', { removed: toRemove.length });
    }
    // ── Export ─────────────────────────────────────────────────────────────────
    export() {
        return Array.from(this.errors.values());
    }
    clear() {
        this.errors.clear();
        this.errorCounts.clear();
        this.lastSeen.clear();
        logger_1.logger.info('[ErrorTracker] Cleared all errors');
    }
}
exports.ErrorTracker = ErrorTracker;
// ── Singleton Instance ─────────────────────────────────────────────────────────
let errorTracker = null;
function getErrorTracker() {
    if (!errorTracker) {
        errorTracker = new ErrorTracker();
        // Set up default alert handler
        errorTracker.onAlert((error) => {
            logger_1.logger.error('[ErrorTracker] ALERT', {
                severity: error.severity,
                message: error.message,
                conversationId: error.conversationId,
            });
        });
    }
    return errorTracker;
}
exports.default = ErrorTracker;
//# sourceMappingURL=errorTracker.js.map