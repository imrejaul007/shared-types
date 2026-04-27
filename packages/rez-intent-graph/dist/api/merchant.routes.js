// ── Merchant Demand API Routes ──────────────────────────────────────────────────────
// Phase 5: Demand Signals for Merchants - Procurement Intelligence
// Provides merchants with real-time demand aggregation and insights
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sharedMemory } from '../agents/shared-memory.js';
import { getMerchantDemand } from '../agents/demand-signal-agent.js';
const prisma = new PrismaClient();
const router = Router();
// ── Merchant Authentication Middleware ──────────────────────────────────────────
// In production, this would verify merchant JWT
function verifyMerchantAuth(req, res, next) {
    const merchantToken = req.headers['x-merchant-token'];
    const internalToken = req.headers['x-internal-token'];
    // Allow internal service calls
    if (internalToken === process.env.INTERNAL_SERVICE_TOKEN) {
        next();
        return;
    }
    // In production: verify merchant JWT
    if (!merchantToken) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    next();
}
router.use(verifyMerchantAuth);
// ── Demand Dashboard ────────────────────────────────────────────────────────────
/**
 * GET /api/merchant/:merchantId/demand/dashboard
 * Get complete demand dashboard for a merchant
 */
router.get('/:merchantId/demand/dashboard', async (req, res) => {
    const { merchantId } = req.params;
    const { category } = req.query;
    try {
        const categories = category
            ? [category]
            : ['TRAVEL', 'DINING', 'RETAIL'];
        const dashboard = {
            merchantId,
            timestamp: new Date().toISOString(),
            categories: {},
        };
        for (const cat of categories) {
            // Get demand signal
            const signal = await sharedMemory.getDemandSignal(merchantId, cat);
            // Get intent count
            const intentCount = await prisma.intent.count({
                where: { merchantId, category: cat },
            });
            // Get active vs dormant breakdown
            const activeCount = await prisma.intent.count({
                where: { merchantId, category: cat, status: 'ACTIVE' },
            });
            const dormantCount = await prisma.intent.count({
                where: { merchantId, category: cat, status: 'DORMANT' },
            });
            // Get recent demand (last 24h)
            const recentSignals = await prisma.intentSignal.count({
                where: {
                    intent: { merchantId, category: cat },
                    capturedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                    eventType: { in: ['search', 'view', 'wishlist', 'cart_add'] },
                },
            });
            dashboard.categories[cat] = {
                signal: signal || null,
                stats: {
                    totalIntents: intentCount,
                    activeIntents: activeCount,
                    dormantIntents: dormantCount,
                    recentActivity: recentSignals,
                },
                health: signal
                    ? getDemandHealth(signal.demandCount, signal.unmetDemandPct)
                    : 'unknown',
            };
        }
        res.json(dashboard);
    }
    catch (error) {
        console.error('[MerchantAPI] Dashboard failed:', error);
        res.status(500).json({ error: 'Failed to get dashboard' });
    }
});
/**
 * GET /api/merchant/:merchantId/demand/signal
 * Get real-time demand signal for a specific category
 */
router.get('/:merchantId/demand/signal', async (req, res) => {
    const { merchantId } = req.params;
    const { category = 'DINING' } = req.query;
    try {
        const signal = await getMerchantDemand(merchantId, category);
        res.json(signal);
    }
    catch (error) {
        console.error('[MerchantAPI] Demand signal failed:', error);
        res.status(500).json({ error: 'Failed to get demand signal' });
    }
});
// ── Procurement Signals ───────────────────────────────────────────────────────────
/**
 * GET /api/merchant/:merchantId/procurement
 * Get procurement recommendations based on demand gaps
 */
router.get('/:merchantId/procurement', async (req, res) => {
    const { merchantId } = req.params;
    const { category = 'DINING' } = req.query;
    try {
        // Get all demand signals for this category
        const demandSignals = await prisma.merchantDemandSignal.findMany({
            where: { category: category },
            orderBy: { demandCount: 'desc' },
            take: 100,
        });
        // Calculate category-wide metrics
        const totalDemand = demandSignals.reduce((sum, s) => sum + s.demandCount, 0);
        const avgUnmetDemand = demandSignals.length > 0
            ? demandSignals.reduce((sum, s) => sum + Number(s.unmetDemandPct), 0) /
                demandSignals.length
            : 0;
        // Find high-demand items with low supply (gaps)
        const gaps = [];
        for (const signal of demandSignals) {
            if (signal.demandCount > 10 && Number(signal.unmetDemandPct) > 30) {
                gaps.push({
                    merchantId: signal.merchantId,
                    demandCount: signal.demandCount,
                    unmetPct: Number(signal.unmetDemandPct),
                    gapScore: signal.demandCount * (Number(signal.unmetDemandPct) / 100),
                });
            }
        }
        // Get seasonality forecast
        const seasonality = await getSeasonalityForecast(category);
        // Build procurement recommendations
        const recommendations = gaps
            .sort((a, b) => b.gapScore - a.gapScore)
            .slice(0, 10)
            .map((gap) => ({
            type: 'expand_inventory',
            priority: gap.gapScore > 50 ? 'high' : gap.gapScore > 20 ? 'medium' : 'low',
            demandCount: gap.demandCount,
            unmetDemand: `${gap.unmetPct.toFixed(0)}%`,
            action: `Consider expanding inventory to capture ${gap.demandCount} unmet demand`,
            expectedCapture: `${Math.min(80, gap.unmetPct).toFixed(0)}% conversion if addressed`,
        }));
        res.json({
            merchantId,
            category: category,
            totalMarketDemand: totalDemand,
            avgUnmetDemand: avgUnmetDemand.toFixed(1),
            gaps: recommendations,
            seasonality,
            generatedAt: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('[MerchantAPI] Procurement failed:', error);
        res.status(500).json({ error: 'Failed to get procurement signals' });
    }
});
// ── Top Performing Intents ───────────────────────────────────────────────────────
/**
 * GET /api/merchant/:merchantId/intents/top
 * Get top performing intents (by conversion potential)
 */
router.get('/:merchantId/intents/top', async (req, res) => {
    const { merchantId } = req.params;
    const { category, limit = '20' } = req.query;
    try {
        const whereClause = { merchantId };
        if (category)
            whereClause.category = category;
        const intents = await prisma.intent.findMany({
            where: whereClause,
            orderBy: { confidence: 'desc' },
            take: parseInt(limit),
            select: {
                id: true,
                intentKey: true,
                category: true,
                confidence: true,
                status: true,
                firstSeenAt: true,
                lastSeenAt: true,
                _count: { select: { signals: true, dormantIntents: true } },
            },
        });
        res.json({
            merchantId,
            intents: intents.map((i) => ({
                id: i.id,
                intentKey: i.intentKey,
                category: i.category,
                confidence: Number(i.confidence),
                status: i.status,
                signalCount: i._count.signals,
                dormantCount: i._count.dormantIntents,
                firstSeen: i.firstSeenAt,
                lastSeen: i.lastSeenAt,
                conversionPotential: Number(i.confidence) > 0.7
                    ? 'high'
                    : Number(i.confidence) > 0.4
                        ? 'medium'
                        : 'low',
            })),
        });
    }
    catch (error) {
        console.error('[MerchantAPI] Top intents failed:', error);
        res.status(500).json({ error: 'Failed to get top intents' });
    }
});
// ── Demand Trends ───────────────────────────────────────────────────────────────
/**
 * GET /api/merchant/:merchantId/trends
 * Get demand trends over time
 */
router.get('/:merchantId/trends', async (req, res) => {
    const { merchantId } = req.params;
    const { category, period = '7d' } = req.query;
    const periodMs = period === '24h'
        ? 24 * 60 * 60 * 1000
        : period === '7d'
            ? 7 * 24 * 60 * 60 * 1000
            : 30 * 24 * 60 * 60 * 1000;
    const since = new Date(Date.now() - periodMs);
    const bucketSize = period === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1h or 1d buckets
    try {
        const whereClause = {
            intent: { merchantId },
            capturedAt: { gte: since },
            eventType: { in: ['search', 'view', 'wishlist', 'cart_add'] },
        };
        if (category)
            whereClause.intent.category = category;
        const signals = await prisma.intentSignal.findMany({
            where: whereClause,
            select: { capturedAt: true, eventType: true },
            orderBy: { capturedAt: 'asc' },
        });
        // Bucket signals by time
        const buckets = {};
        for (const signal of signals) {
            const bucketTime = new Date(Math.floor(signal.capturedAt.getTime() / bucketSize) * bucketSize);
            const key = bucketTime.toISOString();
            if (!buckets[key]) {
                buckets[key] = { search: 0, view: 0, wishlist: 0, cart: 0 };
            }
            switch (signal.eventType) {
                case 'search':
                    buckets[key].search++;
                    break;
                case 'view':
                    buckets[key].view++;
                    break;
                case 'wishlist':
                    buckets[key].wishlist++;
                    break;
                case 'cart_add':
                    buckets[key].cart++;
                    break;
            }
        }
        // Convert to array and calculate totals
        const trend = Object.entries(buckets)
            .map(([time, counts]) => ({
            time,
            ...counts,
            total: counts.search + counts.view + counts.wishlist + counts.cart,
        }))
            .sort((a, b) => a.time.localeCompare(b.time));
        // Calculate summary
        const totalSignals = trend.reduce((sum, t) => sum + t.total, 0);
        const avgSignals = trend.length > 0 ? totalSignals / trend.length : 0;
        const firstTrend = trend.length > 0 ? trend[0].total : 0;
        const lastTrend = trend.length > 0 ? trend[trend.length - 1].total : 0;
        const trendDirection = lastTrend > firstTrend * 1.1
            ? 'rising'
            : lastTrend < firstTrend * 0.9
                ? 'declining'
                : 'stable';
        res.json({
            merchantId,
            category: category || 'all',
            period,
            dataPoints: trend.length,
            summary: {
                totalSignals,
                avgPerBucket: avgSignals.toFixed(1),
                trendDirection,
                changePct: firstTrend > 0
                    ? (((lastTrend - firstTrend) / firstTrend) * 100).toFixed(1)
                    : '0',
            },
            trend,
        });
    }
    catch (error) {
        console.error('[MerchantAPI] Trends failed:', error);
        res.status(500).json({ error: 'Failed to get trends' });
    }
});
// ── City/Location Insights ──────────────────────────────────────────────────────
/**
 * GET /api/merchant/:merchantId/locations
 * Get demand by location/city
 */
router.get('/:merchantId/locations', async (req, res) => {
    const { merchantId } = req.params;
    const { category, limit = '10' } = req.query;
    try {
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
        const whereClause = {
            merchantId,
            firstSeenAt: { gte: since },
        };
        if (category)
            whereClause.category = category;
        const intents = await prisma.intent.findMany({
            where: whereClause,
            select: { metadata: true },
        });
        // Extract cities from metadata
        const cityCounts = new Map();
        for (const intent of intents) {
            const metadata = intent.metadata;
            const city = metadata?.city || intent.metadata?.city;
            if (city && typeof city === 'string') {
                cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
            }
        }
        const topCities = Array.from(cityCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, parseInt(limit))
            .map(([city, count], index) => ({
            rank: index + 1,
            city,
            demandCount: count,
            demandPct: ((count / intents.length) * 100).toFixed(1),
        }));
        res.json({
            merchantId,
            category: category || 'all',
            period: '30d',
            totalIntents: intents.length,
            locations: topCities,
        });
    }
    catch (error) {
        console.error('[MerchantAPI] Locations failed:', error);
        res.status(500).json({ error: 'Failed to get location insights' });
    }
});
// ── Price Expectations ─────────────────────────────────────────────────────────
/**
 * GET /api/merchant/:merchantId/pricing
 * Get price expectations based on demand
 */
router.get('/:merchantId/pricing', async (req, res) => {
    const { merchantId } = req.params;
    const { category } = req.query;
    try {
        const whereClause = {
            merchantId,
            status: { in: ['ACTIVE', 'DORMANT'] },
        };
        if (category)
            whereClause.category = category;
        // Get intents with price metadata
        const intents = await prisma.intent.findMany({
            where: whereClause,
            select: { metadata: true, confidence: true },
        });
        let priceSum = 0;
        let priceCount = 0;
        let highConfidenceSum = 0;
        let highConfidenceCount = 0;
        for (const intent of intents) {
            const metadata = intent.metadata;
            const price = metadata?.price || intent.metadata?.price;
            if (price && price > 0) {
                priceSum += price;
                priceCount++;
                if (Number(intent.confidence) > 0.6) {
                    highConfidenceSum += price;
                    highConfidenceCount++;
                }
            }
        }
        const avgPrice = priceCount > 0 ? priceSum / priceCount : 0;
        const avgHighConfidencePrice = highConfidenceCount > 0 ? highConfidenceSum / highConfidenceCount : avgPrice;
        res.json({
            merchantId,
            category: category || 'all',
            priceExpectations: {
                avgPrice: avgPrice > 0 ? avgPrice.toFixed(2) : null,
                avgHighIntentPrice: avgHighConfidencePrice > 0 ? avgHighConfidencePrice.toFixed(2) : null,
                sampleSize: priceCount,
                recommendation: avgHighConfidencePrice > 0 && avgPrice > 0
                    ? avgHighConfidencePrice > avgPrice
                        ? 'Price point acceptable, consider premium positioning'
                        : 'Consider competitive pricing to capture high-intent users'
                    : 'Insufficient data for pricing recommendation',
            },
        });
    }
    catch (error) {
        console.error('[MerchantAPI] Pricing failed:', error);
        res.status(500).json({ error: 'Failed to get pricing insights' });
    }
});
// ── Alerts Configuration ───────────────────────────────────────────────────────
/**
 * POST /api/merchant/:merchantId/alerts
 * Configure demand alerts
 */
router.post('/:merchantId/alerts', async (req, res) => {
    const { merchantId } = req.params;
    const { category, threshold, webhookUrl, enabled = true } = req.body;
    if (!threshold || threshold < 1 || threshold > 100) {
        res.status(400).json({ error: 'Threshold must be between 1 and 100' });
        return;
    }
    try {
        const alertConfig = {
            merchantId,
            category: category || 'all',
            threshold,
            webhookUrl,
            enabled,
            createdAt: new Date().toISOString(),
        };
        await sharedMemory.set(`merchant:alert:${merchantId}:${category || 'all'}`, alertConfig, 86400 * 30 // 30 days
        );
        res.json({ success: true, config: alertConfig });
    }
    catch (error) {
        console.error('[MerchantAPI] Alert config failed:', error);
        res.status(500).json({ error: 'Failed to configure alert' });
    }
});
// ── Helpers ─────────────────────────────────────────────────────────────────────
function getDemandHealth(demandCount, unmetPct) {
    if (demandCount > 50 && unmetPct < 30)
        return 'excellent';
    if (demandCount > 20 && unmetPct < 50)
        return 'good';
    if (demandCount > 5)
        return 'moderate';
    return 'low';
}
async function getSeasonalityForecast(category) {
    const currentMonth = new Date().getMonth();
    // Simple seasonality model based on category
    const multipliers = {
        TRAVEL: [0.5, 0.6, 0.7, 0.8, 0.9, 1.2, 1.4, 1.3, 0.9, 0.7, 0.8, 1.0],
        DINING: [0.9, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2, 1.0, 1.0, 1.1, 1.3],
        RETAIL: [0.7, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 1.0, 1.1, 1.3, 1.5, 1.8],
    };
    const base = await prisma.intent.count({
        where: { category },
    });
    const forecast = multipliers[category] || multipliers.DINING;
    return forecast.map((mult, index) => ({
        month: index + 1,
        expectedDemand: `${(base * mult).toFixed(0)} (${mult > 1 ? '+' : ''}${((mult - 1) * 100).toFixed(0)}%)`,
        isCurrentMonth: index === currentMonth,
    }));
}
export default router;
//# sourceMappingURL=merchant.routes.js.map