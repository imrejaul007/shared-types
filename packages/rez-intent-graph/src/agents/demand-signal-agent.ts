// ── Demand Signal Agent ─────────────────────────────────────────────────────────
// Agent 1: Real-time demand aggregation across all apps
// Runs every 5 minutes via cron
// DANGEROUS: Auto-triggers price adjustments and dashboard updates

import { PrismaClient } from '@prisma/client';
import { sharedMemory } from './shared-memory.js';
import { handleDemandSignalAction } from './action-trigger.js';
import type { AgentConfig, AgentResult, DemandSignal } from './types.js';

const prisma = new PrismaClient();

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => console.log(`[DemandSignalAgent] ${msg}`, meta || ''),
  warn: (msg: string, meta?: Record<string, unknown>) => console.warn(`[DemandSignalAgent] ${msg}`, meta || ''),
  error: (msg: string, meta?: Record<string, unknown>) => console.error(`[DemandSignalAgent] ${msg}`, meta || ''),
};

// ── Agent Configuration ─────────────────────────────────────────────────────────

export const demandSignalAgentConfig: AgentConfig = {
  name: 'demand-signal-agent',
  intervalMs: 5 * 60 * 1000, // 5 minutes
  enabled: true,
  priority: 'high',
};

// ── Baseline for spike detection ────────────────────────────────────────────────

interface DemandBaseline {
  category: string;
  merchantId: string;
  avgDailyDemand: number;
  stdDev: number;
  lastUpdated: Date;
}

const baselines = new Map<string, DemandBaseline>();

// ── Calculate demand for a merchant/category ───────────────────────────────────

async function calculateDemand(merchantId: string, category: string): Promise<number> {
  const since = new Date(Date.now() - 60 * 60 * 1000); // Last hour

  const intentCount = await prisma.intent.count({
    where: {
      merchantId,
      category,
      firstSeenAt: { gte: since },
      status: { in: ['ACTIVE', 'DORMANT'] },
    },
  });

  // Count related signals
  const signalCount = await prisma.intentSignal.count({
    where: {
      intent: { merchantId, category },
      capturedAt: { gte: since },
      eventType: { in: ['search', 'view', 'wishlist', 'cart_add'] },
    },
  });

  // Weighted calculation: intents * 3 + signals
  return intentCount * 3 + signalCount;
}

// ── Calculate unmet demand ──────────────────────────────────────────────────────

async function calculateUnmetDemand(merchantId: string, category: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

  const totalSearches = await prisma.intentSignal.count({
    where: {
      intent: { category },
      eventType: 'search',
      capturedAt: { gte: since },
    },
  });

  const conversions = await prisma.intent.count({
    where: {
      category,
      status: 'FULFILLED',
      lastSeenAt: { gte: since },
    },
  });

  if (totalSearches === 0) return 0;
  return Math.round(((totalSearches - conversions) / totalSearches) * 100);
}

// ── Detect demand spikes ─────────────────────────────────────────────────────────

function detectSpike(current: number, baseline: DemandBaseline): { spike: boolean; factor: number } {
  if (baseline.avgDailyDemand === 0) {
    return { spike: current > 10, factor: current };
  }

  const zScore = (current - baseline.avgDailyDemand) / (baseline.stdDev || 1);
  const spike = zScore > 2; // 2 standard deviations
  const factor = baseline.avgDailyDemand > 0 ? current / baseline.avgDailyDemand : 1;

  return { spike, factor };
}

// ── Update baseline ─────────────────────────────────────────────────────────────

function updateBaseline(merchantId: string, category: string, demand: number): void {
  const key = `${merchantId}:${category}`;
  const existing = baselines.get(key);

  if (existing) {
    // Running average with exponential decay
    const alpha = 0.2;
    existing.avgDailyDemand = alpha * demand + (1 - alpha) * existing.avgDailyDemand;
    existing.stdDev = Math.sqrt(
      alpha * Math.pow(demand - existing.avgDailyDemand, 2) + (1 - alpha) * Math.pow(existing.stdDev, 2)
    );
    existing.lastUpdated = new Date();
  } else {
    baselines.set(key, {
      category,
      merchantId,
      avgDailyDemand: demand,
      stdDev: 0,
      lastUpdated: new Date(),
    });
  }
}

// ── Get top cities for demand ──────────────────────────────────────────────────

async function getTopCities(merchantId: string, category: string): Promise<string[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

  // Use raw query for JSON extraction
  const intents = await prisma.$queryRaw<Array<{ metadata: Record<string, unknown> }>>`
    SELECT metadata
    FROM intents
    WHERE merchant_id = ${merchantId}
    AND category = ${category}
    AND first_seen_at >= ${since}
    AND metadata IS NOT NULL
  `;

  const cityCounts = new Map<string, number>();
  for (const intent of intents) {
    const city = intent.metadata?.city as string | undefined;
    if (city) {
      cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
    }
  }

  return Array.from(cityCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city]) => city);
}

// ── Determine trend ─────────────────────────────────────────────────────────────

function determineTrend(baseline: DemandBaseline, current: number): 'rising' | 'stable' | 'declining' {
  if (baseline.avgDailyDemand === 0) return 'stable';
  const change = (current - baseline.avgDailyDemand) / baseline.avgDailyDemand;
  if (change > 0.2) return 'rising';
  if (change < -0.2) return 'declining';
  return 'stable';
}

// ── Generate procurement signals ────────────────────────────────────────────────

async function generateProcurementSignals(): Promise<DemandSignal[]> {
  const categories = ['TRAVEL', 'DINING', 'RETAIL'];
  const signals: DemandSignal[] = [];

  for (const category of categories) {
    // Get all merchants in category with demand
    const merchants = await prisma.intent.groupBy({
      by: ['merchantId'],
      where: { category, status: { in: ['ACTIVE', 'DORMANT'] } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 50,
    });

    for (const merchant of merchants) {
      const mid = merchant.merchantId;
      if (!mid) continue;
      const signal = await buildSignal(mid, category);
      if (signal) signals.push(signal);
    }
  }

  return signals;
}

// ── Build demand signal ─────────────────────────────────────────────────────────

async function buildSignal(merchantId: string, category: string): Promise<DemandSignal | null> {
  const demand = await calculateDemand(merchantId, category);
  const key = `${merchantId}:${category}`;
  const baseline = baselines.get(key);

  if (!baseline && demand < 5) {
    return null; // Skip low-volume merchants on first run
  }

  const defaultBaseline: DemandBaseline = { category, merchantId, avgDailyDemand: baseline?.avgDailyDemand || 0, stdDev: baseline?.stdDev || 1, lastUpdated: baseline?.lastUpdated || new Date() };
  const { spike, factor } = detectSpike(demand, defaultBaseline);
  const unmetDemand = await calculateUnmetDemand(merchantId, category);
  const topCities = await getTopCities(merchantId, category);

  updateBaseline(merchantId, category, demand);

  return {
    merchantId,
    category,
    demandCount: demand,
    unmetDemandPct: unmetDemand,
    avgPriceExpectation: 0, // Would come from price analytics
    topCities,
    trend: determineTrend(defaultBaseline, demand),
    spikeDetected: spike,
    spikeFactor: spike ? factor : undefined,
    timestamp: new Date(),
  };
}

// ── Main execution ─────────────────────────────────────────────────────────────

export async function runDemandSignalAgent(): Promise<AgentResult> {
  const start = Date.now();

  try {
    logger.info('Running demand signal aggregation');

    const signals = await generateProcurementSignals();

    let spikeCount = 0;
    for (const signal of signals) {
      await sharedMemory.setDemandSignal(signal);

      if (signal.spikeDetected) {
        spikeCount++;
        logger.info('Demand spike detected', {
          merchantId: signal.merchantId,
          category: signal.category,
          factor: signal.spikeFactor,
        });

        // Publish alert for spike
        await sharedMemory.publish({
          from: 'demand-signal-agent',
          to: 'scarcity-agent',
          type: 'alert',
          payload: { type: 'demand_spike', signal },
          timestamp: new Date(),
        });

        // DANGEROUS: Auto-trigger actions (skip permission)
        await handleDemandSignalAction(signal);
      }
    }

    logger.info('Demand signal aggregation complete', {
      signals: signals.length,
      spikes: spikeCount,
    });

    return {
      agent: 'demand-signal-agent',
      success: true,
      durationMs: Date.now() - start,
      data: { signalsGenerated: signals.length, spikes: spikeCount },
    };
  } catch (error) {
    logger.error('Demand signal aggregation failed', { error });
    return {
      agent: 'demand-signal-agent',
      success: false,
      durationMs: Date.now() - start,
      error: String(error),
    };
  }
}

// ── On-demand request ──────────────────────────────────────────────────────────

export async function getMerchantDemand(
  merchantId: string,
  category: string
): Promise<DemandSignal | null> {
  const cached = await sharedMemory.getDemandSignal(merchantId, category);
  if (cached) return cached;

  const signal = await buildSignal(merchantId, category);
  if (signal) {
    await sharedMemory.setDemandSignal(signal);
  }
  return signal;
}

// ── Cron loop (called by orchestrator) ────────────────────────────────────────

let cronInterval: NodeJS.Timeout | null = null;

export function startDemandSignalCron(): void {
  if (cronInterval) return;

  logger.info('Starting demand signal cron', { intervalMs: demandSignalAgentConfig.intervalMs });

  // Run immediately
  runDemandSignalAgent().catch((err) => logger.error('Cron run failed', { error: err }));

  // Then every 5 minutes
  cronInterval = setInterval(
    () => runDemandSignalAgent().catch((err) => logger.error('Cron run failed', { error: err })),
    demandSignalAgentConfig.intervalMs
  );
}

export function stopDemandSignalCron(): void {
  if (cronInterval) {
    clearInterval(cronInterval);
    cronInterval = null;
  }
}
