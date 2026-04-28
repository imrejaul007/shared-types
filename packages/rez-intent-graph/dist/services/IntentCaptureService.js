/**
 * Intent Capture Service - MongoDB
 * Captures user intent signals from various app events
 */
import { Intent, IntentSequence, CrossAppIntentProfile, } from '../models/index.js';
import { vibeScoringService } from './VibeScoringService.js';
import { crossAppBridgingService } from './CrossAppBridgingService.js';
// Event weights for confidence calculation
const SIGNAL_WEIGHTS = {
    search: 0.15,
    view: 0.10,
    wishlist: 0.25,
    cart_add: 0.30,
    hold: 0.35,
    checkout_start: 0.40,
    booking_start: 0.40,
    booking_confirmed: 1.0,
    fulfilled: 1.0,
    abandoned: 0.0,
};
const BASE_CONFIDENCE = 0.3;
/**
 * Intent Capture Service - MongoDB Implementation
 */
export class IntentCaptureService {
    /**
     * Capture an intent event from user action
     */
    async capture(params) {
        const { userId, appType, eventType, category, intentKey, intentQuery, metadata, merchantId, } = params;
        // Calculate signal weight
        const signalWeight = SIGNAL_WEIGHTS[eventType] || 0.1;
        // Find or create intent
        const existingIntent = await Intent.findOne({ userId, appType, intentKey });
        let intent;
        let signal;
        let isNew = false;
        if (existingIntent) {
            // Update existing intent
            const newConfidence = this.calculateNewConfidence(existingIntent, signalWeight);
            const newStatus = this.determineStatus(eventType, newConfidence);
            existingIntent.confidence = newConfidence;
            existingIntent.status = newStatus;
            existingIntent.intentQuery = intentQuery || existingIntent.intentQuery;
            existingIntent.lastSeenAt = new Date();
            await existingIntent.save();
            intent = existingIntent;
            // Add signal to array
            signal = {
                eventType,
                weight: signalWeight,
                data: metadata,
                capturedAt: new Date(),
            };
            // Add signal to intent
            await Intent.updateOne({ _id: intent._id }, { $push: { signals: { $each: [signal], $slice: -50 } } });
            // Add to sequence
            await this.addToSequence(intent._id, userId, eventType);
        }
        else {
            // Create new intent
            isNew = true;
            const initialConfidence = Math.min(1.0, BASE_CONFIDENCE + signalWeight);
            intent = await Intent.create({
                userId,
                appType,
                category,
                intentKey,
                intentQuery,
                confidence: initialConfidence,
                status: this.determineStatus(eventType, initialConfidence),
                merchantId,
                metadata,
                firstSeenAt: new Date(),
                lastSeenAt: new Date(),
                signals: [{
                        eventType,
                        weight: signalWeight,
                        data: metadata,
                        capturedAt: new Date(),
                    }],
            });
            signal = intent.signals[0];
            // Create sequence entry
            await IntentSequence.create({
                intentId: intent._id,
                userId,
                eventType,
                sequenceOrder: 1,
                occurredAt: new Date(),
            });
            // Update cross-app profile
            await this.updateCrossAppProfile(userId, appType, category);
        }
        // Fire-and-forget: update vibe profile, detect micro-moment, and find cross-app bridges
        setImmediate(async () => {
            try {
                await vibeScoringService.updateVibeProfile(userId);
                await vibeScoringService.detectMicroMoment(userId, intentKey, eventType);
            }
            catch (err) {
                console.debug('[IntentCapture] Vibe/MicroMoment update failed:', err);
            }
        });
        // Fire-and-forget: cross-app bridge detection
        setImmediate(async () => {
            try {
                const bridges = await crossAppBridgingService.findBridges(userId, intentKey, category);
                if (bridges.length > 0) {
                    console.info(`[IntentCapture] Found ${bridges.length} cross-app bridges for user ${userId}`);
                    // Store bridges in intent metadata for later use
                    await Intent.findByIdAndUpdate(intent._id, {
                        $set: { 'metadata.crossAppBridges': bridges.map(b => b.targetIntent) }
                    });
                }
            }
            catch (err) {
                console.debug('[IntentCapture] Bridge detection failed:', err);
            }
        });
        return { intent, signal, isNew };
    }
    /**
     * Calculate new confidence based on existing signals and new event
     */
    calculateNewConfidence(existingIntent, newSignalWeight) {
        const recencyMultiplier = this.calculateRecencyMultiplier(existingIntent.lastSeenAt);
        const velocityBonus = this.calculateVelocityBonus(existingIntent.signals);
        const baseConfidence = existingIntent.confidence;
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
        const recentSignals = signals.slice(-5);
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
            totalMs += signals[i].capturedAt.getTime() - signals[i + 1].capturedAt.getTime();
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
    async addToSequence(intentId, userId, eventType) {
        const lastSequence = await IntentSequence.findOne({ intentId })
            .sort({ sequenceOrder: -1 });
        const durationMs = lastSequence
            ? Date.now() - lastSequence.occurredAt.getTime()
            : undefined;
        await IntentSequence.create({
            intentId,
            userId,
            eventType,
            sequenceOrder: (lastSequence?.sequenceOrder || 0) + 1,
            durationMs,
            occurredAt: new Date(),
        });
    }
    /**
     * Update cross-app intent profile
     */
    async updateCrossAppProfile(userId, appType, category) {
        const incrementField = this.getCategoryIncrementField(appType);
        if (incrementField) {
            await CrossAppIntentProfile.findOneAndUpdate({ userId }, { $inc: { [incrementField]: 1 } }, { upsert: true });
        }
        // Recalculate affinities
        await this.recalculateAffinities(userId);
    }
    getCategoryIncrementField(appType) {
        switch (appType) {
            case 'hotel_ota':
            case 'hotel_guest':
                return 'travelIntentCount';
            case 'restaurant':
            case 'rez_now':
                return 'diningIntentCount';
            case 'retail':
                return 'retailIntentCount';
            default:
                return null;
        }
    }
    async recalculateAffinities(userId) {
        const intents = await Intent.find({
            userId,
            status: { $in: ['ACTIVE', 'FULFILLED'] },
        }).select('appType').limit(1000);
        const counts = { hotel_ota: 0, restaurant: 0, retail: 0, hotel_guest: 0, rez_now: 0 };
        intents.forEach((i) => {
            if (counts[i.appType] !== undefined) {
                counts[i.appType]++;
            }
        });
        // Group by category
        const travelCount = counts.hotel_ota + counts.hotel_guest;
        const diningCount = counts.restaurant + counts.rez_now;
        const retailCount = counts.retail;
        const total = Math.max(1, travelCount + diningCount + retailCount);
        await CrossAppIntentProfile.findOneAndUpdate({ userId }, {
            $set: {
                travelAffinity: Math.round((travelCount / total) * 100),
                diningAffinity: Math.round((diningCount / total) * 100),
                retailAffinity: Math.round((retailCount / total) * 100),
                updatedAt: new Date(),
            },
        });
    }
    /**
     * Get active intents for a user
     */
    async getActiveIntents(userId, page = 1, limit = 20) {
        return Intent.find({ userId, status: 'ACTIVE' })
            .sort({ lastSeenAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    /**
     * Get all intents for a user across apps
     */
    async getUserIntents(userId, page = 1, limit = 20) {
        return Intent.find({ userId })
            .sort({ lastSeenAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    /**
     * Get intents by app type
     */
    async getIntentsByApp(userId, appType) {
        return Intent.find({ userId, appType })
            .sort({ lastSeenAt: -1 });
    }
}
export const intentCaptureService = new IntentCaptureService();
//# sourceMappingURL=IntentCaptureService.js.map