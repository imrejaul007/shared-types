// ── Network Effect Agent ─────────────────────────────────────────────────────────
// Agent 7: Collaborative filtering and user similarity clusters
// Updates user clusters daily, generates trending signals, personalizes based on cohort

import { PrismaClient } from '@prisma/client';
import { sharedMemory } from './shared-memory.js';
import type { AgentConfig, AgentResult, CollaborativeSignal } from './types.js';

const prisma = new PrismaClient();

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => console.log(`[NetworkEffectAgent] ${msg}`, meta || ''),
  warn: (msg: string, meta?: Record<string, unknown>) => console.warn(`[NetworkEffectAgent] ${msg}`, meta || ''),
  error: (msg: string, meta?: Record<string, unknown>) => console.error(`[NetworkEffectAgent] ${msg}`, meta || ''),
};

// ── Agent Configuration ────────────────────────────────────────────────────────

export const networkEffectAgentConfig: AgentConfig = {
  name: 'network-effect-agent',
  intervalMs: 24 * 60 * 60 * 1000, // 24 hours
  enabled: true,
  priority: 'medium',
};

// ── User cluster ───────────────────────────────────────────────────────────────

interface UserCluster {
  id: string;
  userIds: string[];
  categoryAffinity: Record<string, number>;
  avgSessionValue: number;
  conversionRate: number;
  lastUpdated: Date;
}

interface UserFeatures {
  userId: string;
  travelAffinity: number;
  diningAffinity: number;
  retailAffinity: number;
  avgOrderValue: number;
  conversionRate: number;
  preferredTimeOfDay: number;
}

// ── Build user features ────────────────────────────────────────────────────────

async function buildUserFeatures(userId: string): Promise<UserFeatures | null> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const features = await prisma.$queryRaw<Array<{
    travel_count: number;
    dining_count: number;
    retail_count: number;
    total_value: number;
    order_count: number;
    fulfilled_count: number;
  }>>`
    SELECT
      COUNT(CASE WHEN category = 'TRAVEL' THEN 1 END) as travel_count,
      COUNT(CASE WHEN category = 'DINING' THEN 1 END) as dining_count,
      COUNT(CASE WHEN category = 'RETAIL' THEN 1 END) as retail_count,
      COALESCE(SUM(order_value), 0) as total_value,
      COUNT(*) as order_count,
      COUNT(CASE WHEN status = 'FULFILLED' THEN 1 END) as fulfilled_count
    FROM intents
    WHERE user_id = ${userId}
    AND first_seen_at >= ${thirtyDaysAgo}
  `;

  const row = features[0];
  if (!row) return null;

  const total = Number(row.travel_count) + Number(row.dining_count) + Number(row.retail_count);
  if (total === 0) {
    return {
      userId,
      travelAffinity: 33,
      diningAffinity: 33,
      retailAffinity: 33,
      avgOrderValue: 0,
      conversionRate: 0,
      preferredTimeOfDay: 12,
    };
  }

  return {
    userId,
    travelAffinity: Math.round((Number(row.travel_count) / total) * 100),
    diningAffinity: Math.round((Number(row.dining_count) / total) * 100),
    retailAffinity: Math.round((Number(row.retail_count) / total) * 100),
    avgOrderValue: Number(row.order_count) > 0 ? Number(row.total_value) / Number(row.order_count) : 0,
    conversionRate: Number(row.order_count) > 0 ? Number(row.fulfilled_count) / Number(row.order_count) : 0,
    preferredTimeOfDay: 12, // Would compute from actual data
  };
}

// ── Calculate similarity ────────────────────────────────────────────────────────

function cosineSimilarity(a: UserFeatures, b: UserFeatures): number {
  const dotProduct =
    a.travelAffinity * b.travelAffinity +
    a.diningAffinity * b.diningAffinity +
    a.retailAffinity * b.retailAffinity +
    a.avgOrderValue * b.avgOrderValue * 0.001 + // Scale down monetary
    a.conversionRate * b.conversionRate * 100; // Scale up conversion

  const magnitudeA = Math.sqrt(
    Math.pow(a.travelAffinity, 2) +
    Math.pow(a.diningAffinity, 2) +
    Math.pow(a.retailAffinity, 2) +
    Math.pow(a.avgOrderValue * 0.001, 2) +
    Math.pow(a.conversionRate * 100, 2)
  );

  const magnitudeB = Math.sqrt(
    Math.pow(b.travelAffinity, 2) +
    Math.pow(b.diningAffinity, 2) +
    Math.pow(b.retailAffinity, 2) +
    Math.pow(b.avgOrderValue * 0.001, 2) +
    Math.pow(b.conversionRate * 100, 2)
  );

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// ── Cluster users ────────────────────────────────────────────────────────────────

async function clusterUsers(): Promise<UserCluster[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get active users
  const users = await prisma.$queryRaw<Array<{ user_id: string }>>`
    SELECT DISTINCT user_id
    FROM intents
    WHERE first_seen_at >= ${sevenDaysAgo}
    LIMIT 1000
  `;

  if (users.length < 10) {
    logger.warn('Insufficient users for clustering');
    return [];
  }

  // Build features for all users
  const userFeatures = new Map<string, UserFeatures>();
  for (const row of users) {
    const features = await buildUserFeatures(row.user_id);
    if (features) {
      userFeatures.set(row.user_id, features);
    }
  }

  // Simple clustering by category affinity
  const clusters = new Map<string, UserCluster>();

  for (const [userId, features] of userFeatures.entries()) {
    // Determine dominant category
    const { travelAffinity, diningAffinity, retailAffinity } = features;
    let dominantCategory: string;

    if (travelAffinity >= diningAffinity && travelAffinity >= retailAffinity) {
      dominantCategory = 'TRAVEL';
    } else if (diningAffinity >= travelAffinity && diningAffinity >= retailAffinity) {
      dominantCategory = 'DINING';
    } else {
      dominantCategory = 'RETAIL';
    }

    const clusterId = `${dominantCategory}_high_value`;
    if (!clusters.has(clusterId)) {
      clusters.set(clusterId, {
        id: clusterId,
        userIds: [],
        categoryAffinity: { TRAVEL: 0, DINING: 0, RETAIL: 0 },
        avgSessionValue: 0,
        conversionRate: 0,
        lastUpdated: new Date(),
      });
    }

    const cluster = clusters.get(clusterId)!;
    cluster.userIds.push(userId);
  }

  // Calculate cluster stats
  for (const cluster of clusters.values()) {
    let totalValue = 0;
    let totalConversions = 0;
    let totalUsers = cluster.userIds.length;

    for (const userId of cluster.userIds) {
      const features = userFeatures.get(userId);
      if (features) {
        totalValue += features.avgOrderValue;
        totalConversions += features.conversionRate;

        cluster.categoryAffinity.TRAVEL += features.travelAffinity;
        cluster.categoryAffinity.DINING += features.diningAffinity;
        cluster.categoryAffinity.RETAIL += features.retailAffinity;
      }
    }

    cluster.avgSessionValue = totalUsers > 0 ? totalValue / totalUsers : 0;
    cluster.conversionRate = totalUsers > 0 ? totalConversions / totalUsers : 0;

    // Average affinities
    cluster.categoryAffinity.TRAVEL /= totalUsers;
    cluster.categoryAffinity.DINING /= totalUsers;
    cluster.categoryAffinity.RETAIL /= totalUsers;
  }

  // Store clusters
  for (const cluster of clusters.values()) {
    await sharedMemory.set(`cluster:${cluster.id}`, cluster, 86400);
  }

  logger.info('User clustering complete', { clusters: clusters.size });
  return Array.from(clusters.values());
}

// ── Find similar users ─────────────────────────────────────────────────────────

export async function findSimilarUsers(
  userId: string,
  limit = 10
): Promise<Array<{ userId: string; similarity: number }>> {
  const targetFeatures = await buildUserFeatures(userId);
  if (!targetFeatures) return [];

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get other active users
  const users = await prisma.$queryRaw<Array<{ user_id: string }>>`
    SELECT DISTINCT user_id
    FROM intents
    WHERE first_seen_at >= ${sevenDaysAgo}
    AND user_id != ${userId}
    LIMIT 500
  `;

  const similarities: Array<{ userId: string; similarity: number }> = [];

  for (const row of users) {
    const features = await buildUserFeatures(row.user_id);
    if (features) {
      const similarity = cosineSimilarity(targetFeatures, features);
      similarities.push({ userId: row.user_id, similarity });
    }
  }

  // Sort and return top N
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, limit);
}

// ── Collaborative filtering recommendations ─────────────────────────────────────

export async function getCollaborativeRecommendations(
  userId: string,
  category: string,
  limit = 5
): Promise<string[]> {
  // Find users who converted in this category
  const similarUsers = await findSimilarUsers(userId, 20);
  const userIds = similarUsers.map((u) => u.userId);

  if (userIds.length === 0) return [];

  // Find what similar users wanted/converted
  const userIdList = userIds.join(',');
  const recommendations = await prisma.$queryRaw<Array<{ intent_key: string; count: bigint }>>`
    SELECT intent_key, COUNT(*) as count
    FROM intents
    WHERE user_id = ANY(STRING_TO_ARRAY(${userIdList}, ','))
    AND category = ${category}
    AND status = 'FULFILLED'
    AND user_id != ${userId}
    GROUP BY intent_key
    ORDER BY count DESC
    LIMIT ${limit}
  `;

  return recommendations.map((r) => r.intent_key);
}

// ── Generate collaborative signal ───────────────────────────────────────────────

export async function generateCollaborativeSignal(userId: string): Promise<CollaborativeSignal | null> {
  const similarUsers = await findSimilarUsers(userId, 10);
  const trending = await sharedMemory.getTrendingIntents('GENERAL', 5);

  const recommendations = await getCollaborativeRecommendations(userId, 'GENERAL', 3);

  const signal: CollaborativeSignal = {
    userId,
    similarUsers,
    trendingIntents: trending.map((t) => t.intentKey),
    cohortRecommendations: recommendations,
    collaborativeFilterScore: similarUsers.length > 0
      ? similarUsers.reduce((a, b) => a + b.similarity, 0) / similarUsers.length
      : 0,
    timestamp: new Date(),
  };

  await sharedMemory.setCollaborativeSignal(signal);
  return signal;
}

// ── Main execution ─────────────────────────────────────────────────────────────

export async function runNetworkEffectAgent(): Promise<AgentResult> {
  const start = Date.now();

  try {
    logger.info('Running network effect analysis');

    // Update user clusters
    const clusters = await clusterUsers();

    // Generate signals for top active users
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const activeUsers = await prisma.$queryRaw<Array<{ user_id: string }>>`
      SELECT DISTINCT user_id
      FROM intents
      WHERE last_seen_at >= ${sevenDaysAgo}
      ORDER BY last_seen_at DESC
      LIMIT 100
    `;

    let signalsGenerated = 0;
    for (const row of activeUsers) {
      await generateCollaborativeSignal(row.user_id);
      signalsGenerated++;
    }

    logger.info('Network effect analysis complete', {
      clusters,
      signals: signalsGenerated,
    });

    return {
      agent: 'network-effect-agent',
      success: true,
      durationMs: Date.now() - start,
      data: { clusters: clusters.length, signals: signalsGenerated },
    };
  } catch (error) {
    logger.error('Network effect analysis failed', { error });
    return {
      agent: 'network-effect-agent',
      success: false,
      durationMs: Date.now() - start,
      error: String(error),
    };
  }
}

// ── Get collaborative signal for user ─────────────────────────────────────────

export async function getCollaborativeSignalForUser(
  userId: string
): Promise<CollaborativeSignal | null> {
  const cached = await sharedMemory.getCollaborativeSignal(userId);
  if (cached) return cached;

  return generateCollaborativeSignal(userId);
}

// ── Cron loop ──────────────────────────────────────────────────────────────────

let cronInterval: NodeJS.Timeout | null = null;

export function startNetworkEffectCron(): void {
  if (cronInterval) return;

  logger.info('Starting network effect agent', { intervalMs: networkEffectAgentConfig.intervalMs });

  runNetworkEffectAgent().catch((err) => logger.error('Network effect cron failed', { error: err }));

  cronInterval = setInterval(
    () => runNetworkEffectAgent().catch((err) => logger.error('Network effect cron failed', { error: err })),
    networkEffectAgentConfig.intervalMs
  );
}

export function stopNetworkEffectCron(): void {
  if (cronInterval) {
    clearInterval(cronInterval);
    cronInterval = null;
  }
}
