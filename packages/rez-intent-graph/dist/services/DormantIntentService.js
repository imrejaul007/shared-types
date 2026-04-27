// ── Dormant Intent Service ─────────────────────────────────────────────────────
// Detects dormant intents, manages revival scheduling, and sends nudges
import { PrismaClient } from '@prisma/client';
import { intentScoringService } from './IntentScoringService.js';
import { DORMANCY_THRESHOLD_DAYS } from '../types/intent.js';
const prisma = new PrismaClient();
export class DormantIntentService {
    /**
     * Mark an intent as dormant and create DormantIntent record
     */
    async markDormant(intentId) {
        const intent = await prisma.intent.findUnique({
            where: { id: intentId },
        });
        if (!intent || intent.status === 'DORMANT')
            return null;
        const daysDormant = Math.floor((Date.now() - intent.lastSeenAt.getTime()) / (1000 * 60 * 60 * 24));
        // Calculate dormancy score (inverse of confidence)
        const dormancyScore = 1 - Number(intent.confidence);
        // Create dormant intent record
        const dormantIntent = await prisma.dormantIntent.upsert({
            where: {
                userId_appType_intentKey: {
                    userId: intent.userId,
                    appType: intent.appType,
                    intentKey: intent.intentKey,
                },
            },
            create: {
                intentId: intent.id,
                userId: intent.userId,
                appType: intent.appType,
                category: intent.category,
                intentKey: intent.intentKey,
                dormancyScore,
                revivalScore: 0,
                daysDormant,
                idealRevivalAt: intentScoringService.calculateIdealRevivalTime(intent.category, daysDormant),
            },
            update: {
                daysDormant,
                dormancyScore,
                revivedAt: null,
                status: 'active',
            },
        });
        // Update intent status
        await prisma.intent.update({
            where: { id: intentId },
            data: { status: 'DORMANT' },
        });
        // Update cross-app profile
        await this.updateCrossAppDormancy(intent.userId, intent.appType);
        return dormantIntent;
    }
    /**
     * Process all intents and detect newly dormant ones
     */
    async detectAndMarkDormant(daysThreshold = DORMANCY_THRESHOLD_DAYS) {
        const detections = await intentScoringService.detectDormantIntents(daysThreshold);
        let markedDormant = 0;
        for (const detection of detections) {
            if (detection.shouldMarkDormant) {
                const result = await this.markDormant(detection.intentId);
                if (result)
                    markedDormant++;
            }
        }
        return { processed: detections.length, markedDormant };
    }
    /**
     * Calculate and update revival scores for all active dormant intents
     */
    async updateRevivalScores() {
        const dormantIntents = await prisma.dormantIntent.findMany({
            where: { status: 'active' },
            include: { intent: true },
        });
        let updated = 0;
        for (const di of dormantIntents) {
            const score = await intentScoringService.calculateRevivalScore(di.id);
            const daysDormant = di.intent
                ? Math.floor((Date.now() - new Date(di.intent.lastSeenAt).getTime()) / (1000 * 60 * 60 * 24))
                : di.daysDormant;
            await prisma.dormantIntent.update({
                where: { id: di.id },
                data: {
                    revivalScore: score,
                    daysDormant,
                },
            });
            updated++;
        }
        return updated;
    }
    /**
     * Get dormant intents for a specific user
     */
    async getUserDormantIntents(userId) {
        return (await prisma.dormantIntent.findMany({
            where: { userId, status: 'active' },
            orderBy: { revivalScore: 'desc' },
        }));
    }
    /**
     * Get dormant intents by merchant and category
     */
    async getDormantIntentsByMerchant(merchantId, category) {
        // Join with intents to filter by merchantId
        const dormantIntents = await prisma.$queryRaw `
      SELECT DISTINCT di.user_id, di.intent_key, di.category
      FROM dormant_intents di
      JOIN intents i ON i.id = di.intent_id
      WHERE i.merchant_id = ${merchantId}
      AND di.category = ${category}
      AND di.status = 'active'
      LIMIT 100
    `;
        return dormantIntents.map((di) => ({
            userId: di.user_id,
            intentKey: di.intent_key,
            category: di.category,
        }));
    }
    /**
     * Trigger revival for a specific dormant intent
     */
    async triggerRevival(dormantIntentId, triggerType) {
        const dormant = await prisma.dormantIntent.findUnique({
            where: { id: dormantIntentId },
            include: { intent: true },
        });
        if (!dormant || dormant.status !== 'active')
            return null;
        // Recalculate revival score with trigger bonus
        let bonus = 0;
        switch (triggerType) {
            case 'price_drop':
                bonus = 0.2;
                break;
            case 'return_user':
                bonus = 0.15;
                break;
            case 'seasonality':
                bonus = 0.1;
                break;
            case 'offer_match':
                bonus = 0.25;
                break;
            case 'manual':
                bonus = 0.05;
                break;
        }
        const baseScore = await intentScoringService.calculateRevivalScore(dormantIntentId);
        const newScore = Math.min(1.0, baseScore + bonus);
        await prisma.dormantIntent.update({
            where: { id: dormantIntentId },
            data: { revivalScore: newScore },
        });
        return {
            dormantIntent: dormant,
            intent: dormant.intent,
            revivalScore: newScore,
            suggestedNudge: intentScoringService.generateNudgeMessage(dormant.intentKey, dormant.category, triggerType),
            idealTiming: dormant.idealRevivalAt
                ? new Date(dormant.idealRevivalAt)
                : new Date(),
        };
    }
    /**
     * Record nudge sent and update count
     */
    async recordNudgeSent(dormantIntentId) {
        await prisma.dormantIntent.update({
            where: { id: dormantIntentId },
            data: {
                lastNudgeSent: new Date(),
                nudgeCount: { increment: 1 },
            },
        });
    }
    /**
     * Mark a dormant intent as revived (user converted)
     */
    async markRevived(dormantIntentId) {
        const dormant = await prisma.dormantIntent.findUnique({
            where: { id: dormantIntentId },
        });
        if (!dormant)
            return;
        await prisma.dormantIntent.update({
            where: { id: dormantIntentId },
            data: {
                status: 'revived',
                revivedAt: new Date(),
            },
        });
        await prisma.intent.update({
            where: { id: dormant.intentId },
            data: { status: 'FULFILLED' },
        });
        // Update cross-app profile
        await prisma.crossAppIntentProfile.update({
            where: { userId: dormant.userId },
            data: { totalConversions: { increment: 1 } },
        });
    }
    /**
     * Pause nudges for a dormant intent (user opted out)
     */
    async pauseNudges(dormantIntentId) {
        await prisma.dormantIntent.update({
            where: { id: dormantIntentId },
            data: { status: 'paused' },
        });
    }
    /**
     * Update cross-app profile dormancy counts
     */
    async updateCrossAppDormancy(userId, appType) {
        const field = appType === 'hotel_ota'
            ? 'dormantTravelCount'
            : appType === 'restaurant'
                ? 'dormantDiningCount'
                : 'dormantRetailCount';
        await prisma.crossAppIntentProfile.update({
            where: { userId },
            data: { [field]: { increment: 1 } },
        });
    }
    /**
     * Get scheduled revival candidates (due for nudge)
     */
    async getScheduledRevivals() {
        const now = new Date();
        const dormantIntents = await prisma.dormantIntent.findMany({
            where: {
                status: 'active',
                idealRevivalAt: { lte: now },
            },
            include: { intent: true },
        });
        return dormantIntents.map((di) => ({
            dormantIntent: di,
            intent: di.intent,
            revivalScore: Number(di.revivalScore),
            suggestedNudge: intentScoringService.generateNudgeMessage(di.intentKey, di.category, 'scheduled'),
            idealTiming: new Date(di.idealRevivalAt || now),
        }));
    }
}
export const dormantIntentService = new DormantIntentService();
//# sourceMappingURL=DormantIntentService.js.map