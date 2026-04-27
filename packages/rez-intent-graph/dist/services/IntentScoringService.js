// ── Intent Scoring Service ────────────────────────────────────────────────────
// Calculates confidence scores, dormancy detection, and revival scoring
import { PrismaClient } from '@prisma/client';
import { DORMANCY_THRESHOLD_DAYS, CONFIDENCE_DORMANT_THRESHOLD, } from '../types/intent.js';
const prisma = new PrismaClient();
export class IntentScoringService {
    /**
     * Calculate detailed scoring context for an intent
     */
    async getScoringContext(intentId) {
        const intent = await prisma.intent.findUnique({
            where: { id: intentId },
            include: {
                signals: { orderBy: { capturedAt: 'desc' } },
            },
        });
        if (!intent)
            return null;
        const signalCount = intent.signals.length;
        const lastSignalAt = intent.signals[0]?.capturedAt || intent.lastSeenAt;
        const avgVelocity = this.calculateAvgVelocity(intent.signals);
        return {
            intentId,
            baseConfidence: Number(intent.confidence),
            signalCount,
            lastSignalAt,
            avgVelocity,
            metadata: {
                appType: intent.appType,
                category: intent.category,
                status: intent.status,
                daysActive: Math.floor((Date.now() - intent.firstSeenAt.getTime()) / (1000 * 60 * 60 * 24)),
            },
        };
    }
    /**
     * Detect intents that should be marked as dormant
     */
    async detectDormantIntents(daysThreshold = DORMANCY_THRESHOLD_DAYS) {
        const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
        const activeIntents = await prisma.intent.findMany({
            where: {
                status: 'ACTIVE',
                lastSeenAt: { lt: thresholdDate },
            },
            select: {
                id: true,
                lastSeenAt: true,
                confidence: true,
            },
        });
        return activeIntents.map((intent) => ({
            intentId: intent.id,
            daysSinceLastActivity: Math.floor((Date.now() - intent.lastSeenAt.getTime()) / (1000 * 60 * 60 * 24)),
            currentConfidence: Number(intent.confidence),
            shouldMarkDormant: Number(intent.confidence) < CONFIDENCE_DORMANT_THRESHOLD ||
                (Date.now() - intent.lastSeenAt.getTime()) / (1000 * 60 * 60 * 24) >= daysThreshold,
        }));
    }
    /**
     * Calculate revival score for a dormant intent
     */
    async calculateRevivalScore(dormantIntentId) {
        const dormant = await prisma.dormantIntent.findUnique({
            where: { id: dormantIntentId },
            include: {
                intent: {
                    include: {
                        signals: { orderBy: { capturedAt: 'desc' }, take: 10 },
                    },
                },
            },
        });
        if (!dormant)
            return 0;
        return this.computeRevivalScore(dormant);
    }
    /**
     * Compute revival score based on multiple factors
     */
    computeRevivalScore(dormant) {
        // Base score from intent strength
        const intentStrength = dormant.intent
            ? Number(dormant.intent.confidence)
            : 0.5;
        // Dormancy sweet spot bonus (7-14 days is optimal)
        const daysDormant = dormant.daysDormant;
        let dormancyBonus = 0;
        if (daysDormant >= 7 && daysDormant <= 14) {
            dormancyBonus = 0.15;
        }
        else if (daysDormant > 14 && daysDormant <= 30) {
            dormancyBonus = 0.1;
        }
        else if (daysDormant > 30) {
            dormancyBonus = 0.05;
        }
        // Timing factor (weekends for travel, meal times for dining)
        const timingBonus = this.calculateTimingBonus(dormant.category);
        // Recency of nudge (if nudged recently, lower score)
        let nudgePenalty = 0;
        if (dormant.lastNudgeSent) {
            const daysSinceNudge = (Date.now() - dormant.lastNudgeSent.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceNudge < 3)
                nudgePenalty = 0.3;
            else if (daysSinceNudge < 7)
                nudgePenalty = 0.15;
        }
        // Previous nudge resistance
        const nudgeResistance = Math.min(dormant.nudgeCount * 0.1, 0.3);
        const rawScore = intentStrength * 0.4 +
            dormancyBonus +
            timingBonus * 0.15 +
            (1 - dormant.dormancyScore) * 0.15 -
            nudgePenalty -
            nudgeResistance;
        return Math.min(1.0, Math.max(0.0, rawScore));
    }
    /**
     * Calculate timing bonus based on category
     */
    calculateTimingBonus(category) {
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay();
        if (category === 'TRAVEL') {
            // Weekends are better for travel planning
            return dayOfWeek === 0 || dayOfWeek === 6 ? 0.2 : 0.05;
        }
        if (category === 'DINING') {
            // Meal times are better for restaurant intents
            if ((hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 21)) {
                return 0.15;
            }
            return 0.05;
        }
        return 0.05;
    }
    /**
     * Calculate ideal revival timing
     */
    calculateIdealRevivalTime(category, daysDormant) {
        const baseDelay = 3; // Days to wait after marking dormant
        const now = new Date();
        switch (category) {
            case 'TRAVEL':
                // Target next weekend
                const daysUntilWeekend = (7 - now.getDay() + 6) % 7 || 7;
                return new Date(now.getTime() + (baseDelay + daysUntilWeekend) * 24 * 60 * 60 * 1000);
            case 'DINING':
                // Target meal times
                const hour = now.getHours();
                let delayHours = hour < 11 ? 11 - hour : hour < 18 ? 18 - hour : 24 - hour + 11;
                return new Date(now.getTime() + delayHours * 60 * 60 * 1000);
            default:
                return new Date(now.getTime() + baseDelay * 24 * 60 * 60 * 1000);
        }
    }
    /**
     * Generate nudge message based on intent and trigger
     */
    generateNudgeMessage(intentKey, category, triggerType, triggerData) {
        const templates = {
            TRAVEL: [
                "You were looking at {intent}. Prices might be changing soon!",
                "Still thinking about {intent}? Perfect weather this weekend!",
                "Great deals on {intent} right now!",
            ],
            DINING: [
                "Your {intent} craving - restaurants near you have new options!",
                "Time for {intent}? Your favorite spots are open!",
                "{intent} is trending this week!",
            ],
            RETAIL: [
                "{intent} you've been eyeing - sale happening now!",
                "Good news! {intent} is available at a great price.",
                "Complete your {intent} order?",
            ],
        };
        const categoryTemplates = templates[category] || templates.RETAIL;
        const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
        return template.replace('{intent}', this.formatIntentKey(intentKey));
    }
    formatIntentKey(key) {
        return key
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    /**
     * Get revival candidates sorted by score
     */
    async getRevivalCandidates(limit = 100, minScore = 0.3) {
        const dormantIntents = await prisma.dormantIntent.findMany({
            where: {
                status: 'active',
                revivalScore: { gte: minScore },
            },
            include: { intent: true },
            orderBy: { revivalScore: 'desc' },
            take: limit,
        });
        return dormantIntents.map((di) => ({
            dormantIntent: di,
            intent: di.intent,
            revivalScore: Number(di.revivalScore),
            suggestedNudge: this.generateNudgeMessage(di.intentKey, di.category, 'scheduled'),
            idealTiming: new Date(di.idealRevivalAt || Date.now()),
        }));
    }
    /**
     * Calculate average velocity between signals
     */
    calculateAvgVelocity(signals) {
        if (signals.length < 2)
            return 0;
        let totalMs = 0;
        for (let i = 0; i < signals.length - 1; i++) {
            totalMs +=
                new Date(signals[i + 1].capturedAt).getTime() -
                    new Date(signals[i].capturedAt).getTime();
        }
        return totalMs / (signals.length - 1);
    }
}
export const intentScoringService = new IntentScoringService();
//# sourceMappingURL=IntentScoringService.js.map