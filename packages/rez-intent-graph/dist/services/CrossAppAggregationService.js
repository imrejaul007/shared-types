// ── Cross-App Aggregation Service ───────────────────────────────────────────────
// Aggregates intent data across apps for unified user profiles
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class CrossAppAggregationService {
    /**
     * Get or create cross-app profile for a user
     */
    async getProfile(userId) {
        return (await prisma.crossAppIntentProfile.upsert({
            where: { userId },
            create: { userId },
            update: {},
        }));
    }
    /**
     * Get enriched context for an agent (active + dormant intents)
     */
    async getEnrichedContext(userId) {
        // Fetch active intents
        const activeIntents = await prisma.intent.findMany({
            where: { userId, status: 'ACTIVE' },
            orderBy: { lastSeenAt: 'desc' },
            take: 10,
        });
        // Fetch dormant intents with revival candidates
        const dormantIntents = await prisma.dormantIntent.findMany({
            where: { userId, status: 'active' },
            orderBy: { revivalScore: 'desc' },
            take: 5,
        });
        // Fetch cross-app profile
        const profile = await this.getProfile(userId);
        // Build active intents list
        const activeList = activeIntents.map((i) => ({
            category: i.category,
            key: i.intentKey,
            confidence: Number(i.confidence),
            lastSeen: i.lastSeenAt,
        }));
        // Build dormant intents list
        const dormantList = dormantIntents.map((di) => ({
            category: di.category,
            key: di.intentKey,
            revivalScore: Number(di.revivalScore),
            daysDormant: di.daysDormant,
        }));
        // Generate nudge suggestions
        const suggestedNudges = this.generateNudgeSuggestions(dormantIntents, profile);
        return {
            activeIntents: activeList,
            dormantIntents: dormantList,
            suggestedNudges,
            crossAppProfile: profile,
        };
    }
    /**
     * Generate nudge suggestions based on dormant intents and profile
     */
    generateNudgeSuggestions(dormantIntents, profile) {
        return dormantIntents
            .filter((di) => di.revivalScore >= 0.3)
            .map((di) => {
            let priority;
            const score = Number(di.revivalScore);
            if (score >= 0.7)
                priority = 'high';
            else if (score >= 0.5)
                priority = 'medium';
            else
                priority = 'low';
            const message = this.generateNudgeMessage(di.intentKey, di.category, score);
            return { intentKey: di.intentKey, message, priority };
        });
    }
    /**
     * Generate context-aware nudge message
     */
    generateNudgeMessage(intentKey, category, score) {
        const formattedIntent = intentKey
            .split('_')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        const highScoreMessages = {
            TRAVEL: [
                `Perfect timing for ${formattedIntent}! Your weekend plans?`,
                `${formattedIntent} - trending searches show great deals!`,
                `Ready to book ${formattedIntent}? Exclusive offer ending soon!`,
            ],
            DINING: [
                `${formattedIntent} cravings? New restaurants added nearby!`,
                `Your saved ${formattedIntent} preferences are ready!`,
                `${formattedIntent} - top-rated spots near you with availability!`,
            ],
            RETAIL: [
                `${formattedIntent} - back in stock with special pricing!`,
                `Your ${formattedIntent} wish is about to come true!`,
                `Complete your ${formattedIntent} order - limited stock!`,
            ],
        };
        const templates = highScoreMessages[category] || highScoreMessages.RETAIL;
        return templates[Math.floor(Math.random() * templates.length)];
    }
    /**
     * Aggregate demand signals for merchants
     */
    async aggregateMerchantDemand(merchantId, category, timeRangeDays = 30) {
        const since = new Date(Date.now() - timeRangeDays * 24 * 60 * 60 * 1000);
        const intents = await prisma.intent.findMany({
            where: {
                category,
                firstSeenAt: { gte: since },
                status: { in: ['ACTIVE', 'DORMANT'] },
            },
            select: {
                intentKey: true,
                confidence: true,
                status: true,
            },
        });
        const fulfilledCount = await prisma.intent.count({
            where: {
                category,
                status: 'FULFILLED',
                lastSeenAt: { gte: since },
            },
        });
        const totalCount = intents.length;
        const unmetDemandPct = totalCount > 0
            ? ((totalCount - fulfilledCount) / totalCount) * 100
            : 0;
        const avgConfidence = totalCount > 0
            ? intents.reduce((sum, i) => sum + Number(i.confidence), 0) / totalCount
            : 0;
        // Group by intent key
        const intentCounts = intents.reduce((acc, i) => {
            acc[i.intentKey] = (acc[i.intentKey] || 0) + 1;
            return acc;
        }, {});
        const topIntentKeys = Object.entries(intentCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([key]) => key);
        // Update or create merchant demand signal
        await prisma.merchantDemandSignal.upsert({
            where: { merchantId_category: { merchantId, category } },
            create: {
                merchantId,
                category,
                demandCount: totalCount,
                unmetDemandPct,
                topCities: [],
                trend: this.calculateTrend(totalCount, category),
            },
            update: {
                demandCount: totalCount,
                unmetDemandPct,
                trend: this.calculateTrend(totalCount, category),
                lastAggregated: new Date(),
            },
        });
        return {
            demandCount: totalCount,
            unmetDemandPct,
            avgConfidence,
            topIntentKeys,
        };
    }
    /**
     * Calculate demand trend
     */
    calculateTrend(count, category) {
        // Simple heuristic: would need historical data for accurate trend
        // For now, return stable
        return 'stable';
    }
    /**
     * Get user affinity scores across categories
     */
    async getUserAffinities(userId) {
        const profile = await this.getProfile(userId);
        const travel = profile.travelAffinity;
        const dining = profile.diningAffinity;
        const retail = profile.retailAffinity;
        const categories = [
            { category: 'TRAVEL', score: travel },
            { category: 'DINING', score: dining },
            { category: 'RETAIL', score: retail },
        ];
        const dominant = categories.reduce((max, c) => (c.score > max.score ? c : max));
        return {
            travel,
            dining,
            retail,
            dominantCategory: dominant.category,
        };
    }
}
export const crossAppAggregationService = new CrossAppAggregationService();
//# sourceMappingURL=CrossAppAggregationService.js.map