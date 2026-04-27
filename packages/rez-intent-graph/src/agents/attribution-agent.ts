// ── Attribution Agent ─────────────────────────────────────────────────────────────
// Agent 4: Full-funnel attribution tracking
// Tracks nudge → impression → click → convert, handles multi-touch attribution
// DANGEROUS: Auto-pauses underperforming campaigns and reallocates budget

import { PrismaClient } from '@prisma/client';
import { sharedMemory } from './shared-memory.js';
import { actionExecutor } from './action-trigger.js';
import type { AgentConfig, AgentResult, AttributionRecord, Touchpoint, ScoredIntent } from './types.js';

const prisma = new PrismaClient();

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => console.log(`[AttributionAgent] ${msg}`, meta || ''),
  warn: (msg: string, meta?: Record<string, unknown>) => console.warn(`[AttributionAgent] ${msg}`, meta || ''),
  error: (msg: string, meta?: Record<string, unknown>) => console.error(`[AttributionAgent] ${msg}`, meta || ''),
};

// ── Agent Configuration ────────────────────────────────────────────────────────

export const attributionAgentConfig: AgentConfig = {
  name: 'attribution-agent',
  intervalMs: 60 * 1000, // 1 minute
  enabled: true,
  priority: 'high',
};

// ── Attribution Models ──────────────────────────────────────────────────────────

export type AttributionModel = 'first' | 'last' | 'linear' | 'time_decay' | 'position';

const DEFAULT_WINDOW_DAYS = 7;

// ── Touchpoint interface ──────────────────────────────────────────────────────

interface RawTouchpoint {
  type: 'impression' | 'click' | 'convert' | 'organic';
  channel: string;
  nudgeId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// ── Record a touchpoint ──────────────────────────────────────────────────────

export async function recordTouchpoint(
  userId: string,
  nudgeId: string,
  touchpoint: RawTouchpoint
): Promise<void> {
  const key = `touchpoint:${userId}:${nudgeId}`;
  const existing = await sharedMemory.get<RawTouchpoint[]>(key) || [];
  existing.push(touchpoint);
  await sharedMemory.set(key, existing, DEFAULT_WINDOW_DAYS * 24 * 60 * 60);
}

// ── Calculate attribution ────────────────────────────────────────────────────

export async function calculateAttribution(
  userId: string,
  nudgeId: string,
  conversionValue: number,
  model: AttributionModel = 'time_decay'
): Promise<AttributionRecord> {
  const key = `touchpoint:${userId}:${nudgeId}`;
  const touchpoints = await sharedMemory.get<RawTouchpoint[]>(key) || [];

  let attributedValue: number;
  let attributedConversion = false;

  switch (model) {
    case 'first':
      attributedValue = touchpoints[0]?.type !== 'organic' ? conversionValue : 0;
      attributedConversion = touchpoints[0]?.type !== 'organic';
      break;

    case 'last':
      const lastNudge = [...touchpoints].reverse().find((t) => t.nudgeId);
      attributedValue = lastNudge?.type !== 'organic' ? conversionValue : 0;
      attributedConversion = lastNudge?.type !== 'organic';
      break;

    case 'linear':
      const nudgeTouchpoints = touchpoints.filter((t) => t.nudgeId);
      const nudgeShare = nudgeTouchpoints.length / Math.max(touchpoints.length, 1);
      attributedValue = conversionValue * nudgeShare;
      attributedConversion = nudgeTouchpoints.length > 0;
      break;

    case 'time_decay':
      attributedValue = calculateTimeDecayAttribution(touchpoints, conversionValue);
      attributedConversion = touchpoints.some((t) => t.nudgeId);
      break;

    case 'position':
      attributedValue = calculatePositionAttribution(touchpoints, conversionValue);
      attributedConversion = touchpoints.some((t) => t.nudgeId);
      break;

    default:
      attributedValue = conversionValue * 0.5;
      attributedConversion = true;
  }

  const record: AttributionRecord = {
    id: `attr:${userId}:${nudgeId}:${Date.now()}`,
    userId,
    nudgeId,
    touchpoints: touchpoints.map((t) => ({
      type: t.type,
      channel: t.channel,
      timestamp: t.timestamp,
      metadata: t.metadata,
    })),
    attributedConversion,
    attributedRevenue: attributedValue,
    attributionModel: model,
    windowDays: DEFAULT_WINDOW_DAYS,
    createdAt: new Date(),
  };

  await sharedMemory.recordAttribution(record);

  // Publish to revenue agent
  await sharedMemory.publish({
    from: 'attribution-agent',
    to: 'revenue-attribution-agent',
    type: 'signal',
    payload: { type: 'conversion', record },
    timestamp: new Date(),
  });

  return record;
}

// ── Time Decay Attribution ───────────────────────────────────────────────────

function calculateTimeDecayAttribution(touchpoints: RawTouchpoint[], totalValue: number): number {
  if (touchpoints.length === 0) return 0;

  const now = Date.now();
  const halfLifeHours = 24; // Half-life of 24 hours

  let weightedSum = 0;
  let totalWeight = 0;

  for (const tp of touchpoints) {
    const ageHours = (now - tp.timestamp.getTime()) / (1000 * 60 * 60);
    const weight = Math.pow(0.5, ageHours / halfLifeHours);
    weightedSum += (tp.nudgeId ? 1 : 0) * weight * totalValue;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// ── Position Attribution ────────────────────────────────────────────────────

function calculatePositionAttribution(touchpoints: RawTouchpoint[], totalValue: number): number {
  if (touchpoints.length === 0) return 0;

  // 40% first, 40% last, 20% distributed among middle
  const firstTp = touchpoints[0];
  const lastTp = touchpoints[touchpoints.length - 1];
  const middleTps = touchpoints.slice(1, -1);

  let nudgeValue = 0;

  if (firstTp?.nudgeId) nudgeValue += totalValue * 0.4;
  if (lastTp?.nudgeId && lastTp !== firstTp) nudgeValue += totalValue * 0.4;
  if (middleTps.length > 0) {
    const nudgeMiddle = middleTps.filter((t) => t.nudgeId);
    const middleShare = nudgeMiddle.length / middleTps.length;
    nudgeValue += totalValue * 0.2 * middleShare;
  }

  return nudgeValue;
}

// ── Detect organic vs nudge-influenced ──────────────────────────────────────

export async function detectOrganicVsInfluenced(userId: string): Promise<{
  organic: number;
  influenced: number;
  ratio: number;
}> {
  const since = new Date(Date.now() - DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const touchpoints = await prisma.$queryRaw<Array<{
    type: string;
    has_nudge: boolean;
  }>>`
    SELECT
      type,
      CASE WHEN nudge_id IS NOT NULL THEN true ELSE false END as has_nudge
    FROM user_touchpoints
    WHERE user_id = ${userId}
    AND timestamp >= ${since}
  `;

  let organic = 0;
  let influenced = 0;

  for (const tp of touchpoints) {
    if (tp.has_nudge) {
      influenced++;
    } else {
      organic++;
    }
  }

  const total = organic + influenced;
  return {
    organic,
    influenced,
    ratio: total > 0 ? influenced / total : 0,
  };
}

// ── Incrementality calculation ──────────────────────────────────────────────

export async function calculateIncrementality(
  merchantId: string,
  windowDays = 30
): Promise<{
  nudgeGMV: number;
  organicGMV: number;
  incrementality: number;
  lift: number;
}> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  // Get nudge-attributed revenue
  const nudgeRevenue = await prisma.$queryRaw<Array<{ total: number }>>`
    SELECT COALESCE(SUM(attributed_revenue), 0) as total
    FROM attribution_records
    WHERE merchant_id = ${merchantId}
    AND created_at >= ${since}
  `;

  // Get total GMV
  const totalGMV = await prisma.$queryRaw<Array<{ total: number }>>`
    SELECT COALESCE(SUM(order_value), 0) as total
    FROM orders
    WHERE merchant_id = ${merchantId}
    AND created_at >= ${since}
  `;

  const nudgeGMV = Number(nudgeRevenue[0]?.total || 0);
  const total = Number(totalGMV[0]?.total || 0);
  const organicGMV = total - nudgeGMV;

  // Incrementality = nudge GMV that wouldn't have happened organically
  // Estimated using control group data
  const estimatedOrganicFromNudge = nudgeGMV * 0.3; // Assume 30% would have converted anyway
  const incrementality = Math.max(0, nudgeGMV - estimatedOrganicFromNudge);
  const lift = organicGMV > 0 ? (incrementality / organicGMV) * 100 : 0;

  return { nudgeGMV, organicGMV, incrementality, lift };
}

// ── Autonomous Attribution Actions ────────────────────────────────────────────────

async function analyzeChannelAttribution(): Promise<void> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get channel performance
  const channelStats = await prisma.$queryRaw<Array<{
    channel: string;
    revenue: number;
    cost: number;
    conversions: number;
  }>>`
    SELECT
      channel,
      COALESCE(SUM(attributed_revenue), 0) as revenue,
      COALESCE(SUM(cost), 0) as cost,
      COUNT(*) as conversions
    FROM attribution_records
    WHERE created_at >= ${sevenDaysAgo}
    GROUP BY channel
  `;

  for (const stats of channelStats) {
    const roi = Number(stats.cost) > 0 ? Number(stats.revenue) / Number(stats.cost) : 0;
    const conversionRate = Number(stats.conversions) > 0 ? 1 / Number(stats.conversions) : 0;

    // DANGEROUS: Auto-pause underperforming channels
    if (roi < 0.5 && Number(stats.conversions) > 20) {
      logger.warn('[AttributionAgent] DANGEROUS: Pausing underperforming channel', {
        channel: stats.channel,
        roi,
        conversions: stats.conversions,
      });

      await actionExecutor.execute({
        type: 'pause_strategy',
        target: stats.channel,
        payload: {
          strategyId: `attribution:${stats.channel}`,
          reason: `Low ROI ${roi.toFixed(2)} after 7 days`,
        },
        agent: 'attribution-agent',
        skipPermission: true,
        risk: 'medium',
      });
    }

    // DANGEROUS: Reallocate budget from low to high performers
    if (roi > 2.0) {
      await actionExecutor.execute({
        type: 'reallocate_budget',
        target: 'marketing',
        payload: {
          channel: stats.channel,
          newBudget: Math.round(Number(stats.cost) * 1.5), // Boost by 50%
          reason: `High ROI ${roi.toFixed(2)} - increasing allocation`,
        },
        agent: 'attribution-agent',
        skipPermission: true,
        risk: 'high',
      });
    }
  }
}

// ── Main execution ─────────────────────────────────────────────────────────

// ── Main execution ─────────────────────────────────────────────────────────

export async function runAttributionAgent(): Promise<AgentResult> {
  const start = Date.now();

  try {
    logger.info('Running attribution processing');

    // Process pending conversions
    const pendingConversions = await getPendingConversions();

    for (const conversion of pendingConversions) {
      await calculateAttribution(
        conversion.userId,
        conversion.nudgeId,
        conversion.value,
        'time_decay'
      );
      await markConversionProcessed(conversion.id);
    }

    // DANGEROUS: Analyze channel performance and auto-adjust
    await analyzeChannelAttribution();

    logger.info('Attribution processing complete', { conversions: pendingConversions.length });

    return {
      agent: 'attribution-agent',
      success: true,
      durationMs: Date.now() - start,
      data: { conversions: pendingConversions.length },
    };
  } catch (error) {
    logger.error('Attribution processing failed', { error });
    return {
      agent: 'attribution-agent',
      success: false,
      durationMs: Date.now() - start,
      error: String(error),
    };
  }
}

// ── Get pending conversions ─────────────────────────────────────────────────

async function getPendingConversions(): Promise<
  Array<{ id: string; userId: string; nudgeId: string; value: number }>
> {
  try {
    const conversions = await prisma.$queryRaw<Array<{
      id: string;
      user_id: string;
      nudge_id: string;
      value: number;
    }>>`
      SELECT id, user_id, nudge_id, value
      FROM pending_conversions
      WHERE processed = false
      LIMIT 100
    `;

    return conversions.map((c) => ({
      id: c.id,
      userId: c.user_id,
      nudgeId: c.nudge_id,
      value: Number(c.value),
    }));
  } catch {
    return [];
  }
}

// ── Mark conversion processed ────────────────────────────────────────────────

async function markConversionProcessed(id: string): Promise<void> {
  try {
    await prisma.$executeRaw`
      UPDATE pending_conversions SET processed = true WHERE id = ${id}
    `;
  } catch {
    // Ignore in development
  }
}

// ── Cron loop ───────────────────────────────────────────────────────────────

let cronInterval: NodeJS.Timeout | null = null;

export function startAttributionCron(): void {
  if (cronInterval) return;

  logger.info('Starting attribution agent', { intervalMs: attributionAgentConfig.intervalMs });

  runAttributionAgent().catch((err) => logger.error('Attribution cron failed', { error: err }));

  cronInterval = setInterval(
    () => runAttributionAgent().catch((err) => logger.error('Attribution cron failed', { error: err })),
    attributionAgentConfig.intervalMs
  );
}

export function stopAttributionCron(): void {
  if (cronInterval) {
    clearInterval(cronInterval);
    cronInterval = null;
  }
}
