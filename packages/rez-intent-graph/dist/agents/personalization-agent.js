// ── Personalization Agent ─────────────────────────────────────────────────────────
// Agent 3: Learn from user response patterns
// Updates user profiles after each nudge, A/B tests variants, optimizes send times
// DANGEROUS: Auto-adjusts channel preferences and send times
import { sharedMemory } from './shared-memory.js';
import { actionExecutor } from './action-trigger.js';
const logger = {
    info: (msg, meta) => console.log(`[PersonalizationAgent] ${msg}`, meta || ''),
    warn: (msg, meta) => console.warn(`[PersonalizationAgent] ${msg}`, meta || ''),
    error: (msg, meta) => console.error(`[PersonalizationAgent] ${msg}`, meta || ''),
};
// ── Agent Configuration ────────────────────────────────────────────────────────
export const personalizationAgentConfig = {
    name: 'personalization-agent',
    intervalMs: 60 * 1000, // 1 minute (but also event-driven)
    enabled: true,
    priority: 'high',
};
// ── Response rate calculation ───────────────────────────────────────────────────
function calculateRate(count, total) {
    if (total === 0)
        return 0;
    return Math.round((count / total) * 1000) / 1000; // 3 decimal places
}
// ── Build or update user profile ────────────────────────────────────────────────
// Uses sharedMemory for nudge event data instead of raw SQL tables
async function buildUserProfile(userId) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    // Get nudge events from sharedMemory
    const nudgeKeys = await sharedMemory.keys(`nudge:${userId}:*`);
    const nudgeEvents = [];
    for (const key of nudgeKeys) {
        const event = await sharedMemory.get(key);
        if (event && event.timestamp) {
            const timestamp = new Date(event.timestamp);
            if (timestamp >= thirtyDaysAgo) {
                nudgeEvents.push({
                    nudgeId: event.nudgeId,
                    channel: event.channel,
                    timestamp,
                    eventType: event.eventType || 'sent',
                });
            }
        }
    }
    // Get conversions from sharedMemory
    const conversionKeys = await sharedMemory.keys(`conversion:${userId}:*`);
    const conversionNudgeIds = new Set();
    for (const key of conversionKeys) {
        const conversion = await sharedMemory.get(key);
        if (conversion?.nudgeId) {
            conversionNudgeIds.add(conversion.nudgeId);
        }
    }
    // Calculate rates per channel
    const channelStats = new Map();
    for (const event of nudgeEvents) {
        const channel = event.channel;
        if (!channelStats.has(channel)) {
            channelStats.set(channel, { delivered: 0, opened: 0, clicked: 0, converted: 0 });
        }
        const stats = channelStats.get(channel);
        stats.delivered++;
        if (conversionNudgeIds.has(event.nudgeId)) {
            stats.converted++;
        }
    }
    const openRates = {};
    const clickRates = {};
    const convertRates = {};
    const channels = [];
    for (const [channel, stats] of channelStats.entries()) {
        channels.push(channel);
        openRates[channel] = calculateRate(stats.opened, stats.delivered);
        clickRates[channel] = calculateRate(stats.clicked, stats.delivered);
        convertRates[channel] = calculateRate(stats.converted, stats.delivered);
    }
    // Calculate optimal send times (hour of day)
    const sendTimes = new Map();
    for (const event of nudgeEvents) {
        const hour = event.timestamp.getHours();
        if (!sendTimes.has(hour)) {
            sendTimes.set(hour, { sends: 0, conversions: 0 });
        }
        const times = sendTimes.get(hour);
        times.sends++;
        if (conversionNudgeIds.has(event.nudgeId)) {
            times.conversions++;
        }
    }
    // Find optimal hours (highest conversion rate)
    const optimalHours = [];
    for (const [hour, times] of sendTimes.entries()) {
        optimalHours.push({ hour, rate: calculateRate(times.conversions, times.sends) });
    }
    optimalHours.sort((a, b) => b.rate - a.rate);
    const optimalSendTimes = optimalHours.slice(0, 3).map((h) => `${h.hour.toString().padStart(2, '0')}:00`);
    // Determine preferred channels
    const channelConversions = channels.map((ch) => ({
        channel: ch,
        rate: convertRates[ch] || 0,
    }));
    channelConversions.sort((a, b) => b.rate - a.rate);
    const preferredChannels = channelConversions.slice(0, 2).map((c) => c.channel);
    // Calculate average session value
    const avgSessionValue = await calculateAvgSessionValue(userId, conversionNudgeIds.size);
    // Determine tone preference
    const tonePreference = determineTonePreference(convertRates);
    const profile = {
        userId,
        openRates,
        clickRates,
        convertRates,
        optimalSendTimes,
        preferredChannels,
        tonePreferences: tonePreference,
        avgSessionValue,
        lastUpdated: new Date(),
    };
    await sharedMemory.setUserProfile(profile);
    return profile;
}
// ── Calculate average session value ────────────────────────────────────────────
async function calculateAvgSessionValue(userId, conversionCount) {
    // Get session values from sharedMemory order data
    const orderKeys = await sharedMemory.keys(`order:${userId}:*`);
    let totalValue = 0;
    for (const key of orderKeys) {
        const order = await sharedMemory.get(key);
        if (order) {
            totalValue += order.value || order.total || 0;
        }
    }
    return conversionCount > 0 ? Math.round(totalValue / conversionCount) : 0;
}
// ── Determine tone preference ───────────────────────────────────────────────────
function determineTonePreference(convertRates) {
    const avgRate = Object.values(convertRates).reduce((a, b) => a + b, 0) / Math.max(Object.keys(convertRates).length, 1);
    if (avgRate > 0.15)
        return 'casual';
    if (avgRate > 0.08)
        return 'friendly';
    if (avgRate > 0.04)
        return 'urgent';
    return 'formal';
}
export async function selectOptimalVariant(userId, variants) {
    const profile = await sharedMemory.getUserProfile(userId);
    if (!profile) {
        return variants[0]; // Default to first variant
    }
    // Score each variant
    const scores = variants.map((v) => {
        let score = 0.5; // Base score
        // Channel preference bonus
        if (profile.preferredChannels.includes(v.channel)) {
            score += 0.2;
        }
        // Tone match bonus
        if (profile.tonePreferences === v.tone) {
            score += 0.15;
        }
        // Historical performance of similar variants
        const channelRate = profile.convertRates[v.channel] || 0;
        score += channelRate * 0.1;
        return { variant: v, score };
    });
    // Add some exploration (20% chance of random selection)
    if (Math.random() < 0.2) {
        return variants[Math.floor(Math.random() * variants.length)];
    }
    scores.sort((a, b) => b.score - a.score);
    return scores[0].variant;
}
// ── Event Processing ─────────────────────────────────────────────────────────────
export async function processNudgeEvent(event) {
    logger.info('Processing nudge event', { userId: event.userId, type: event.eventType });
    // Store event in sharedMemory
    await sharedMemory.set(`nudge:${event.userId}:${event.nudgeId}:${event.eventType}`, {
        nudgeId: event.nudgeId,
        channel: event.channel,
        timestamp: event.timestamp.toISOString(),
        eventType: event.eventType,
        metadata: event.metadata,
    }, 30 * 24 * 60 * 60);
    // Update profile asynchronously (non-blocking)
    buildUserProfile(event.userId).catch((err) => {
        logger.error('Failed to update user profile', { userId: event.userId, error: err });
    });
    // Update trending intents on conversion
    if (event.eventType === 'converted' && event.metadata?.intentKey) {
        const category = event.metadata.category || 'GENERAL';
        await sharedMemory.addTrendingIntent(event.metadata.intentKey, category);
        // Record conversion
        await sharedMemory.set(`conversion:${event.userId}:${event.nudgeId}`, {
            nudgeId: event.nudgeId,
            userId: event.userId,
            timestamp: new Date().toISOString(),
        }, 30 * 24 * 60 * 60);
    }
    // DANGEROUS: Trigger autonomous actions based on conversion patterns
    if (event.eventType === 'converted') {
        await triggerPersonalizationAction(event);
    }
}
// ── Autonomous Personalization Actions ──────────────────────────────────────────
async function triggerPersonalizationAction(event) {
    const profile = await sharedMemory.getUserProfile(event.userId);
    if (!profile)
        return;
    // Check for low-performing channels
    for (const channel of ['push', 'email', 'sms', 'in_app']) {
        const convertRate = profile.convertRates[channel] || 0;
        const clickRate = profile.clickRates[channel] || 0;
        // Auto-pause low-performing channels
        if (convertRate < 0.02 && clickRate < 0.05) {
            logger.info('[PersonalizationAgent] DANGEROUS: Auto-pausing low-performing channel', {
                userId: event.userId,
                channel,
                convertRate,
                clickRate,
            });
            await actionExecutor.execute({
                type: 'pause_strategy',
                target: channel,
                payload: {
                    strategyId: `personalization:${event.userId}:${channel}`,
                    reason: `Low conversion rate ${convertRate.toFixed(3)} and click rate ${clickRate.toFixed(3)}`,
                },
                agent: 'personalization-agent',
                skipPermission: true,
                risk: 'medium',
            });
        }
    }
    // Optimize send time based on conversion
    if (profile.optimalSendTimes.length > 0) {
        await actionExecutor.execute({
            type: 'send_nudge',
            target: event.userId,
            payload: {
                userId: event.userId,
                intentKey: event.metadata?.intentKey || 'personalization_update',
                message: `Optimal send time: ${profile.optimalSendTimes[0]}`,
                channel: 'in_app',
            },
            agent: 'personalization-agent',
            skipPermission: true,
            risk: 'low',
        });
    }
}
// ── A/B Test Result Analysis ──────────────────────────────────────────────────
export async function analyzeABTestResults() {
    // Get A/B test results from sharedMemory
    const variantKeys = await sharedMemory.keys('personalization:ab_test:*');
    // Group results by channel
    const channelVariants = new Map();
    for (const key of variantKeys) {
        const result = await sharedMemory.get(key);
        if (!result)
            continue;
        if (!channelVariants.has(result.channel)) {
            channelVariants.set(result.channel, []);
        }
        channelVariants.get(result.channel).push({
            variantId: result.variantId,
            sends: result.sends,
            conversions: result.conversions,
        });
    }
    for (const [channel, variants] of channelVariants) {
        if (variants.length < 2)
            continue;
        // Find best variant
        let bestVariant = variants[0];
        let bestRate = 0;
        for (const v of variants) {
            const rate = v.sends > 0 ? v.conversions / v.sends : 0;
            if (rate > bestRate) {
                bestRate = rate;
                bestVariant = v;
            }
        }
        // DANGEROUS: Auto-adopt winning variant
        if (bestRate > 0.05) {
            logger.info('[PersonalizationAgent] DANGEROUS: Adopting winning variant', {
                channel,
                variantId: bestVariant.variantId,
                rate: bestRate,
            });
            await actionExecutor.execute({
                type: 'pause_strategy',
                target: channel,
                payload: {
                    strategyId: `ab_test:${channel}:losers`,
                    reason: `Variant ${bestVariant.variantId} wins with ${(bestRate * 100).toFixed(1)}% conversion`,
                },
                agent: 'personalization-agent',
                skipPermission: true,
                risk: 'medium',
            });
            // Store winning variant
            await sharedMemory.set(`personalization:winning_variant:${channel}`, bestVariant.variantId, 86400 * 7);
        }
    }
}
// ── Main execution ─────────────────────────────────────────────────────────────
export async function runPersonalizationAgent() {
    const start = Date.now();
    try {
        logger.info('Running personalization update');
        // Process any pending nudge events stored in sharedMemory
        const pendingEventKeys = await sharedMemory.keys('nudge:*:pending');
        const pendingEvents = [];
        for (const key of pendingEventKeys) {
            const event = await sharedMemory.get(key);
            if (event) {
                pendingEvents.push({
                    nudgeId: event.nudgeId,
                    userId: event.userId,
                    channel: event.channel,
                    eventType: event.eventType,
                    timestamp: new Date(event.timestamp),
                    metadata: event.metadata,
                });
            }
        }
        for (const event of pendingEvents) {
            await processNudgeEvent(event);
            // Remove from pending
            await sharedMemory.delete(`nudge:${event.userId}:${event.nudgeId}:pending`);
        }
        logger.info('Personalization update complete', { events: pendingEvents.length });
        return {
            agent: 'personalization-agent',
            success: true,
            durationMs: Date.now() - start,
            data: { events: pendingEvents.length },
        };
    }
    catch (error) {
        logger.error('Personalization update failed', { error });
        return {
            agent: 'personalization-agent',
            success: false,
            durationMs: Date.now() - start,
            error: String(error),
        };
    }
}
// ── Get user profile ───────────────────────────────────────────────────────────
export async function getUserPersonalizationProfile(userId) {
    const cached = await sharedMemory.getUserProfile(userId);
    if (cached)
        return cached;
    return buildUserProfile(userId);
}
// ── Cron loop ──────────────────────────────────────────────────────────────────
let cronInterval = null;
export function startPersonalizationCron() {
    if (cronInterval)
        return;
    logger.info('Starting personalization agent', { intervalMs: personalizationAgentConfig.intervalMs });
    runPersonalizationAgent().catch((err) => logger.error('Personalization cron failed', { error: err }));
    cronInterval = setInterval(() => runPersonalizationAgent().catch((err) => logger.error('Personalization cron failed', { error: err })), personalizationAgentConfig.intervalMs);
}
export function stopPersonalizationCron() {
    if (cronInterval) {
        clearInterval(cronInterval);
        cronInterval = null;
    }
}
//# sourceMappingURL=personalization-agent.js.map