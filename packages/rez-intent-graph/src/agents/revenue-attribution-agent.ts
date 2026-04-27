// ── Revenue Attribution Agent ─────────────────────────────────────────────────────────
// Agent 8: P&L impact measurement
// Calculates nudge-influenced GMV, measures conversion lift, tracks ROI per campaign/merchant
// DANGEROUS: Auto-pauses underperforming campaigns and reallocates budgets

import { PrismaClient } from '@prisma/client';
import { sharedMemory } from './shared-memory.js';
import { actionExecutor, handleRevenueDropAction } from './action-trigger.js';
import type { AgentConfig, AgentResult, RevenueReport, AttributionRecord } from './types.js';

const prisma = new PrismaClient();

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => console.log(`[RevenueAgent] ${msg}`, meta || ''),
  warn: (msg: string, meta?: Record<string, unknown>) => console.warn(`[RevenueAgent] ${msg}`, meta || ''),
  error: (msg: string, meta?: Record<string, unknown>) => console.error(`[RevenueAgent] ${msg}`, meta || ''),
};

// ── Agent Configuration ────────────────────────────────────────────────────────

export const revenueAttributionAgentConfig: AgentConfig = {
  name: 'revenue-attribution-agent',
  intervalMs: 15 * 60 * 1000, // 15 minutes
  enabled: true,
  priority: 'critical',
};

// ── Calculate daily revenue metrics ─────────────────────────────────────────────

async function calculateDailyRevenue(startDate: Date, endDate: Date): Promise<{
  nudgeGMV: number;
  organicGMV: number;
  totalGMV: number;
  nudgeCount: number;
  conversionCount: number;
}> {
  // Get nudge-attributed revenue
  const nudgeRevenue = await prisma.$queryRaw<Array<{ total: number }>>`
    SELECT COALESCE(SUM(attributed_revenue), 0) as total
    FROM attribution_records
    WHERE created_at >= ${startDate}
    AND created_at < ${endDate}
  `;

  // Get total GMV
  const totalRevenue = await prisma.$queryRaw<Array<{ total: number }>>`
    SELECT COALESCE(SUM(order_value), 0) as total
    FROM orders
    WHERE created_at >= ${startDate}
    AND created_at < ${endDate}
  `;

  // Get nudge and conversion counts
  const nudgeStats = await prisma.$queryRaw<Array<{ nudges: number; conversions: number }>>`
    SELECT
      COUNT(DISTINCT nudge_id) as nudges,
      COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END) as conversions
    FROM nudge_events
    WHERE sent_at >= ${startDate}
    AND sent_at < ${endDate}
  `;

  const nudgeGMV = Number(nudgeRevenue[0]?.total || 0);
  const totalGMV = Number(totalRevenue[0]?.total || 0);
  const organicGMV = totalGMV - nudgeGMV;
  const stats = nudgeStats[0] || { nudges: 0, conversions: 0 };

  return {
    nudgeGMV,
    organicGMV,
    totalGMV,
    nudgeCount: Number(stats.nudges),
    conversionCount: Number(stats.conversions),
  };
}

// ── Calculate ROI by channel ───────────────────────────────────────────────────

async function calculateROIByChannel(startDate: Date, endDate: Date): Promise<Record<string, number>> {
  const channelData = await prisma.$queryRaw<Array<{
    channel: string;
    revenue: number;
    cost: number;
  }>>`
    SELECT
      channel,
      COALESCE(SUM(attributed_revenue), 0) as revenue,
      COALESCE(SUM(cost), 0) as cost
    FROM channel_metrics
    WHERE date >= ${startDate}
    AND date < ${endDate}
    GROUP BY channel
  `;

  const roiByChannel: Record<string, number> = {};

  for (const row of channelData) {
    const cost = Number(row.cost) || 0;
    const revenue = Number(row.revenue) || 0;
    roiByChannel[row.channel] = cost > 0 ? Math.round((revenue / cost) * 100) / 100 : 0;
  }

  return roiByChannel;
}

// ── Calculate ROI by merchant ────────────────────────────────────────────────────

async function calculateROIByMerchant(startDate: Date, endDate: Date): Promise<Record<string, number>> {
  const merchantData = await prisma.$queryRaw<Array<{
    merchant_id: string;
    revenue: number;
    nudge_cost: number;
  }>>`
    SELECT
      m.id as merchant_id,
      COALESCE(SUM(o.order_value), 0) as revenue,
      COALESCE(SUM(n.estimated_cost), 0) as nudge_cost
    FROM merchants m
    LEFT JOIN orders o ON o.merchant_id = m.id AND o.created_at >= ${startDate} AND o.created_at < ${endDate}
    LEFT JOIN nudge_events n ON n.merchant_id = m.id AND n.sent_at >= ${startDate} AND n.sent_at < ${endDate}
    WHERE m.created_at < ${endDate}
    GROUP BY m.id
    HAVING SUM(o.order_value) > 0 OR SUM(n.estimated_cost) > 0
  `;

  const roiByMerchant: Record<string, number> = {};

  for (const row of merchantData) {
    const cost = Number(row.nudge_cost) || 0;
    const revenue = Number(row.revenue) || 0;
    roiByMerchant[row.merchant_id] = cost > 0 ? Math.round((revenue / cost) * 100) / 100 : 0;
  }

  return roiByMerchant;
}

// ── Calculate conversion lift ───────────────────────────────────────────────────

async function calculateConversionLift(startDate: Date, endDate: Date): Promise<number> {
  // Get conversion rate for nudged users
  const nudgedStats = await prisma.$queryRaw<Array<{ rate: number }>>`
    SELECT
      COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END)::float /
      NULLIF(COUNT(DISTINCT user_id), 0) as rate
    FROM nudge_events
    WHERE sent_at >= ${startDate}
    AND sent_at < ${endDate}
  `;

  // Get conversion rate for control group (users without nudges in period)
  const controlStats = await prisma.$queryRaw<Array<{ rate: number }>>`
    SELECT
      COUNT(CASE WHEN i.status = 'FULFILLED' THEN 1 END)::float /
      NULLIF(COUNT(DISTINCT i.user_id), 0) as rate
    FROM intents i
    WHERE i.first_seen_at >= ${startDate}
    AND i.first_seen_at < ${endDate}
    AND i.user_id NOT IN (
      SELECT DISTINCT user_id FROM nudge_events WHERE sent_at >= ${startDate} AND sent_at < ${endDate}
    )
  `;

  const nudgedRate = Number(nudgedStats[0]?.rate || 0);
  const controlRate = Number(controlStats[0]?.rate || 0);

  if (controlRate === 0) return 0;
  return Math.round(((nudgedRate - controlRate) / controlRate) * 10000) / 100; // percentage with 2 decimals
}

// ── Get top performing nudges ───────────────────────────────────────────────────

async function getTopPerformingNudges(startDate: Date, endDate: Date, limit = 10): Promise<
  Array<{ nudgeId: string; revenue: number; roi: number }>
> {
  const nudgeStats = await prisma.$queryRaw<Array<{
    nudge_id: string;
    revenue: number;
    cost: number;
  }>>`
    SELECT
      nudge_id,
      COALESCE(SUM(attributed_revenue), 0) as revenue,
      COALESCE(cost, 0) as cost
    FROM attribution_records
    WHERE created_at >= ${startDate}
    AND created_at < ${endDate}
    GROUP BY nudge_id, cost
    ORDER BY revenue DESC
    LIMIT ${limit}
  `;

  return nudgeStats.map((row) => ({
    nudgeId: row.nudge_id,
    revenue: Number(row.revenue),
    roi: Number(row.cost) > 0 ? Number(row.revenue) / Number(row.cost) : 0,
  }));
}

// ── Get underperforming nudges ──────────────────────────────────────────────────

async function getUnderperformingNudges(startDate: Date, endDate: Date): Promise<
  Array<{ nudgeId: string; reason: string }>
> {
  // Find nudges with zero conversions
  const zeroConversionNudges = await prisma.$queryRaw<Array<{ nudge_id: string }>>`
    SELECT DISTINCT nudge_id
    FROM nudge_events
    WHERE sent_at >= ${startDate}
    AND sent_at < ${endDate}
    AND nudge_id NOT IN (
      SELECT DISTINCT nudge_id FROM nudge_conversions WHERE converted_at >= ${startDate}
    )
    AND sent_at < NOW() - INTERVAL '24 hours' -- Only consider nudges that had time to convert
    LIMIT 50
  `;

  return zeroConversionNudges.map((row) => ({
    nudgeId: row.nudge_id,
    reason: 'No conversions within 24 hours',
  }));
}

// ── Generate revenue report ─────────────────────────────────────────────────────

export async function generateRevenueReport(
  startDate: Date,
  endDate: Date
): Promise<RevenueReport> {
  logger.info('Generating revenue report', { startDate, endDate });

  const [revenue, roiByChannel, roiByMerchant, conversionLift, topNudges, underperforming] =
    await Promise.all([
      calculateDailyRevenue(startDate, endDate),
      calculateROIByChannel(startDate, endDate),
      calculateROIByMerchant(startDate, endDate),
      calculateConversionLift(startDate, endDate),
      getTopPerformingNudges(startDate, endDate),
      getUnderperformingNudges(startDate, endDate),
    ]);

  const nudgeLiftPct = revenue.totalGMV > 0
    ? Math.round((revenue.nudgeGMV / revenue.totalGMV) * 10000) / 100
    : 0;

  const report: RevenueReport = {
    period: { start: startDate, end: endDate },
    nudgeInfluencedGMV: revenue.nudgeGMV,
    organicGMV: revenue.organicGMV,
    totalGMV: revenue.totalGMV,
    nudgeLiftPct,
    roiByChannel,
    roiByMerchant,
    conversionLift,
    topPerformingNudges: topNudges,
    underperformingNudges: underperforming,
    timestamp: new Date(),
  };

  // Save report
  await sharedMemory.saveRevenueReport(report);

  return report;
}

// ── Handle incoming attribution ───────────────────────────────────────────────────

export async function handleConversionAttribution(record: AttributionRecord): Promise<void> {
  // Update real-time metrics
  await sharedMemory.publish({
    from: 'revenue-attribution-agent',
    to: 'attribution-agent',
    type: 'response',
    payload: { recorded: true, recordId: record.id },
    timestamp: new Date(),
  });
}

// ── Alert on revenue drops ─────────────────────────────────────────────────────

async function checkForRevenueAlerts(report: RevenueReport): Promise<void> {
  const prevReport = await sharedMemory.getLatestRevenueReport();
  if (!prevReport) return;

  const gmvChange = (report.totalGMV - prevReport.totalGMV) / prevReport.totalGMV;

  if (gmvChange < -0.2) {
    logger.warn('Revenue drop detected', {
      current: report.totalGMV,
      previous: prevReport.totalGMV,
      change: gmvChange,
    });

    // DANGEROUS: Trigger autonomous revenue protection
    await handleRevenueDropAction(report, prevReport);

    await sharedMemory.publish({
      from: 'revenue-attribution-agent',
      to: 'feedback-loop-agent',
      type: 'alert',
      payload: { type: 'revenue_drop', change: gmvChange },
      timestamp: new Date(),
    });
  }
}

// ── Autonomous Revenue Actions ─────────────────────────────────────────────────────

async function executeRevenueActions(report: RevenueReport): Promise<void> {
  // Pause underperforming nudges
  for (const nudge of report.underperformingNudges.slice(0, 5)) {
    logger.info('[RevenueAgent] DANGEROUS: Auto-pausing underperforming nudge', {
      nudgeId: nudge.nudgeId,
      reason: nudge.reason,
    });

    await actionExecutor.execute({
      type: 'pause_nudge_campaign',
      target: nudge.nudgeId,
      payload: {
        campaignId: nudge.nudgeId,
        reason: nudge.reason,
      },
      agent: 'revenue-attribution-agent',
      skipPermission: true,
      risk: 'medium',
    });
  }

  // Reallocate budget from low-ROI channels
  for (const [channel, roi] of Object.entries(report.roiByChannel)) {
    if (roi < 1.0) {
      const budgetReduction = 0.2; // 20% reduction

      logger.info('[RevenueAgent] DANGEROUS: Reducing budget for low-ROI channel', {
        channel,
        roi,
        reduction: budgetReduction,
      });

      await actionExecutor.execute({
        type: 'reallocate_budget',
        target: 'marketing',
        payload: {
          channel,
          newBudget: -budgetReduction, // Negative indicates reduction
          reason: `Low ROI ${roi.toFixed(2)} - reducing budget`,
        },
        agent: 'revenue-attribution-agent',
        skipPermission: true,
        risk: 'high',
      });
    }
  }
}

// ── Main execution ─────────────────────────────────────────────────────────────

export async function runRevenueAttributionAgent(): Promise<AgentResult> {
  const start = Date.now();

  try {
    logger.info('Running revenue attribution');

    // Generate report for last 24 hours
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

    const report = await generateRevenueReport(startDate, endDate);

    // Check for alerts
    await checkForRevenueAlerts(report);

    // DANGEROUS: Execute autonomous revenue actions
    await executeRevenueActions(report);

    logger.info('Revenue attribution complete', {
      totalGMV: report.totalGMV,
      nudgeGMV: report.nudgeInfluencedGMV,
      lift: report.nudgeLiftPct,
    });

    return {
      agent: 'revenue-attribution-agent',
      success: true,
      durationMs: Date.now() - start,
      data: {
        totalGMV: report.totalGMV,
        nudgeGMV: report.nudgeInfluencedGMV,
        lift: report.nudgeLiftPct,
      },
    };
  } catch (error) {
    logger.error('Revenue attribution failed', { error });
    return {
      agent: 'revenue-attribution-agent',
      success: false,
      durationMs: Date.now() - start,
      error: String(error),
    };
  }
}

// ── Get latest report ─────────────────────────────────────────────────────────

export async function getLatestReport(): Promise<RevenueReport | null> {
  return sharedMemory.getLatestRevenueReport();
}

// ── Cron loop ──────────────────────────────────────────────────────────────────

let cronInterval: NodeJS.Timeout | null = null;

export function startRevenueAttributionCron(): void {
  if (cronInterval) return;

  logger.info('Starting revenue attribution agent', { intervalMs: revenueAttributionAgentConfig.intervalMs });

  runRevenueAttributionAgent().catch((err) => logger.error('Revenue cron failed', { error: err }));

  cronInterval = setInterval(
    () => runRevenueAttributionAgent().catch((err) => logger.error('Revenue cron failed', { error: err })),
    revenueAttributionAgentConfig.intervalMs
  );
}

export function stopRevenueAttributionCron(): void {
  if (cronInterval) {
    clearInterval(cronInterval);
    cronInterval = null;
  }
}
