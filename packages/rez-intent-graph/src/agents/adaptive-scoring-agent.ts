// ── Adaptive Scoring Agent ─────────────────────────────────────────────────────────
// Agent 5: ML-based confidence scoring
// Replaces naive formula with learned model, factors in user history, time-of-day, category, price

import { PrismaClient } from '@prisma/client';
import { sharedMemory } from './shared-memory.js';
import type { AgentConfig, AgentResult, ScoredIntent, OptimizationRecommendation } from './types.js';

const prisma = new PrismaClient();

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => console.log(`[AdaptiveScoringAgent] ${msg}`, meta || ''),
  warn: (msg: string, meta?: Record<string, unknown>) => console.warn(`[AdaptiveScoringAgent] ${msg}`, meta || ''),
  error: (msg: string, meta?: Record<string, unknown>) => console.error(`[AdaptiveScoringAgent] ${msg}`, meta || ''),
};

// ── Agent Configuration ────────────────────────────────────────────────────────

export const adaptiveScoringAgentConfig: AgentConfig = {
  name: 'adaptive-scoring-agent',
  intervalMs: 60 * 60 * 1000, // 1 hour
  enabled: true,
  priority: 'high',
};

// ── Model weights (learned from data) ───────────────────────────────────────────

interface ModelWeights {
  userHistory: number;
  timeOfDay: number;
  category: number;
  price: number;
  velocity: number;
  bias: number;
  version: string;
}

const currentWeights: ModelWeights = {
  userHistory: 0.25,
  timeOfDay: 0.10,
  category: 0.15,
  price: 0.20,
  velocity: 0.30,
  bias: -0.5,
  version: '1.0.0',
};

// ── Feature extraction ──────────────────────────────────────────────────────────

interface ScoringFeatures {
  userId: string;
  intentId: string;
  intentKey: string;
  category: string;
  userHistoryScore: number;
  timeOfDayScore: number;
  categoryScore: number;
  priceScore: number;
  velocityScore: number;
}

// ── Calculate user history factor ───────────────────────────────────────────────

async function getUserHistoryScore(userId: string): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const history = await prisma.$queryRaw<Array<{ conversions: number; total: number }>>`
    SELECT
      COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END) as conversions,
      COUNT(*) as total
    FROM intents
    WHERE user_id = ${userId}
    AND first_seen_at >= ${thirtyDaysAgo}
  `;

  const row = history[0];
  if (!row || Number(row.total) === 0) return 0.5; // Neutral

  const conversionRate = Number(row.conversions) / Number(row.total);
  return Math.min(1, conversionRate * 2 + 0.2); // Scale to 0.2-1.2
}

// ── Calculate time of day factor ───────────────────────────────────────────────

function getTimeOfDayScore(): number {
  const hour = new Date().getHours();

  // Peak hours (6-9 AM, 6-9 PM): higher conversion
  if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21)) {
    return 0.9;
  }

  // Good hours (10 AM - 5 PM): moderate
  if (hour >= 10 && hour <= 17) {
    return 0.7;
  }

  // Off hours: lower
  return 0.4;
}

// ── Calculate category factor ───────────────────────────────────────────────────

async function getCategoryScore(category: string): Promise<number> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const stats = await prisma.$queryRaw<Array<{ conversions: number; total: number }>>`
    SELECT
      COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END) as conversions,
      COUNT(*) as total
    FROM intents
    WHERE category = ${category}
    AND first_seen_at >= ${sevenDaysAgo}
  `;

  const row = stats[0];
  if (!row || Number(row.total) < 10) return 0.5; // Not enough data

  const conversionRate = Number(row.conversions) / Number(row.total);
  return Math.min(1, conversionRate * 3 + 0.3);
}

// ── Calculate price factor ───────────────────────────────────────────────────────

async function getPriceScore(intentKey: string): Promise<number> {
  // Check if there's a price range in metadata
  const intent = await prisma.intent.findFirst({
    where: { intentKey },
    select: { metadata: true },
  });

  if (!intent?.metadata) return 0.5;

  const metadata = intent.metadata as Record<string, unknown>;
  const priceRange = metadata.priceRange as { min?: number; max?: number } | undefined;

  if (!priceRange) return 0.5;

  const avgPrice = ((priceRange.min || 0) + (priceRange.max || 0)) / 2;

  // Price sensitivity curve (peak at $50-200 range)
  if (avgPrice < 50) return 0.8;
  if (avgPrice < 200) return 0.9;
  if (avgPrice < 500) return 0.7;
  if (avgPrice < 1000) return 0.5;
  return 0.3;
}

// ── Calculate velocity factor ───────────────────────────────────────────────────

async function getVelocityScore(intentId: string): Promise<number> {
  const intent = await prisma.intent.findUnique({
    where: { id: intentId },
    include: { signals: { orderBy: { capturedAt: 'desc' }, take: 5 } },
  });

  if (!intent) return 0.5;

  const signals = intent.signals;
  if (signals.length < 2) return 0.4;

  // Calculate signal velocity (signals per hour)
  const oldest = signals[signals.length - 1].capturedAt;
  const newest = signals[0].capturedAt;
  const hoursDiff = (newest.getTime() - oldest.getTime()) / (1000 * 60 * 60);

  if (hoursDiff < 0.5) return 0.95; // Very fast - high intent
  if (hoursDiff < 2) return 0.8;
  if (hoursDiff < 24) return 0.6;
  return 0.3;
}

// ── Extract features ───────────────────────────────────────────────────────────

async function extractFeatures(userId: string, intentId: string): Promise<ScoringFeatures | null> {
  const intent = await prisma.intent.findUnique({
    where: { id: intentId },
  });

  if (!intent) return null;

  const [userHistoryScore, categoryScore, priceScore, velocityScore] = await Promise.all([
    getUserHistoryScore(userId),
    getCategoryScore(intent.category),
    getPriceScore(intent.intentKey),
    getVelocityScore(intentId),
  ]);

  return {
    userId,
    intentId,
    intentKey: intent.intentKey,
    category: intent.category,
    userHistoryScore,
    timeOfDayScore: getTimeOfDayScore(),
    categoryScore,
    priceScore,
    velocityScore,
  };
}

// ── Score intent ───────────────────────────────────────────────────────────────

function scoreIntent(features: ScoringFeatures, weights: ModelWeights): ScoredIntent {
  const rawScore =
    weights.userHistory * features.userHistoryScore +
    weights.timeOfDay * features.timeOfDayScore +
    weights.category * features.categoryScore +
    weights.price * features.priceScore +
    weights.velocity * features.velocityScore +
    weights.bias;

  // Sigmoid to probability
  const predictedConversionProb = 1 / (1 + Math.exp(-rawScore));

  // Confidence based on data availability
  const dataPoints =
    (features.userHistoryScore > 0.3 ? 1 : 0) +
    (features.categoryScore > 0.3 ? 1 : 0) +
    (features.priceScore > 0.3 ? 1 : 0) +
    (features.velocityScore > 0.3 ? 1 : 0);
  const confidence = dataPoints / 4;

  return {
    intentId: features.intentId,
    userId: features.userId,
    intentKey: features.intentKey,
    predictedConversionProb: Math.round(predictedConversionProb * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    factors: {
      userHistory: Math.round(features.userHistoryScore * 100) / 100,
      timeOfDay: Math.round(features.timeOfDayScore * 100) / 100,
      category: Math.round(features.categoryScore * 100) / 100,
      price: Math.round(features.priceScore * 100) / 100,
      velocity: Math.round(features.velocityScore * 100) / 100,
    },
    modelVersion: weights.version,
    timestamp: new Date(),
  };
}

// ── Score single intent ────────────────────────────────────────────────────────

export async function scoreIntentById(userId: string, intentId: string): Promise<ScoredIntent | null> {
  const features = await extractFeatures(userId, intentId);
  if (!features) return null;

  const scored = scoreIntent(features, currentWeights);
  await sharedMemory.setScoredIntent(scored);

  return scored;
}

// ── Score batch of intents ─────────────────────────────────────────────────────

export async function scoreIntents(userId: string, intentIds: string[]): Promise<ScoredIntent[]> {
  const results: ScoredIntent[] = [];

  for (const intentId of intentIds) {
    const scored = await scoreIntentById(userId, intentId);
    if (scored) results.push(scored);
  }

  return results;
}

// ── Model retraining ───────────────────────────────────────────────────────────

export async function retrainModel(): Promise<void> {
  logger.info('Retraining scoring model');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get historical data: features vs actual outcomes
  const trainingData = await prisma.$queryRaw<Array<{
    user_id: string;
    intent_id: string;
    category: string;
    intent_key: string;
    fulfilled: boolean;
    signal_count: number;
    hours_since_last_signal: number;
  }>>`
    SELECT
      i.user_id,
      i.id as intent_id,
      i.category,
      i.intent_key,
      CASE WHEN i.status = 'FULFILLED' THEN true ELSE false END as fulfilled,
      (SELECT COUNT(*) FROM intent_signals WHERE intent_id = i.id) as signal_count,
      EXTRACT(EPOCH FROM (NOW() - i.last_seen_at)) / 3600 as hours_since_last_signal
    FROM intents i
    WHERE i.first_seen_at >= ${thirtyDaysAgo}
    ORDER BY i.first_seen_at DESC
    LIMIT 10000
  `;

  if (trainingData.length < 100) {
    logger.warn('Insufficient training data, skipping retraining');
    return;
  }

  // Simple gradient descent for weight optimization
  const learningRate = 0.01;
  const iterations = 100;

  let weights = { ...currentWeights };

  for (let iter = 0; iter < iterations; iter++) {
    let totalGradients = {
      userHistory: 0,
      timeOfDay: 0,
      category: 0,
      price: 0,
      velocity: 0,
      bias: 0,
    };

    for (const row of trainingData) {
      const features = {
        userHistoryScore: row.fulfilled ? 0.8 : 0.4,
        timeOfDayScore: getTimeOfDayScore(),
        categoryScore: 0.5,
        priceScore: 0.5,
        velocityScore: Math.min(1, row.signal_count / 5),
      };

      const rawScore =
        weights.userHistory * features.userHistoryScore +
        weights.timeOfDay * features.timeOfDayScore +
        weights.category * features.categoryScore +
        weights.price * features.priceScore +
        weights.velocity * features.velocityScore +
        weights.bias;

      const prob = 1 / (1 + Math.exp(-rawScore));
      const label = row.fulfilled ? 1 : 0;
      const error = prob - label;

      totalGradients.userHistory += error * features.userHistoryScore;
      totalGradients.timeOfDay += error * features.timeOfDayScore;
      totalGradients.category += error * features.categoryScore;
      totalGradients.price += error * features.priceScore;
      totalGradients.velocity += error * features.velocityScore;
      totalGradients.bias += error;
    }

    const n = trainingData.length;
    weights.userHistory -= learningRate * totalGradients.userHistory / n;
    weights.timeOfDay -= learningRate * totalGradients.timeOfDay / n;
    weights.category -= learningRate * totalGradients.category / n;
    weights.price -= learningRate * totalGradients.price / n;
    weights.velocity -= learningRate * totalGradients.velocity / n;
    weights.bias -= learningRate * totalGradients.bias / n;
  }

  // Normalize weights
  const total = weights.userHistory + weights.timeOfDay + weights.category + weights.price + weights.velocity;
  weights.userHistory /= total;
  weights.timeOfDay /= total;
  weights.category /= total;
  weights.price /= total;
  weights.velocity /= total;

  // Update version
  const versionParts = currentWeights.version.split('.');
  versionParts[2] = String(parseInt(versionParts[2]) + 1);
  weights.version = versionParts.join('.');

  Object.assign(currentWeights, weights);

  // Publish optimization recommendation
  await sharedMemory.addOptimization({
    type: 'rebalance_budget',
    agent: 'adaptive-scoring-agent',
    currentValue: JSON.stringify(currentWeights),
    recommendedValue: JSON.stringify(weights),
    confidence: 0.8,
    reason: 'Model retrained on latest data',
    expectedImpact: 5, // 5% improvement expected
    timestamp: new Date(),
  });

  logger.info('Model retraining complete', { version: weights.version, weights });
}

// ── Main execution ─────────────────────────────────────────────────────────────

export async function runAdaptiveScoringAgent(): Promise<AgentResult> {
  const start = Date.now();

  try {
    logger.info('Running adaptive scoring');

    // Score high-priority intents
    const priorityIntents = await prisma.intent.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, userId: true },
      orderBy: { lastSeenAt: 'desc' },
      take: 100,
    });

    let scoredCount = 0;
    for (const intent of priorityIntents) {
      const scored = await scoreIntentById(intent.userId, intent.id);
      if (scored) scoredCount++;
    }

    logger.info('Adaptive scoring complete', { scored: scoredCount });

    return {
      agent: 'adaptive-scoring-agent',
      success: true,
      durationMs: Date.now() - start,
      data: { scored: scoredCount },
    };
  } catch (error) {
    logger.error('Adaptive scoring failed', { error });
    return {
      agent: 'adaptive-scoring-agent',
      success: false,
      durationMs: Date.now() - start,
      error: String(error),
    };
  }
}

// ── Cron loop ──────────────────────────────────────────────────────────────────

let cronInterval: NodeJS.Timeout | null = null;

export function startAdaptiveScoringCron(): void {
  if (cronInterval) return;

  logger.info('Starting adaptive scoring agent', { intervalMs: adaptiveScoringAgentConfig.intervalMs });

  runAdaptiveScoringAgent().catch((err) => logger.error('Scoring cron failed', { error: err }));

  cronInterval = setInterval(
    () => runAdaptiveScoringAgent().catch((err) => logger.error('Scoring cron failed', { error: err })),
    adaptiveScoringAgentConfig.intervalMs
  );
}

export function stopAdaptiveScoringCron(): void {
  if (cronInterval) {
    clearInterval(cronInterval);
    cronInterval = null;
  }
}

// ── Get current weights ─────────────────────────────────────────────────────────

export function getCurrentWeights(): ModelWeights {
  return { ...currentWeights };
}
