// ── Commerce Memory Context API Routes ──────────────────────────────────────────
// API endpoints for Commerce Memory context (used by Chat AI and Support Provider)
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { triggerAutoRevival } from '../agents/action-trigger.js';
import { getUserPersonalizationProfile } from '../agents/personalization-agent.js';
import { getCollaborativeSignalForUser } from '../agents/network-effect-agent.js';
import { crossAppAggregationService } from '../services/CrossAppAggregationService.js';
const prisma = new PrismaClient();
const router = Router();
// ── Get Commerce Memory Context ──────────────────────────────────────────────────
/**
 * GET /api/commerce-memory/context/:userId
 * Get comprehensive Commerce Memory context for a user
 * Used by Chat AI and Support Provider
 */
router.get('/context/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Get active intents
        const activeIntents = await prisma.intent.findMany({
            where: { userId, status: 'ACTIVE' },
            select: {
                id: true,
                intentKey: true,
                category: true,
                confidence: true,
                lastSeenAt: true,
                metadata: true,
            },
            orderBy: { lastSeenAt: 'desc' },
            take: 10,
        });
        // Get dormant intents
        const dormantIntents = await prisma.dormantIntent.findMany({
            where: { userId, status: 'active' },
            select: {
                id: true,
                intentKey: true,
                category: true,
                dormancyScore: true,
                revivalScore: true,
                daysDormant: true,
                lastNudgeSent: true,
            },
            orderBy: { revivalScore: 'desc' },
            take: 5,
        });
        // Get user profile
        const profile = await crossAppAggregationService.getProfile(userId);
        // Get recent orders (simulated)
        const recentOrders = await prisma.$queryRaw `
      SELECT id, merchant_name, order_value, created_at, status
      FROM orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 5
    `;
        // Format response for CommerceMemorySupportProvider
        const context = {
            activeIntents: activeIntents.map((i) => ({
                key: i.intentKey,
                category: i.category,
                confidence: Number(i.confidence),
                lastSeen: formatRelativeTime(i.lastSeenAt),
            })),
            dormantIntents: dormantIntents.map((d) => ({
                key: d.intentKey,
                category: d.category,
                confidence: Number(d.dormancyScore),
                lastSeen: formatRelativeTime(d.lastNudgeSent || new Date(Date.now() - d.daysDormant * 24 * 60 * 60 * 1000)),
                daysDormant: d.daysDormant,
                revivalScore: Number(d.revivalScore),
            })),
            profile: profile ? {
                travelAffinity: profile.travelAffinity,
                diningAffinity: profile.diningAffinity,
                retailAffinity: profile.retailAffinity,
                preferredChannel: 'push', // Default
                totalConversions: profile.totalConversions,
            } : null,
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                type: o.status,
                merchantName: o.merchant_name,
                total: Number(o.order_value),
                date: formatRelativeTime(o.created_at),
                status: o.status,
            })),
            recommendations: generateRecommendations(activeIntents, dormantIntents),
        };
        res.json(context);
    }
    catch (error) {
        console.error('[CommerceMemoryAPI] Get context failed:', error);
        res.status(500).json({ error: 'Failed to get Commerce Memory context' });
    }
});
// ── Trigger Revival ─────────────────────────────────────────────────────────────
/**
 * POST /api/commerce-memory/revival/trigger
 * Trigger revival for a dormant intent
 * Used by Support Provider
 */
router.post('/revival/trigger', async (req, res) => {
    try {
        const { userId, intentKey } = req.body;
        if (!userId || !intentKey) {
            return res.status(400).json({ error: 'Missing userId or intentKey' });
        }
        // Find dormant intent
        const dormantIntent = await prisma.dormantIntent.findFirst({
            where: { userId, intentKey, status: 'active' },
        });
        if (!dormantIntent) {
            return res.status(404).json({ error: 'Dormant intent not found' });
        }
        // Trigger auto-revival (dangerously skips permission)
        const message = `Reminder: You were looking at ${intentKey.replace(/_/g, ' ')}`;
        const success = await triggerAutoRevival(userId, dormantIntent.id, message);
        res.json({ success, dormantIntentId: dormantIntent.id });
    }
    catch (error) {
        console.error('[CommerceMemoryAPI] Trigger revival failed:', error);
        res.status(500).json({ error: 'Failed to trigger revival' });
    }
});
// ── Send Offer ─────────────────────────────────────────────────────────────────
/**
 * POST /api/commerce-memory/offer/send
 * Send a personalized offer for a dormant intent
 * Used by Support Provider
 */
router.post('/offer/send', async (req, res) => {
    try {
        const { userId, intentKey, offer } = req.body;
        if (!userId || !intentKey || !offer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Find dormant intent
        const dormantIntent = await prisma.dormantIntent.findFirst({
            where: { userId, intentKey, status: 'active' },
        });
        if (!dormantIntent) {
            return res.status(404).json({ error: 'Dormant intent not found' });
        }
        // Send nudge with offer (dangerously skips permission)
        const message = `${offer}: ${intentKey.replace(/_/g, ' ')} - limited time!`;
        const success = await triggerAutoRevival(userId, dormantIntent.id, message);
        res.json({ success, offerSent: offer });
    }
    catch (error) {
        console.error('[CommerceMemoryAPI] Send offer failed:', error);
        res.status(500).json({ error: 'Failed to send offer' });
    }
});
// ── Get Personalization Profile ────────────────────────────────────────────────
/**
 * GET /api/commerce-memory/personalization/:userId
 * Get personalization profile for a user
 */
router.get('/personalization/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await getUserPersonalizationProfile(userId);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    }
    catch (error) {
        console.error('[CommerceMemoryAPI] Get personalization profile failed:', error);
        res.status(500).json({ error: 'Failed to get personalization profile' });
    }
});
// ── Get Collaborative Signal ────────────────────────────────────────────────────
/**
 * GET /api/commerce-memory/collaborative/:userId
 * Get collaborative filtering signal for a user
 */
router.get('/collaborative/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const signal = await getCollaborativeSignalForUser(userId);
        if (!signal) {
            return res.status(404).json({ error: 'Signal not found' });
        }
        res.json(signal);
    }
    catch (error) {
        console.error('[CommerceMemoryAPI] Get collaborative signal failed:', error);
        res.status(500).json({ error: 'Failed to get collaborative signal' });
    }
});
// ── Get Enriched Context ───────────────────────────────────────────────────────
/**
 * GET /api/commerce-memory/enriched/:userId
 * Get enriched context for AI agents
 */
router.get('/enriched/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const context = await crossAppAggregationService.getEnrichedContext(userId);
        res.json(context);
    }
    catch (error) {
        console.error('[CommerceMemoryAPI] Get enriched context failed:', error);
        res.status(500).json({ error: 'Failed to get enriched context' });
    }
});
// ── Health Check ──────────────────────────────────────────────────────────────
/**
 * GET /api/commerce-memory/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// ── Helpers ────────────────────────────────────────────────────────────────────
function formatRelativeTime(date) {
    if (!date)
        return 'unknown';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 60)
        return `${diffMins} minutes ago`;
    if (diffHours < 24)
        return `${diffHours} hours ago`;
    if (diffDays < 7)
        return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
}
function generateRecommendations(activeIntents, dormantIntents) {
    const recommendations = [];
    // Recommend revival for high-score dormant intents
    for (const dormant of dormantIntents) {
        const score = Number(dormant.revivalScore);
        if (score > 0.7) {
            recommendations.push(`High-potential revival: ${dormant.intentKey.replace(/_/g, ' ')}`);
        }
    }
    // Recommend follow-up for high-confidence active intents
    for (const active of activeIntents) {
        const confidence = Number(active.confidence);
        if (confidence > 0.8) {
            recommendations.push(`Strong intent detected: ${active.intentKey.replace(/_/g, ' ')}`);
        }
    }
    return recommendations.slice(0, 5);
}
export default router;
//# sourceMappingURL=commerce-memory.routes.js.map