"use strict";
// ── ReZ Agent OS - Analytics ────────────────────────────────────────────────────
// Agent metrics tracking and reporting
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentAnalytics = void 0;
exports.getAgentAnalytics = getAgentAnalytics;
const logger_1 = require("../logger");
class AgentAnalytics {
    sessions = new Map();
    toolUsage = new Map();
    // ── Session Management ────────────────────────────────────────────────────────
    startSession(conversationId, userId, appType) {
        const metrics = {
            conversationId,
            userId,
            appType,
            startedAt: new Date(),
            messageCount: 0,
            toolCalls: [],
            escalations: 0,
        };
        this.sessions.set(conversationId, metrics);
        logger_1.logger.debug('[Analytics] Session started', { conversationId, userId, appType });
    }
    endSession(conversationId, satisfaction) {
        const session = this.sessions.get(conversationId);
        if (!session)
            return;
        session.endedAt = new Date();
        session.duration = session.endedAt.getTime() - session.startedAt.getTime();
        session.satisfaction = satisfaction;
        logger_1.logger.debug('[Analytics] Session ended', {
            conversationId,
            duration: session.duration,
            messageCount: session.messageCount,
            toolCalls: session.toolCalls.length,
        });
    }
    // ── Message Tracking ─────────────────────────────────────────────────────────
    trackMessage(conversationId) {
        const session = this.sessions.get(conversationId);
        if (session) {
            session.messageCount++;
        }
    }
    // ── Tool Call Tracking ───────────────────────────────────────────────────────
    trackToolCall(conversationId, toolName, duration, success, error) {
        const session = this.sessions.get(conversationId);
        if (session) {
            session.toolCalls.push({
                toolName,
                calledAt: new Date(),
                duration,
                success,
                error,
            });
        }
        // Aggregate tool usage
        const count = this.toolUsage.get(toolName) || 0;
        this.toolUsage.set(toolName, count + 1);
    }
    // ── Escalation Tracking ─────────────────────────────────────────────────────
    trackEscalation(conversationId) {
        const session = this.sessions.get(conversationId);
        if (session) {
            session.escalations++;
        }
    }
    // ── Session Retrieval ─────────────────────────────────────────────────────────
    getSession(conversationId) {
        return this.sessions.get(conversationId);
    }
    getActiveSessions() {
        return Array.from(this.sessions.values()).filter((s) => !s.endedAt);
    }
    // ── Summary Report ─────────────────────────────────────────────────────────
    getSummary() {
        const allSessions = Array.from(this.sessions.values());
        const completedSessions = allSessions.filter((s) => s.endedAt);
        // Calculate averages
        const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const avgDuration = completedSessions.length > 0 ? totalDuration / completedSessions.length : 0;
        const totalMessages = allSessions.reduce((sum, s) => sum + s.messageCount, 0);
        const avgMessages = allSessions.length > 0 ? totalMessages / allSessions.length : 0;
        // Escalation rate
        const totalEscalations = allSessions.reduce((sum, s) => sum + s.escalations, 0);
        const escalationRate = allSessions.length > 0 ? totalEscalations / allSessions.length : 0;
        // Top tools
        const topTools = Array.from(this.toolUsage.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tool, count]) => ({ tool, count }));
        // App type distribution
        const appTypeDistribution = {};
        for (const session of allSessions) {
            appTypeDistribution[session.appType] = (appTypeDistribution[session.appType] || 0) + 1;
        }
        // Hourly activity (0-23)
        const hourlyActivity = new Array(24).fill(0);
        for (const session of allSessions) {
            const hour = session.startedAt.getHours();
            hourlyActivity[hour]++;
        }
        return {
            totalSessions: allSessions.length,
            activeSessions: this.getActiveSessions().length,
            avgSessionDuration: avgDuration,
            totalMessages,
            avgMessagesPerSession: avgMessages,
            toolUsageStats: Object.fromEntries(this.toolUsage),
            escalationRate,
            topTools,
            appTypeDistribution,
            hourlyActivity,
        };
    }
    // ── Tool Performance ───────────────────────────────────────────────────────────
    getToolPerformance() {
        const toolStats = new Map();
        for (const session of this.sessions.values()) {
            for (const call of session.toolCalls) {
                const stats = toolStats.get(call.toolName) || { total: 0, success: 0, duration: 0, errors: 0 };
                stats.total++;
                stats.duration += call.duration;
                if (call.success)
                    stats.success++;
                if (!call.success)
                    stats.errors++;
                toolStats.set(call.toolName, stats);
            }
        }
        return Array.from(toolStats.entries()).map(([tool, stats]) => ({
            tool,
            totalCalls: stats.total,
            successRate: stats.total > 0 ? stats.success / stats.total : 0,
            avgDuration: stats.total > 0 ? stats.duration / stats.total : 0,
            errorRate: stats.total > 0 ? stats.errors / stats.total : 0,
        }));
    }
    // ── Cleanup ─────────────────────────────────────────────────────────────────
    cleanup(olderThanMs = 24 * 60 * 60 * 1000) {
        const cutoff = Date.now() - olderThanMs;
        let cleaned = 0;
        for (const [id, session] of this.sessions.entries()) {
            if (session.startedAt.getTime() < cutoff && session.endedAt) {
                this.sessions.delete(id);
                cleaned++;
            }
        }
        logger_1.logger.info('[Analytics] Cleanup complete', { cleaned });
        return cleaned;
    }
    // ── Export for External Analytics ────────────────────────────────────────────
    exportForExternal() {
        const summary = this.getSummary();
        const toolPerformance = this.getToolPerformance();
        const activeSessions = this.getActiveSessions().map((s) => ({
            conversationId: s.conversationId,
            userId: s.userId,
            appType: s.appType,
            startedAt: s.startedAt.toISOString(),
            messageCount: s.messageCount,
        }));
        return {
            summary,
            toolPerformance,
            activeSessions,
            exportedAt: new Date().toISOString(),
        };
    }
}
exports.AgentAnalytics = AgentAnalytics;
// ── Singleton Instance ─────────────────────────────────────────────────────────
let analytics = null;
function getAgentAnalytics() {
    if (!analytics) {
        analytics = new AgentAnalytics();
    }
    return analytics;
}
exports.default = AgentAnalytics;
//# sourceMappingURL=agentAnalytics.js.map