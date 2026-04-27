// ── Intent Graph API Routes ──────────────────────────────────────────────────────
// Express routes for RTMN Commerce Memory Intent Graph

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { intentCaptureService } from '../services/IntentCaptureService.js';
import { intentScoringService } from '../services/IntentScoringService.js';
import { dormantIntentService } from '../services/DormantIntentService.js';
import { crossAppAggregationService } from '../services/CrossAppAggregationService.js';
import { nudgeQueue } from '../services/nudge-queue.js';
import { nudgeDeliveryService } from '../nudge/NudgeDeliveryService.js';
import { CaptureIntentSchema, DormancyCheckSchema, RevivalTriggerSchema } from '../types/intent.js';

const prisma = new PrismaClient();
const router = Router();

// ── Capture Intent ────────────────────────────────────────────────────────────

/**
 * POST /api/intent/capture
 * Capture a new intent event
 */
router.post('/capture', async (req: Request, res: Response) => {
  try {
    const parseResult = CaptureIntentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: parseResult.error.flatten() });
    }

    const result = await intentCaptureService.capture(parseResult.data);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[IntentAPI] Capture failed:', error);
    res.status(500).json({ error: 'Failed to capture intent' });
  }
});

// ── Get Active Intents ────────────────────────────────────────────────────────

/**
 * GET /api/intent/active/:userId
 * Get active intents for a user
 */
router.get('/active/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const intents = await intentCaptureService.getActiveIntents(userId);
    res.json(intents);
  } catch (error) {
    console.error('[IntentAPI] Get active intents failed:', error);
    res.status(500).json({ error: 'Failed to get active intents' });
  }
});

// ── Get All User Intents ──────────────────────────────────────────────────────

/**
 * GET /api/intent/user/:userId
 * Get all intents for a user
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const intents = await intentCaptureService.getUserIntents(userId);
    res.json(intents);
  } catch (error) {
    console.error('[IntentAPI] Get user intents failed:', error);
    res.status(500).json({ error: 'Failed to get user intents' });
  }
});

// ── Get Dormant Intents ──────────────────────────────────────────────────────

/**
 * GET /api/intent/dormant/:userId
 * Get dormant intents for a user
 */
router.get('/dormant/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const dormantIntents = await dormantIntentService.getUserDormantIntents(userId);
    res.json(dormantIntents);
  } catch (error) {
    console.error('[IntentAPI] Get dormant intents failed:', error);
    res.status(500).json({ error: 'Failed to get dormant intents' });
  }
});

// ── Get Cross-App Profile ─────────────────────────────────────────────────────

/**
 * GET /api/intent/profile/:userId
 * Get cross-app intent profile for a user
 */
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profile = await crossAppAggregationService.getProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error('[IntentAPI] Get profile failed:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// ── Get Enriched Context ──────────────────────────────────────────────────────

/**
 * GET /api/intent/enriched/:userId
 * Get comprehensive enriched context for an agent
 */
router.get('/enriched/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const context = await crossAppAggregationService.getEnrichedContext(userId);
    res.json(context);
  } catch (error) {
    console.error('[IntentAPI] Get enriched context failed:', error);
    res.status(500).json({ error: 'Failed to get enriched context' });
  }
});

// ── Trigger Revival ───────────────────────────────────────────────────────────

/**
 * POST /api/intent/revival
 * Trigger revival for a dormant intent
 */
router.post('/revival', async (req: Request, res: Response) => {
  try {
    const parseResult = RevivalTriggerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: parseResult.error.flatten() });
    }

    const { dormantIntentId, triggerType, triggerData } = parseResult.data;
    const candidate = await dormantIntentService.triggerRevival(dormantIntentId, triggerType);

    if (!candidate) {
      return res.status(404).json({ error: 'Dormant intent not found or not eligible for revival' });
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    console.error('[IntentAPI] Trigger revival failed:', error);
    res.status(500).json({ error: 'Failed to trigger revival' });
  }
});

// ── Mark Revived ─────────────────────────────────────────────────────────────

/**
 * POST /api/intent/revived/:dormantIntentId
 * Mark a dormant intent as revived (user converted)
 */
router.post('/revived/:dormantIntentId', async (req: Request, res: Response) => {
  try {
    const { dormantIntentId } = req.params;
    await dormantIntentService.markRevived(dormantIntentId);
    res.json({ success: true });
  } catch (error) {
    console.error('[IntentAPI] Mark revived failed:', error);
    res.status(500).json({ error: 'Failed to mark as revived' });
  }
});

// ── Get Revival Candidates ────────────────────────────────────────────────────

/**
 * GET /api/intent/revival-candidates
 * Get all dormant intents eligible for revival
 */
router.get('/revival-candidates', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const minScore = parseFloat(req.query.minScore as string) || 0.3;
    const candidates = await intentScoringService.getRevivalCandidates(limit, minScore);
    res.json(candidates);
  } catch (error) {
    console.error('[IntentAPI] Get revival candidates failed:', error);
    res.status(500).json({ error: 'Failed to get revival candidates' });
  }
});

// ── Get Scheduled Revivals ───────────────────────────────────────────────────

/**
 * GET /api/intent/scheduled-revivals
 * Get dormant intents due for nudge
 */
router.get('/scheduled-revivals', async (req: Request, res: Response) => {
  try {
    const candidates = await dormantIntentService.getScheduledRevivals();
    res.json(candidates);
  } catch (error) {
    console.error('[IntentAPI] Get scheduled revivals failed:', error);
    res.status(500).json({ error: 'Failed to get scheduled revivals' });
  }
});

// ── Pause Nudges ─────────────────────────────────────────────────────────────

/**
 * POST /api/intent/pause/:dormantIntentId
 * Pause nudges for a dormant intent
 */
router.post('/pause/:dormantIntentId', async (req: Request, res: Response) => {
  try {
    const { dormantIntentId } = req.params;
    await dormantIntentService.pauseNudges(dormantIntentId);
    res.json({ success: true });
  } catch (error) {
    console.error('[IntentAPI] Pause nudges failed:', error);
    res.status(500).json({ error: 'Failed to pause nudges' });
  }
});

// ── Merchant Demand Aggregation ────────────────────────────────────────────────

/**
 * GET /api/intent/merchant-demand/:merchantId
 * Get demand signals for a merchant
 */
router.get('/merchant-demand/:merchantId', async (req: Request, res: Response) => {
  try {
    const { merchantId } = req.params;
    const category = req.query.category as string || 'DINING';
    const demand = await crossAppAggregationService.aggregateMerchantDemand(merchantId, category);
    res.json(demand);
  } catch (error) {
    console.error('[IntentAPI] Get merchant demand failed:', error);
    res.status(500).json({ error: 'Failed to get merchant demand' });
  }
});

// ── User Affinities ───────────────────────────────────────────────────────────

/**
 * GET /api/intent/affinities/:userId
 * Get user affinity scores across categories
 */
router.get('/affinities/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const affinities = await crossAppAggregationService.getUserAffinities(userId);
    res.json(affinities);
  } catch (error) {
    console.error('[IntentAPI] Get affinities failed:', error);
    res.status(500).json({ error: 'Failed to get affinities' });
  }
});

// ── Cron: Detect Dormant Intents ──────────────────────────────────────────────

/**
 * POST /api/intent/cron/detect-dormant
 * Detect and mark intents as dormant (called by scheduler)
 */
router.post('/cron/detect-dormant', async (req: Request, res: Response) => {
  try {
    // Verify cron secret
    const cronSecret = process.env.INTENT_CRON_SECRET;
    if (cronSecret && req.headers['x-cron-secret'] !== cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await dormantIntentService.detectAndMarkDormant();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[IntentAPI] Detect dormant failed:', error);
    res.status(500).json({ error: 'Failed to detect dormant intents' });
  }
});

// ── Cron: Update Revival Scores ─────────────────────────────────────────────

/**
 * POST /api/intent/cron/update-scores
 * Update revival scores for all dormant intents (called by scheduler)
 */
router.post('/cron/update-scores', async (req: Request, res: Response) => {
  try {
    // Verify cron secret
    const cronSecret = process.env.INTENT_CRON_SECRET;
    if (cronSecret && req.headers['x-cron-secret'] !== cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updated = await dormantIntentService.updateRevivalScores();
    res.json({ success: true, data: { updated } });
  } catch (error) {
    console.error('[IntentAPI] Update scores failed:', error);
    res.status(500).json({ error: 'Failed to update revival scores' });
  }
});

// ── Nudge Queue Management ──────────────────────────────────────────────────

/**
 * GET /api/intent/nudge/stats
 * Get nudge queue statistics
 */
router.get('/nudge/stats', async (req: Request, res: Response) => {
  try {
    const [queueStats, deliveryStats] = await Promise.all([
      nudgeQueue.getStats(),
      nudgeDeliveryService.getNudgeStats(),
    ]);
    res.json({
      queue: queueStats,
      delivery: deliveryStats,
    });
  } catch (error) {
    console.error('[IntentAPI] Get nudge stats failed:', error);
    res.status(500).json({ error: 'Failed to get nudge stats' });
  }
});

/**
 * POST /api/intent/nudge/process
 * Process scheduled nudges (called by cron)
 */
router.post('/nudge/process', async (req: Request, res: Response) => {
  try {
    const result = await nudgeDeliveryService.processScheduledNudges();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[IntentAPI] Process nudges failed:', error);
    res.status(500).json({ error: 'Failed to process nudges' });
  }
});

/**
 * POST /api/intent/nudge/send
 * Manually send a nudge
 */
router.post('/nudge/send', async (req: Request, res: Response) => {
  try {
    const { userId, intentKey, message, channel = 'push' } = req.body;

    if (!userId || !intentKey) {
      return res.status(400).json({ error: 'userId and intentKey are required' });
    }

    const nudge = await nudgeDeliveryService.send({
      userId,
      intentKey,
      message: message || `We noticed you were interested in ${intentKey}`,
      channel: channel as 'push' | 'email' | 'sms' | 'in_app',
    });

    res.json({ success: true, data: nudge });
  } catch (error) {
    console.error('[IntentAPI] Send nudge failed:', error);
    res.status(500).json({ error: 'Failed to send nudge' });
  }
});

/**
 * PATCH /api/intent/nudge/:nudgeId/status
 * Update nudge status (for webhook callbacks)
 */
router.patch('/nudge/:nudgeId/status', async (req: Request, res: Response) => {
  try {
    const { nudgeId } = req.params;
    const { status, error } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    await nudgeDeliveryService.updateNudgeStatus(nudgeId, status, error);
    res.json({ success: true });
  } catch (error) {
    console.error('[IntentAPI] Update nudge status failed:', error);
    res.status(500).json({ error: 'Failed to update nudge status' });
  }
});

/**
 * GET /api/intent/nudge/history/:userId
 * Get nudge history for a user
 */
router.get('/nudge/history/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const nudges = await prisma.nudge.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(nudges);
  } catch (error) {
    console.error('[IntentAPI] Get nudge history failed:', error);
    res.status(500).json({ error: 'Failed to get nudge history' });
  }
});

export default router;
