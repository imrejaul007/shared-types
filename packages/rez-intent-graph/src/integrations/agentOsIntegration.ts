// ── Intent Graph Memory Layer ───────────────────────────────────────────────────
// Agent OS Integration - Provides intent memory access for all agents
// Phase 4: Complete Agent OS integration with enriched context

import { PrismaClient } from '@prisma/client';
import { sharedMemory } from '../agents/shared-memory.js';
import { intentScoringService } from '../services/IntentScoringService.js';
import { dormantIntentService } from '../services/DormantIntentService.js';

const prisma = new PrismaClient();

// ── Intent Graph Memory Interface ──────────────────────────────────────────────

export interface IntentGraphMemory {
  getActiveIntents(userId: string): Promise<IntentSummary[]>;
  getDormantIntents(userId: string): Promise<DormantIntentSummary[]>;
  getCrossAppProfile(userId: string): Promise<CrossAppProfile | null>;
  enrichContext(userId: string): Promise<EnrichedContext>;
  recordAgentInsight(userId: string, agentId: string, insight: string): Promise<void>;
}

export interface IntentSummary {
  id: string;
  intentKey: string;
  category: string;
  confidence: number;
  status: string;
  lastSeen: Date;
  signals: number;
}

export interface DormantIntentSummary {
  id: string;
  intentKey: string;
  category: string;
  revivalScore: number;
  daysDormant: number;
  nudgeCount: number;
  idealRevivalAt: Date | null;
}

export interface CrossAppProfile {
  userId: string;
  travelAffinity: number;
  diningAffinity: number;
  retailAffinity: number;
  activeIntents: number;
  dormantIntents: number;
  totalConversions: number;
}

export interface EnrichedContext {
  userId: string;
  activeIntents: IntentSummary[];
  dormantIntents: DormantIntentSummary[];
  suggestedNudges: NudgeSuggestion[];
  affinities: AffinityScores;
  recentActivity: ActivityEvent[];
  agentInsights: AgentInsight[];
}

export interface NudgeSuggestion {
  dormantIntentId: string;
  intentKey: string;
  category: string;
  message: string;
  revivalScore: number;
  priority: 'low' | 'medium' | 'high';
}

export interface AffinityScores {
  travel: number;
  dining: number;
  retail: number;
}

export interface ActivityEvent {
  type: string;
  timestamp: Date;
  description: string;
  agentId?: string;
}

export interface AgentInsight {
  agentId: string;
  insight: string;
  timestamp: Date;
}

// ── Intent Graph Memory Implementation ─────────────────────────────────────────

export class IntentGraphMemoryService implements IntentGraphMemory {
  private memoryCache = new Map<string, { data: EnrichedContext; expires: number }>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Get active intents for a user
   */
  async getActiveIntents(userId: string): Promise<IntentSummary[]> {
    try {
      const intents = await prisma.intent.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { _count: { select: { signals: true } } },
        orderBy: { lastSeenAt: 'desc' },
        take: 20,
      });

      return intents.map((intent) => ({
        id: intent.id,
        intentKey: intent.intentKey,
        category: intent.category,
        confidence: Number(intent.confidence),
        status: intent.status,
        lastSeen: intent.lastSeenAt,
        signals: intent._count.signals,
      }));
    } catch (error) {
      console.error('[IntentGraphMemory] getActiveIntents failed:', error);
      return [];
    }
  }

  /**
   * Get dormant intents for a user
   */
  async getDormantIntents(userId: string): Promise<DormantIntentSummary[]> {
    try {
      const dormantIntents = await prisma.dormantIntent.findMany({
        where: { userId, status: 'active' },
        orderBy: { revivalScore: 'desc' },
        take: 10,
      });

      return dormantIntents.map((di) => ({
        id: di.id,
        intentKey: di.intentKey,
        category: di.category,
        revivalScore: Number(di.revivalScore),
        daysDormant: di.daysDormant,
        nudgeCount: di.nudgeCount,
        idealRevivalAt: di.idealRevivalAt,
      }));
    } catch (error) {
      console.error('[IntentGraphMemory] getDormantIntents failed:', error);
      return [];
    }
  }

  /**
   * Get cross-app profile for a user
   */
  async getCrossAppProfile(userId: string): Promise<CrossAppProfile | null> {
    try {
      const profile = await prisma.crossAppIntentProfile.findUnique({
        where: { userId },
      });

      if (!profile) return null;

      return {
        userId: profile.userId,
        travelAffinity: profile.travelAffinity,
        diningAffinity: profile.diningAffinity,
        retailAffinity: profile.retailAffinity,
        activeIntents:
          profile.travelIntentCount +
          profile.diningIntentCount +
          profile.retailIntentCount,
        dormantIntents:
          profile.dormantTravelCount +
          profile.dormantDiningCount +
          profile.dormantRetailCount,
        totalConversions: profile.totalConversions,
      };
    } catch (error) {
      console.error('[IntentGraphMemory] getCrossAppProfile failed:', error);
      return null;
    }
  }

  /**
   * Enrich context for an agent with all intent data
   */
  async enrichContext(userId: string): Promise<EnrichedContext> {
    // Check cache first
    const cached = this.memoryCache.get(userId);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    // Fetch all data in parallel
    const [activeIntents, dormantIntents, profile, recentActivity, agentInsights] =
      await Promise.all([
        this.getActiveIntents(userId),
        this.getDormantIntents(userId),
        this.getCrossAppProfile(userId),
        this.getRecentActivity(userId),
        this.getAgentInsights(userId),
      ]);

    // Generate nudge suggestions from dormant intents
    const suggestedNudges: NudgeSuggestion[] = dormantIntents
      .filter((di) => di.revivalScore >= 0.3)
      .slice(0, 5)
      .map((di) => ({
        dormantIntentId: di.id,
        intentKey: di.intentKey,
        category: di.category,
        message: intentScoringService.generateNudgeMessage(di.intentKey, di.category, 'scheduled'),
        revivalScore: di.revivalScore,
        priority: di.revivalScore > 0.7 ? 'high' : di.revivalScore > 0.5 ? 'medium' : 'low',
      }));

    const enrichedContext: EnrichedContext = {
      userId,
      activeIntents,
      dormantIntents,
      suggestedNudges,
      affinities: {
        travel: profile?.travelAffinity ?? 50,
        dining: profile?.diningAffinity ?? 50,
        retail: profile?.retailAffinity ?? 50,
      },
      recentActivity,
      agentInsights,
    };

    // Cache the result
    this.memoryCache.set(userId, {
      data: enrichedContext,
      expires: Date.now() + this.CACHE_TTL_MS,
    });

    // Also publish to shared memory for other agents
    await sharedMemory.publish({
      from: 'intent-graph',
      to: 'agent-os',
      type: 'signal',
      payload: {
        event: 'enriched_context',
        userId,
        intentCount: activeIntents.length,
        dormantCount: dormantIntents.length
      },
      timestamp: new Date(),
    });

    return enrichedContext;
  }

  /**
   * Record an agent's insight about a user
   */
  async recordAgentInsight(userId: string, agentId: string, insight: string): Promise<void> {
    const insightKey = `insight:${userId}:${agentId}:${Date.now()}`;

    await sharedMemory.set(
      insightKey,
      {
        agentId,
        insight,
        timestamp: new Date().toISOString(),
      },
      86400 * 7 // Keep for 7 days
    );

    // Also update cross-app profile
    await prisma.crossAppIntentProfile.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  /**
   * Get recent activity for a user
   */
  private async getRecentActivity(userId: string): Promise<ActivityEvent[]> {
    try {
      const signals = await prisma.intentSignal.findMany({
        where: { intent: { userId } },
        include: { intent: { select: { intentKey: true, category: true } } },
        orderBy: { capturedAt: 'desc' },
        take: 10,
      });

      return signals.map((signal) => ({
        type: signal.eventType,
        timestamp: signal.capturedAt,
        description: `${signal.eventType} on ${signal.intent.intentKey}`,
      }));
    } catch (error) {
      console.error('[IntentGraphMemory] getRecentActivity failed:', error);
      return [];
    }
  }

  /**
   * Get agent insights for a user
   */
  private async getAgentInsights(userId: string): Promise<AgentInsight[]> {
    const insights: AgentInsight[] = [];

    // Get insights from shared memory
    try {
      const insightKeys = await sharedMemory.get<string[]>(`insights:${userId}`) || [];
      for (const key of insightKeys.slice(0, 10)) {
        const insight = await sharedMemory.get<{ agentId: string; insight: string; timestamp: string }>(key);
        if (insight) {
          insights.push({
            agentId: insight.agentId,
            insight: insight.insight,
            timestamp: new Date(insight.timestamp),
          });
        }
      }
    } catch (error) {
      console.error('[IntentGraphMemory] getAgentInsights failed:', error);
    }

    return insights;
  }

  /**
   * Clear cache for a user
   */
  invalidateCache(userId: string): void {
    this.memoryCache.delete(userId);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.memoryCache.clear();
  }
}

// ── Singleton Instance ─────────────────────────────────────────────────────────

export const intentGraphMemory = new IntentGraphMemoryService();

// ── Agent Tools Registry ────────────────────────────────────────────────────────

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: (params: Record<string, unknown>) => Promise<unknown>;
}

export const INTENT_TOOLS: AgentTool[] = [
  {
    name: 'get_user_intents',
    description: 'Get active intents for a user to personalize interactions',
    parameters: { userId: { type: 'string', required: true } },
    handler: async (params) => intentGraphMemory.getActiveIntents(params.userId as string),
  },
  {
    name: 'get_dormant_intents',
    description: 'Get dormant intents for revival suggestions',
    parameters: { userId: { type: 'string', required: true } },
    handler: async (params) => intentGraphMemory.getDormantIntents(params.userId as string),
  },
  {
    name: 'get_enriched_context',
    description: 'Get comprehensive context including intents, affinities, and suggestions',
    parameters: { userId: { type: 'string', required: true } },
    handler: async (params) => intentGraphMemory.enrichContext(params.userId as string),
  },
  {
    name: 'record_agent_insight',
    description: 'Record an agent insight about a user for future reference',
    parameters: {
      userId: { type: 'string', required: true },
      agentId: { type: 'string', required: true },
      insight: { type: 'string', required: true },
    },
    handler: async (params) =>
      intentGraphMemory.recordAgentInsight(
        params.userId as string,
        params.agentId as string,
        params.insight as string
      ),
  },
  {
    name: 'suggest_intent_revive',
    description: 'Get a nudge suggestion for a dormant intent',
    parameters: {
      userId: { type: 'string', required: true },
      intentKey: { type: 'string', required: true },
    },
    handler: async (params) => {
      const dormantIntents = await intentGraphMemory.getDormantIntents(params.userId as string);
      const intent = dormantIntents.find((di) => di.intentKey === params.intentKey);
      if (!intent) return null;
      return {
        intentKey: intent.intentKey,
        category: intent.category,
        message: intentScoringService.generateNudgeMessage(intent.intentKey, intent.category, 'scheduled'),
        revivalScore: intent.revivalScore,
      };
    },
  },
  {
    name: 'get_cross_app_profile',
    description: 'Get cross-app profile showing user affinities across categories',
    parameters: { userId: { type: 'string', required: true } },
    handler: async (params) => intentGraphMemory.getCrossAppProfile(params.userId as string),
  },
  {
    name: 'score_intent',
    description: 'Calculate revival score for an intent',
    parameters: {
      dormantIntentId: { type: 'string', required: true },
      triggerType: { type: 'string', required: false },
    },
    handler: async (params) =>
      intentScoringService.calculateRevivalScore(params.dormantIntentId as string),
  },
  {
    name: 'trigger_revival',
    description: 'Trigger revival for a dormant intent with a specific trigger type',
    parameters: {
      dormantIntentId: { type: 'string', required: true },
      triggerType: { type: 'string', required: true },
    },
    handler: async (params) =>
      dormantIntentService.triggerRevival(
        params.dormantIntentId as string,
        params.triggerType as 'price_drop' | 'return_user' | 'seasonality' | 'offer_match' | 'manual'
      ),
  },
];

// ── Tool Executor ──────────────────────────────────────────────────────────────

export async function executeAgentTool(
  toolName: string,
  params: Record<string, unknown>
): Promise<{ success: boolean; result?: unknown; error?: string }> {
  const tool = INTENT_TOOLS.find((t) => t.name === toolName);

  if (!tool) {
    return { success: false, error: `Tool not found: ${toolName}` };
  }

  try {
    const result = await tool.handler(params);
    return { success: true, result };
  } catch (error) {
    console.error(`[IntentGraphMemory] Tool ${toolName} failed:`, error);
    return { success: false, error: String(error) };
  }
}

// ── List Available Tools ───────────────────────────────────────────────────────

export function listAgentTools(): Array<{ name: string; description: string; parameters: Record<string, unknown> }> {
  return INTENT_TOOLS.map(({ name, description, parameters }) => ({
    name,
    description,
    parameters,
  }));
}
