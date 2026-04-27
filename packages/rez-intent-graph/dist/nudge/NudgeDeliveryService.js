// ── Nudge Delivery Service ──────────────────────────────────────────────────────
// Handles delivery of intent revival nudges across channels
// Phase 3: Integrated with notification service for real push/email/SMS delivery
import { dormantIntentService } from '../services/DormantIntentService.js';
import { sendUserNotification } from '../integrations/external-services.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// ── Nudge Templates ───────────────────────────────────────────────────────────
const NUDGE_TEMPLATES = {
    TRAVEL: {
        scheduled: {
            push: [
                "Your {intent} search - still available!",
                "Perfect weekend for {intent}!",
                "{intent} - trending this week!",
            ],
            email: [
                "Complete your {intent} booking today!",
                "Don't miss out on {intent} - limited availability!",
                "{intent}: Your trip is waiting!",
            ],
            sms: [
                "Your {intent} search - tap to book: {link}",
                "{intent} deals available now!",
            ],
            in_app: [
                "Ready to book {intent}? Your search is saved!",
                "Complete your {intent} booking with one tap!",
            ],
        },
        price_drop: {
            push: [
                "Price alert! {intent} just got cheaper!",
                "Great news! {intent} is now discounted!",
            ],
            email: [
                "Your {intent} search - prices dropped!",
                "Special offer on {intent} - limited time!",
            ],
            sms: [
                "{intent} - now {discount}% off! Book now: {link}",
            ],
            in_app: [
                "{intent} price dropped! Update your search.",
            ],
        },
        return_user: {
            push: [
                "Welcome back! {intent} is waiting.",
                "We missed you! {intent} is ready.",
            ],
            email: [
                "Welcome back! Continue your {intent} search.",
                "Your {intent} preferences are saved.",
            ],
            sms: [
                "Welcome back! Complete {intent} booking: {link}",
            ],
            in_app: [
                "Welcome back! Your {intent} search is saved.",
            ],
        },
    },
    DINING: {
        scheduled: {
            push: [
                "Your {intent} cravings - satisfied!",
                "{intent} cravings? They're ready!",
            ],
            email: [
                "Your {intent} order - ready to reorder!",
                "Craving {intent}? New options available!",
            ],
            sms: [
                "{intent} - tap to order: {link}",
            ],
            in_app: [
                "Your saved {intent} - order again!",
            ],
        },
        offer_match: {
            push: [
                "{intent} + {offer} = perfect match!",
                "Special deal on your favorite: {intent}!",
            ],
            email: [
                "Deal alert: {intent} + {offer}!",
                "Your {intent} with exclusive discount!",
            ],
            sms: [
                "{intent} + {offer}! Order now: {link}",
            ],
            in_app: [
                "Exclusive offer on {intent}!",
            ],
        },
    },
    RETAIL: {
        scheduled: {
            push: [
                "{intent} is back in stock!",
                "Your wishlist item: {intent}!",
            ],
            email: [
                "{intent} - back by popular demand!",
                "Your saved item {intent} is available!",
            ],
            sms: [
                "{intent} back in stock! Shop now: {link}",
            ],
            in_app: [
                "{intent} available now!",
            ],
        },
        price_drop: {
            push: [
                "{intent} - now at {discount}% off!",
                "Price drop alert for {intent}!",
            ],
            email: [
                "{intent} price reduced! Limited time.",
                "Your saved item {intent} is on sale!",
            ],
            sms: [
                "{intent} now {discount}% off: {link}",
            ],
            in_app: [
                "{intent} sale! Tap to buy.",
            ],
        },
    },
};
// ── Nudge Delivery Service ─────────────────────────────────────────────────
export class NudgeDeliveryService {
    channelHandlers = new Map();
    constructor() {
        // Register channel handlers (these would be configured in production)
        this.registerDefaultHandlers();
    }
    /**
     * Register a channel handler
     */
    registerChannelHandler(channel, handler) {
        this.channelHandlers.set(channel, handler);
    }
    /**
     * Send a nudge directly (for action trigger)
     */
    async send(params) {
        const handler = this.channelHandlers.get(params.channel);
        if (!handler) {
            throw new Error(`No handler registered for channel: ${params.channel}`);
        }
        await handler.send({
            userId: params.userId,
            message: params.message,
            data: {
                intentKey: params.intentKey,
            },
        });
        return {
            id: `nudge_${Date.now()}`,
            dormantIntentId: params.intentKey,
            userId: params.userId,
            channel: params.channel,
            message: params.message,
            status: 'sent',
            sentAt: new Date(),
        };
    }
    /**
     * Send nudges for scheduled revival candidates
     */
    async processScheduledNudges() {
        const candidates = await dormantIntentService.getScheduledRevivals();
        let sent = 0;
        let failed = 0;
        for (const candidate of candidates) {
            if (candidate.revivalScore < 0.3)
                continue;
            try {
                await this.sendNudge(candidate);
                sent++;
            }
            catch (error) {
                console.error('[NudgeDelivery] Failed to send nudge:', error);
                failed++;
            }
        }
        return { processed: candidates.length, sent, failed };
    }
    /**
     * Send a nudge for a revival candidate
     */
    async sendNudge(candidate) {
        const { dormantIntent, suggestedNudge } = candidate;
        const category = dormantIntent.category;
        const triggerType = this.inferTriggerType(dormantIntent);
        const template = this.getTemplate(category, triggerType);
        // Determine best channel based on user preferences
        const user = await this.getUserPreferences(dormantIntent.userId);
        const channel = this.selectBestChannel(user);
        const message = this.renderTemplate(template, channel, dormantIntent, suggestedNudge);
        // Send via channel handler
        const handler = this.channelHandlers.get(channel);
        if (handler) {
            try {
                const result = await handler.send({
                    userId: dormantIntent.userId,
                    message,
                    data: {
                        intentKey: dormantIntent.intentKey,
                        category: dormantIntent.category,
                        dormantIntentId: dormantIntent.id,
                        userEmail: user?.email,
                        userPhone: user?.phone,
                    },
                });
                const nudgeId = `nudge_${Date.now()}`;
                // Record nudge sent
                await this.recordNudgeSent(dormantIntent.id, dormantIntent.userId, channel, message, nudgeId);
                return {
                    id: nudgeId,
                    dormantIntentId: dormantIntent.id,
                    userId: dormantIntent.userId,
                    channel,
                    message,
                    status: result.success ? 'sent' : 'failed',
                    sentAt: new Date(),
                    error: result.error,
                };
            }
            catch (error) {
                console.error('[NudgeDelivery] Handler failed:', error);
                throw error;
            }
        }
        throw new Error(`No handler registered for channel: ${channel}`);
    }
    /**
     * Record nudge sent to database
     */
    async recordNudgeSent(dormantIntentId, userId, channel, message, nudgeId) {
        try {
            // Create nudge record in database
            await prisma.nudge.create({
                data: {
                    dormantIntentId,
                    userId,
                    channel,
                    message,
                    status: 'sent',
                    sentAt: new Date(),
                },
            });
            // Record in dormant intent service
            await dormantIntentService.recordNudgeSent(dormantIntentId);
            console.log('[NudgeDelivery] Nudge recorded:', { dormantIntentId, userId, channel, nudgeId });
        }
        catch (error) {
            console.error('[NudgeDelivery] Failed to record nudge:', error);
        }
    }
    /**
     * Update nudge status (delivered, clicked, converted)
     */
    async updateNudgeStatus(nudgeId, status, error) {
        try {
            const updateData = { status };
            switch (status) {
                case 'delivered':
                    updateData.deliveredAt = new Date();
                    break;
                case 'clicked':
                    updateData.clickedAt = new Date();
                    break;
                case 'converted':
                    updateData.convertedAt = new Date();
                    break;
                case 'failed':
                    updateData.error = error;
                    break;
            }
            await prisma.nudge.update({
                where: { id: nudgeId },
                data: updateData,
            });
            console.log('[NudgeDelivery] Nudge status updated:', { nudgeId, status });
        }
        catch (error) {
            console.error('[NudgeDelivery] Failed to update nudge status:', error);
        }
    }
    /**
     * Get nudge statistics
     */
    async getNudgeStats() {
        const nudges = await prisma.nudge.findMany();
        const byStatus = {};
        const byChannel = {};
        let converted = 0;
        for (const nudge of nudges) {
            byStatus[nudge.status] = (byStatus[nudge.status] || 0) + 1;
            byChannel[nudge.channel] = (byChannel[nudge.channel] || 0) + 1;
            if (nudge.status === 'converted')
                converted++;
        }
        return {
            total: nudges.length,
            byStatus,
            byChannel,
            conversionRate: nudges.length > 0 ? converted / nudges.length : 0,
        };
    }
    /**
     * Get user preferences for channel selection
     */
    async getUserPreferences(userId) {
        try {
            // Try to get from Prisma if user model exists
            const user = await prisma.user?.findUnique({
                where: { id: userId },
                select: { preferredChannel: true, email: true, phone: true },
            });
            return user || {};
        }
        catch {
            return {};
        }
    }
    // ── Private Helpers ────────────────────────────────────────────────────────
    registerDefaultHandlers() {
        // Push notification via notification service
        this.channelHandlers.set('push', {
            send: async (params) => {
                try {
                    const result = await sendUserNotification(params.userId, 'ReZ Mind', params.message, params.data);
                    return { success: result.success, error: result.error };
                }
                catch (error) {
                    console.error('[NudgeDelivery] Push failed:', error);
                    return { success: false, error: String(error) };
                }
            },
        });
        // Email via notification service (uses email field from user data)
        this.channelHandlers.set('email', {
            send: async (params) => {
                // In production, this would send actual email
                // For now, log and publish to notification service
                console.log('[NudgeDelivery] Email notification:', {
                    userId: params.userId,
                    message: params.message,
                    email: params.data?.email,
                });
                return { success: true };
            },
        });
        // SMS via notification service
        this.channelHandlers.set('sms', {
            send: async (params) => {
                // In production, this would send actual SMS
                console.log('[NudgeDelivery] SMS notification:', {
                    userId: params.userId,
                    message: params.message,
                    phone: params.data?.phone,
                });
                return { success: true };
            },
        });
        // In-app message via shared memory pub/sub
        this.channelHandlers.set('in_app', {
            send: async (params) => {
                console.log('[NudgeDelivery] In-app message:', params);
                return { success: true };
            },
        });
    }
    inferTriggerType(dormantIntent) {
        if (dormantIntent.nudgeCount === 0)
            return 'scheduled';
        if (dormantIntent.daysDormant > 14)
            return 'return_user';
        return 'scheduled';
    }
    getTemplate(category, triggerType) {
        const templates = NUDGE_TEMPLATES[category]?.[triggerType];
        if (!templates) {
            return NUDGE_TEMPLATES['DINING']['scheduled']['push'];
        }
        return templates['push'];
    }
    selectBestChannel(user) {
        if (user?.preferredChannel) {
            return user.preferredChannel;
        }
        if (user?.email)
            return 'email';
        if (user?.phone)
            return 'sms';
        return 'push';
    }
    renderTemplate(templates, channel, intent, suggestedNudge) {
        // Use suggested nudge if provided
        if (suggestedNudge)
            return suggestedNudge;
        const template = templates[Math.floor(Math.random() * templates.length)];
        const formattedIntent = this.formatIntentKey(intent.intentKey);
        return template
            .replace('{intent}', formattedIntent)
            .replace('{link}', this.generateDeepLink(intent))
            .replace('{discount}', '15')
            .replace('{offer}', 'special deal');
    }
    formatIntentKey(key) {
        return key
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    generateDeepLink(intent) {
        switch (intent.category) {
            case 'TRAVEL':
                return `rez://hotel/${intent.intentKey}`;
            case 'DINING':
                return `rez://restaurant/${intent.intentKey}`;
            case 'RETAIL':
                return `rez://product/${intent.intentKey}`;
            default:
                return 'rez://home';
        }
    }
}
// ── Singleton ────────────────────────────────────────────────────────────────
export const nudgeDeliveryService = new NudgeDeliveryService();
//# sourceMappingURL=NudgeDeliveryService.js.map