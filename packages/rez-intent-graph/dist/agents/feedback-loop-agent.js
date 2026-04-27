// ── Feedback Loop Agent ─────────────────────────────────────────────────────────
// Agent 6: Closed-loop optimization
// Compares predicted vs actual outcomes, adjusts all agent parameters, detects drift
// DANGEROUS: Auto-applies optimization recommendations
import { PrismaClient } from '@prisma/client';
import { sharedMemory } from './shared-memory.js';
import { handleOptimizationAction } from './action-trigger.js';
const prisma = new PrismaClient();
const logger = {
    info: (msg, meta) => console.log(`[FeedbackLoopAgent] ${msg}`, meta || ''),
    warn: (msg, meta) => console.warn(`[FeedbackLoopAgent] ${msg}`, meta || ''),
    error: (msg, meta) => console.error(`[FeedbackLoopAgent] ${msg}`, meta || ''),
};
// ── Agent Configuration ────────────────────────────────────────────────────────
export const feedbackLoopAgentConfig = {
    name: 'feedback-loop-agent',
    intervalMs: 60 * 60 * 1000, // 1 hour
    enabled: true,
    priority: 'critical',
};
// ── Drift thresholds ────────────────────────────────────────────────────────────
const DRIFT_THRESHOLDS = {
    conversionRate: 0.15, // 15% change triggers alert
    revivalScore: 0.20, // 20% change
    scarcityScore: 0.25, // 25% change
    demandSignal: 0.30, // 30% change
};
const healthMetrics = new Map();
// ── Compare predictions vs actuals ──────────────────────────────────────────────
async function evaluateScoringAccuracy() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    // Get scored intents with outcomes
    const scoredIntents = await prisma.$queryRaw `
    SELECT
      si.intent_id,
      si.predicted_prob,
      CASE WHEN i.status = 'FULFILLED' THEN true ELSE false END as actual_fulfilled
    FROM scored_intents si
    JOIN intents i ON i.id = si.intent_id
    WHERE si.created_at >= ${sevenDaysAgo}
    AND i.last_seen_at >= ${sevenDaysAgo}
    LIMIT 1000
  `;
    if (scoredIntents.length < 50) {
        return { accuracy: 0, drift: 0, recommendations: [] };
    }
    // Calculate accuracy (Brier score - lower is better)
    let brierScore = 0;
    let positiveDrift = 0;
    let negativeDrift = 0;
    for (const row of scoredIntents) {
        const actual = row.actual_fulfilled ? 1 : 0;
        brierScore += Math.pow(row.predicted_prob - actual, 2);
        // Track drift direction
        const drift = row.predicted_prob - (actual ? 0.1 : 0.9);
        if (drift > 0.1)
            positiveDrift++;
        if (drift < -0.1)
            negativeDrift++;
    }
    const avgBrier = brierScore / scoredIntents.length;
    const accuracy = 1 - avgBrier; // Convert to accuracy (higher is better)
    const drift = Math.abs(positiveDrift - negativeDrift) / scoredIntents.length;
    const recommendations = [];
    if (drift > DRIFT_THRESHOLDS.conversionRate) {
        recommendations.push({
            type: 'threshold_adjust',
            agent: 'adaptive-scoring-agent',
            currentValue: 'current_model',
            recommendedValue: 'retrain_model',
            confidence: drift,
            reason: 'Significant prediction drift detected',
            expectedImpact: drift * 100,
            timestamp: new Date(),
        });
    }
    return { accuracy, drift, recommendations };
}
// ── Evaluate revival effectiveness ───────────────────────────────────────────────
async function evaluateRevivalEffectiveness() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    // Get revival stats
    const revivalStats = await prisma.$queryRaw `
    SELECT
      COUNT(*) as total_sent,
      COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END) as total_converted,
      AVG(revival_score) as avg_score
    FROM dormant_intents
    WHERE last_nudge_sent >= ${sevenDaysAgo}
  `;
    const stats = revivalStats[0];
    const totalSent = Number(stats?.total_sent || 0);
    const totalConverted = Number(stats?.total_converted || 0);
    const avgScore = Number(stats?.avg_score || 0);
    if (totalSent < 10) {
        return { effectiveness: 0, recommendations: [] };
    }
    const effectiveness = totalConverted / totalSent;
    const recommendations = [];
    // Compare to threshold
    const threshold = 0.05; // 5% baseline
    if (effectiveness < threshold) {
        recommendations.push({
            type: 'timing_change',
            agent: 'feedback-loop-agent',
            currentValue: threshold,
            recommendedValue: effectiveness,
            confidence: 0.9,
            reason: 'Revival effectiveness below threshold',
            expectedImpact: (threshold - effectiveness) * 100,
            timestamp: new Date(),
        });
        // Check optimal timing
        const timingStats = await prisma.$queryRaw `
      SELECT
        EXTRACT(HOUR FROM last_nudge_sent) as hour,
        COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END)::float / COUNT(*) as conv_rate
      FROM dormant_intents
      WHERE last_nudge_sent >= ${sevenDaysAgo}
      GROUP BY hour
      ORDER BY conv_rate DESC
      LIMIT 1
    `;
        if (timingStats.length > 0) {
            recommendations.push({
                type: 'timing_change',
                agent: 'personalization-agent',
                currentValue: 'distributed',
                recommendedValue: `hour_${timingStats[0].hour}`,
                confidence: 0.8,
                reason: `Hour ${timingStats[0].hour} has highest conversion rate`,
                expectedImpact: timingStats[0].conv_rate * 50,
                timestamp: new Date(),
            });
        }
    }
    return { effectiveness, recommendations };
}
// ── Evaluate scarcity alerts ─────────────────────────────────────────────────────
async function evaluateScarcityEffectiveness() {
    const criticalSignals = await sharedMemory.getCriticalScarcity();
    let truePositives = 0;
    let falsePositives = 0;
    for (const signal of criticalSignals) {
        // Check if there was conversion spike after alert
        const conversions = await prisma.intent.count({
            where: {
                merchantId: signal.merchantId,
                category: signal.category,
                status: 'FULFILLED',
                lastSeenAt: {
                    gte: new Date(Date.now() - 30 * 60 * 1000),
                    lte: new Date(Date.now() - 5 * 60 * 1000),
                },
            },
        });
        if (conversions > 0) {
            truePositives++;
        }
        else {
            falsePositives++;
        }
    }
    const total = truePositives + falsePositives;
    const accuracy = total > 0 ? truePositives / total : 0;
    const recommendations = [];
    if (accuracy < 0.6) {
        recommendations.push({
            type: 'threshold_adjust',
            agent: 'scarcity-agent',
            currentValue: 70,
            recommendedValue: 85,
            confidence: 0.85,
            reason: 'Low scarcity alert accuracy - raising threshold',
            expectedImpact: 20,
            timestamp: new Date(),
        });
    }
    return { alertAccuracy: accuracy, recommendations };
}
// ── Detect metric drift ─────────────────────────────────────────────────────────
async function detectMetricDrift() {
    const recommendations = [];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    // Compare yesterday vs day before
    const [yesterday, dayBefore] = await Promise.all([
        prisma.$queryRaw `
      SELECT
        COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END)::float /
        NULLIF(COUNT(*), 0) as conversion_rate
      FROM intents
      WHERE last_seen_at >= ${oneDayAgo}
    `,
        prisma.$queryRaw `
      SELECT
        COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END)::float /
        NULLIF(COUNT(*), 0) as conversion_rate
      FROM intents
      WHERE last_seen_at >= ${twoDaysAgo}
      AND last_seen_at < ${oneDayAgo}
    `,
    ]);
    const yesterdayRate = Number(yesterday[0]?.conversion_rate || 0);
    const dayBeforeRate = Number(dayBefore[0]?.conversion_rate || 0);
    if (yesterdayRate > 0 && dayBeforeRate > 0) {
        const change = Math.abs(yesterdayRate - dayBeforeRate) / dayBeforeRate;
        if (change > DRIFT_THRESHOLDS.conversionRate) {
            recommendations.push({
                type: 'rebalance_budget',
                agent: 'feedback-loop-agent',
                currentValue: dayBeforeRate,
                recommendedValue: yesterdayRate,
                confidence: 0.7,
                reason: `Conversion rate shifted by ${(change * 100).toFixed(1)}%`,
                expectedImpact: change * 100,
                timestamp: new Date(),
            });
        }
    }
    return recommendations;
}
// ── Apply recommendations ─────────────────────────────────────────────────────────
// DANGEROUS: This function auto-applies optimizations without permission
async function applyRecommendations(recommendations) {
    for (const rec of recommendations) {
        if (rec.confidence < 0.7)
            continue; // Only apply high-confidence recommendations
        logger.info('DANGEROUS: Applying recommendation without permission', { type: rec.type, agent: rec.agent, confidence: rec.confidence });
        // DANGEROUS: Use action trigger to auto-apply
        await handleOptimizationAction(rec);
        // Additional agent-specific actions
        switch (rec.agent) {
            case 'adaptive-scoring-agent':
                // Trigger retraining
                const { retrainModel } = await import('./adaptive-scoring-agent.js');
                await retrainModel();
                break;
            case 'scarcity-agent':
                // Update threshold
                if (rec.type === 'threshold_adjust') {
                    await sharedMemory.set('scarcity:threshold', rec.recommendedValue, 86400);
                }
                break;
            case 'personalization-agent':
                // Update timing
                if (rec.type === 'timing_change' && typeof rec.recommendedValue === 'string') {
                    await sharedMemory.set('personalization:optimal_hours', rec.recommendedValue, 86400);
                }
                break;
            default:
                logger.warn('Unknown agent for recommendation', { agent: rec.agent });
        }
        // Store recommendation
        await sharedMemory.addOptimization(rec);
    }
}
// ── Update agent health ─────────────────────────────────────────────────────────
async function updateAgentHealth(agent, predicted, actual) {
    const drift = predicted > 0 ? Math.abs(predicted - actual) / predicted : 0;
    const health = {
        agent,
        predictedConversionRate: predicted,
        actualConversionRate: actual,
        drift,
        status: drift > DRIFT_THRESHOLDS.conversionRate ? 'drifted' : 'healthy',
        lastUpdated: new Date(),
    };
    healthMetrics.set(agent, health);
    await sharedMemory.updateAgentHealth({
        agent: health.agent,
        status: health.status === 'healthy' ? 'healthy' : 'degraded',
        lastRun: health.lastUpdated,
        lastSuccess: health.status === 'healthy' ? health.lastUpdated : null,
        consecutiveFailures: 0,
        avgDurationMs: 0,
    });
    return health;
}
// ── Main execution ─────────────────────────────────────────────────────────────
export async function runFeedbackLoopAgent() {
    const start = Date.now();
    try {
        logger.info('Running feedback loop analysis');
        const allRecommendations = [];
        // Evaluate all subsystems
        const [scoring, revival, scarcity, drift] = await Promise.all([
            evaluateScoringAccuracy(),
            evaluateRevivalEffectiveness(),
            evaluateScarcityEffectiveness(),
            detectMetricDrift(),
        ]);
        allRecommendations.push(...scoring.recommendations);
        allRecommendations.push(...revival.recommendations);
        allRecommendations.push(...scarcity.recommendations);
        allRecommendations.push(...drift);
        // Update health metrics
        await updateAgentHealth('adaptive-scoring-agent', scoring.accuracy, scoring.drift);
        // Apply high-confidence recommendations
        await applyRecommendations(allRecommendations);
        logger.info('Feedback loop complete', {
            recommendations: allRecommendations.length,
            scoringAccuracy: scoring.accuracy.toFixed(3),
            revivalEffectiveness: revival.effectiveness.toFixed(3),
        });
        return {
            agent: 'feedback-loop-agent',
            success: true,
            durationMs: Date.now() - start,
            data: {
                recommendations: allRecommendations.length,
                scoringAccuracy: scoring.accuracy,
                revivalEffectiveness: revival.effectiveness,
            },
        };
    }
    catch (error) {
        logger.error('Feedback loop failed', { error });
        return {
            agent: 'feedback-loop-agent',
            success: false,
            durationMs: Date.now() - start,
            error: String(error),
        };
    }
}
// ── Handle incoming alerts ──────────────────────────────────────────────────────
export async function handleAlert(fromAgent, alertType, payload) {
    logger.info('Received alert', { fromAgent, type: alertType });
    // Process alerts from other agents
    if (fromAgent === 'scarcity-agent' && alertType === 'critical_scarcity') {
        const signals = payload.signals;
        // Escalate to nudge system
        await sharedMemory.publish({
            from: 'feedback-loop-agent',
            to: 'nudge-system',
            type: 'request',
            payload: { type: 'urgency_nudge', signals },
            timestamp: new Date(),
        });
    }
    if (fromAgent === 'demand-signal-agent' && alertType === 'demand_spike') {
        const signal = payload.signal;
        // Boost scarcity detection for this merchant
        if (signal.spikeDetected) {
            await sharedMemory.set(`demand:boost:${signal.merchantId}`, Date.now(), 3600);
        }
    }
}
// ── Cron loop ──────────────────────────────────────────────────────────────────
let cronInterval = null;
export function startFeedbackLoopCron() {
    if (cronInterval)
        return;
    logger.info('Starting feedback loop agent', { intervalMs: feedbackLoopAgentConfig.intervalMs });
    runFeedbackLoopAgent().catch((err) => logger.error('Feedback loop cron failed', { error: err }));
    cronInterval = setInterval(() => runFeedbackLoopAgent().catch((err) => logger.error('Feedback loop cron failed', { error: err })), feedbackLoopAgentConfig.intervalMs);
}
export function stopFeedbackLoopCron() {
    if (cronInterval) {
        clearInterval(cronInterval);
        cronInterval = null;
    }
}
// ── Get health status ──────────────────────────────────────────────────────────
export function getAgentHealth() {
    return Array.from(healthMetrics.values());
}
//# sourceMappingURL=feedback-loop-agent.js.map