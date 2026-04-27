// ── Intent Capture Service ────────────────────────────────────────────────────
// Captures user intent signals from various app events
import { PrismaClient } from '@prisma/client';
import { BASE_CONFIDENCE, SIGNAL_WEIGHTS, } from '../types/intent.js';
const prisma = new PrismaClient();
export class IntentCaptureService {
    /**
     * Capture an intent event from user action
     */
    async capture(params) {
        const { userId, appType, eventType, category, intentKey, intentQuery, metadata } = params;
        // Calculate signal weight
        const signalWeight = SIGNAL_WEIGHTS[eventType] || 0.1;
        // Find or create intent
        const existingIntent = await prisma.intent.findUnique({
            where: {
                userId_appType_intentKey: { userId, appType, intentKey },
            },
            include: {
                signals: { orderBy: { capturedAt: 'desc' }, take: 10 },
            },
        });
        let intent;
        let signal;
        let isNew = false;
        if (existingIntent) {
            // Update existing intent
            const newConfidence = this.calculateNewConfidence(existingIntent, signalWeight);
            const newStatus = this.determineStatus(eventType, newConfidence);
            intent = await prisma.intent.update({
                where: { id: existingIntent.id },
                data: {
                    confidence: newConfidence,
                    status: newStatus,
                    intentQuery: intentQuery || existingIntent.intentQuery,
                },
            });
            signal = await prisma.intentSignal.create({
                data: {
                    intentId: intent.id,
                    eventType,
                    weight: signalWeight,
                    data: metadata,
                },
            });
            // Update sequence
            await this.addToSequence(intent.id, userId, eventType, existingIntent.signals[0]?.capturedAt);
        }
        else {
            // Create new intent
            isNew = true;
            const initialConfidence = BASE_CONFIDENCE + signalWeight;
            intent = await prisma.intent.create({
                data: {
                    userId,
                    appType,
                    category,
                    intentKey,
                    intentQuery,
                    confidence: initialConfidence,
                    status: this.determineStatus(eventType, initialConfidence),
                },
            });
            signal = await prisma.intentSignal.create({
                data: {
                    intentId: intent.id,
                    eventType,
                    weight: signalWeight,
                    data: metadata,
                },
            });
            // Create sequence entry
            await prisma.intentSequence.create({
                data: {
                    intentId: intent.id,
                    userId,
                    eventType,
                    sequenceOrder: 1,
                },
            });
            // Update cross-app profile
            await this.updateCrossAppProfile(userId, appType, category);
        }
        return { intent, signal, isNew };
    }
    /**
     * Calculate new confidence based on existing signals and new event
     */
    calculateNewConfidence(existingIntent, newSignalWeight) {
        const recencyMultiplier = this.calculateRecencyMultiplier(existingIntent.lastSeenAt);
        const velocityBonus = this.calculateVelocityBonus(existingIntent.signals);
        const baseConfidence = Number(existingIntent.confidence);
        const newConfidence = baseConfidence + (newSignalWeight * recencyMultiplier) + velocityBonus;
        return Math.min(1.0, Math.max(0.0, newConfidence));
    }
    /**
     * Calculate recency multiplier using exponential decay
     */
    calculateRecencyMultiplier(lastSeenAt) {
        const daysSince = (Date.now() - lastSeenAt.getTime()) / (1000 * 60 * 60 * 24);
        return Math.exp(-daysSince / 30);
    }
    /**
     * Calculate velocity bonus for rapid signals
     */
    calculateVelocityBonus(signals) {
        if (signals.length < 2)
            return 0;
        const recentSignals = signals.slice(0, 5);
        const avgTimeBetweenSignals = this.calculateAvgTimeBetweenSignals(recentSignals);
        if (avgTimeBetweenSignals < 60000)
            return 0.2; // Less than 1 minute
        if (avgTimeBetweenSignals < 300000)
            return 0.1; // Less than 5 minutes
        if (avgTimeBetweenSignals < 3600000)
            return 0.05; // Less than 1 hour
        return 0;
    }
    calculateAvgTimeBetweenSignals(signals) {
        if (signals.length < 2)
            return Infinity;
        let totalMs = 0;
        for (let i = 0; i < signals.length - 1; i++) {
            totalMs += new Date(signals[i].capturedAt).getTime() - new Date(signals[i + 1].capturedAt).getTime();
        }
        return totalMs / (signals.length - 1);
    }
    /**
     * Determine intent status based on event type
     */
    determineStatus(eventType, confidence) {
        if (eventType === 'fulfilled')
            return 'FULFILLED';
        if (eventType === 'abandoned')
            return 'DORMANT';
        if (confidence < 0.3)
            return 'DORMANT';
        return 'ACTIVE';
    }
    /**
     * Add event to sequence tracking
     */
    async addToSequence(intentId, userId, eventType, previousSignalAt) {
        const lastSequence = await prisma.intentSequence.findFirst({
            where: { intentId },
            orderBy: { sequenceOrder: 'desc' },
        });
        const durationMs = previousSignalAt
            ? Date.now() - new Date(previousSignalAt).getTime()
            : undefined;
        await prisma.intentSequence.create({
            data: {
                intentId,
                userId,
                eventType,
                sequenceOrder: (lastSequence?.sequenceOrder || 0) + 1,
                durationMs,
            },
        });
    }
    /**
     * Update cross-app intent profile
     */
    async updateCrossAppProfile(userId, appType, category) {
        const profile = await prisma.crossAppIntentProfile.upsert({
            where: { userId },
            create: { userId },
            update: {},
        });
        const incrementField = this.getCategoryIncrementField(appType);
        if (incrementField) {
            await prisma.crossAppIntentProfile.update({
                where: { userId },
                data: { [incrementField]: { increment: 1 } },
            });
        }
        // Recalculate affinities
        await this.recalculateAffinities(profile.id, userId);
    }
    getCategoryIncrementField(appType) {
        switch (appType) {
            case 'hotel_ota': return 'travelIntentCount';
            case 'restaurant': return 'diningIntentCount';
            case 'retail': return 'retailIntentCount';
            default: return null;
        }
    }
    async recalculateAffinities(profileId, userId) {
        const intents = await prisma.intent.findMany({
            where: { userId, status: { in: ['ACTIVE', 'FULFILLED'] } },
            select: { appType: true },
        });
        const counts = { hotel_ota: 0, restaurant: 0, retail: 0 };
        intents.forEach((i) => {
            if (counts[i.appType] !== undefined) {
                counts[i.appType]++;
            }
        });
        const total = Math.max(1, counts.hotel_ota + counts.restaurant + counts.retail);
        await prisma.crossAppIntentProfile.update({
            where: { id: profileId },
            data: {
                travelAffinity: Math.round((counts.hotel_ota / total) * 100),
                diningAffinity: Math.round((counts.restaurant / total) * 100),
                retailAffinity: Math.round((counts.retail / total) * 100),
            },
        });
    }
    /**
     * Get active intents for a user
     */
    async getActiveIntents(userId) {
        return (await prisma.intent.findMany({
            where: { userId, status: 'ACTIVE' },
            orderBy: { lastSeenAt: 'desc' },
        }));
    }
    /**
     * Get all intents for a user across apps
     */
    async getUserIntents(userId) {
        return (await prisma.intent.findMany({
            where: { userId },
            orderBy: { lastSeenAt: 'desc' },
            include: { signals: { orderBy: { capturedAt: 'desc' }, take: 5 } },
        }));
    }
}
export const intentCaptureService = new IntentCaptureService();
//# sourceMappingURL=IntentCaptureService.js.map