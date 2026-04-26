// ── Shared Memory Hub ──────────────────────────────────────────────────────────
// Redis-based inter-agent communication and state sharing
// All agents read/write here for cross-agent visibility

import type {
  DemandSignal,
  ScarcitySignal,
  UserResponseProfile,
  AttributionRecord,
  ScoredIntent,
  OptimizationRecommendation,
  CollaborativeSignal,
  RevenueReport,
  AgentHealth,
  AgentMessage,
} from './types.js';

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => console.log(`[SharedMemory] ${msg}`, meta || ''),
  error: (msg: string, meta?: Record<string, unknown>) => console.error(`[SharedMemory] ${msg}`, meta || ''),
};

// In-memory store (would be Redis in production)
const memoryStore = new Map<string, unknown>();
const subscribers = new Map<string, Set<(msg: AgentMessage) => void>>();

// ── Key Prefixes ──────────────────────────────────────────────────────────────

const KEYS = {
  DEMAND_SIGNALS: 'demand:signals:',
  SCARCITY_SIGNALS: 'scarcity:signals:',
  USER_PROFILES: 'profiles:',
  ATTRIBUTION: 'attribution:',
  SCORED_INTENTS: 'scored:intents:',
  OPTIMIZATIONS: 'optimizations:',
  COLLABORATIVE: 'collaborative:',
  REVENUE_REPORTS: 'revenue:reports:',
  AGENT_HEALTH: 'health:',
  MESSAGE_QUEUE: 'messages:',
  GLOBAL_DEMAND: 'demand:global:',
  TRENDING: 'trending:',
} as const;

// ── TTL Configurations ─────────────────────────────────────────────────────────

const TTL = {
  DEMAND_SIGNALS: 300, // 5 minutes
  SCARCITY_SIGNALS: 60, // 1 minute
  USER_PROFILES: 86400, // 24 hours
  ATTRIBUTION: 604800, // 7 days
  SCORED_INTENTS: 3600, // 1 hour
  OPTIMIZATIONS: 3600, // 1 hour
  COLLABORATIVE: 43200, // 12 hours
  REVENUE_REPORTS: 900, // 15 minutes
  HEALTH: 300, // 5 minutes
} as const;

// ── Shared Memory Class ────────────────────────────────────────────────────────

export class SharedMemory {
  private static instance: SharedMemory;

  private constructor() {}

  static getInstance(): SharedMemory {
    if (!SharedMemory.instance) {
      SharedMemory.instance = new SharedMemory();
    }
    return SharedMemory.instance;
  }

  // ── Generic Operations ──────────────────────────────────────────────────────

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    memoryStore.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = memoryStore.get(key) as { value: T; expiresAt: number | null } | undefined;
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value;
  }

  async delete(key: string): Promise<void> {
    memoryStore.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const entry = memoryStore.get(key);
    if (!entry) return false;
    const typed = entry as { expiresAt: number | null };
    if (typed.expiresAt && Date.now() > typed.expiresAt) {
      memoryStore.delete(key);
      return false;
    }
    return true;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const keys: string[] = [];
    for (const key of memoryStore.keys()) {
      if (regex.test(key)) keys.push(key);
    }
    return keys;
  }

  async mget<T>(pattern: string): Promise<Map<string, T>> {
    const keys = await this.keys(pattern);
    const result = new Map<string, T>();
    for (const key of keys) {
      const value = await this.get<T>(key);
      if (value !== null) result.set(key, value);
    }
    return result;
  }

  // ── Demand Signals ──────────────────────────────────────────────────────────

  async setDemandSignal(signal: DemandSignal): Promise<void> {
    const key = `${KEYS.DEMAND_SIGNALS}${signal.merchantId}:${signal.category}`;
    await this.set(key, signal, TTL.DEMAND_SIGNALS);

    // Also update global demand index
    await this.updateGlobalDemandIndex(signal);
  }

  async getDemandSignal(merchantId: string, category: string): Promise<DemandSignal | null> {
    return this.get<DemandSignal>(`${KEYS.DEMAND_SIGNALS}${merchantId}:${category}`);
  }

  async getAllDemandSignals(): Promise<DemandSignal[]> {
    const signals = await this.mget<DemandSignal>(`${KEYS.DEMAND_SIGNALS}*`);
    return Array.from(signals.values());
  }

  async updateGlobalDemandIndex(signal: DemandSignal): Promise<void> {
    const globalKey = `${KEYS.GLOBAL_DEMAND}${signal.category}`;
    const existing = await this.get<Record<string, number>>(globalKey) || {};
    existing[signal.merchantId] = signal.demandCount;
    await this.set(globalKey, existing, TTL.DEMAND_SIGNALS * 2);
  }

  async getGlobalDemand(category: string): Promise<Record<string, number>> {
    const result = await this.get<Record<string, number>>(`${KEYS.GLOBAL_DEMAND}${category}`);
    return result ?? {};
  }

  async getTopDemandedMerchants(category: string, limit = 10): Promise<Array<{ merchantId: string; demand: number }>> {
    const global = await this.getGlobalDemand(category);
    return Object.entries(global)
      .map(([merchantId, demand]) => ({ merchantId, demand }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, limit);
  }

  // ── Scarcity Signals ────────────────────────────────────────────────────────

  async setScarcitySignal(signal: ScarcitySignal): Promise<void> {
    const key = `${KEYS.SCARCITY_SIGNALS}${signal.merchantId}:${signal.category}`;
    await this.set(key, signal, TTL.SCARCITY_SIGNALS);
  }

  async getScarcitySignal(merchantId: string, category: string): Promise<ScarcitySignal | null> {
    return this.get<ScarcitySignal>(`${KEYS.SCARCITY_SIGNALS}${merchantId}:${category}`);
  }

  async getAllScarcitySignals(): Promise<ScarcitySignal[]> {
    const signals = await this.mget<ScarcitySignal>(`${KEYS.SCARCITY_SIGNALS}*`);
    return Array.from(signals.values());
  }

  async getCriticalScarcity(): Promise<ScarcitySignal[]> {
    const signals = await this.getAllScarcitySignals();
    return signals.filter((s) => s.scarcityScore > 70);
  }

  // ── User Response Profiles ──────────────────────────────────────────────────

  async setUserProfile(profile: UserResponseProfile): Promise<void> {
    const key = `${KEYS.USER_PROFILES}${profile.userId}`;
    await this.set(key, profile, TTL.USER_PROFILES);
  }

  async getUserProfile(userId: string): Promise<UserResponseProfile | null> {
    return this.get<UserResponseProfile>(`${KEYS.USER_PROFILES}${userId}`);
  }

  async getUserProfiles(userIds: string[]): Promise<Map<string, UserResponseProfile>> {
    const result = new Map<string, UserResponseProfile>();
    for (const userId of userIds) {
      const profile = await this.getUserProfile(userId);
      if (profile) result.set(userId, profile);
    }
    return result;
  }

  // ── Attribution Records ──────────────────────────────────────────────────────

  async recordAttribution(record: AttributionRecord): Promise<void> {
    const key = `${KEYS.ATTRIBUTION}${record.id}`;
    await this.set(key, record, TTL.ATTRIBUTION);

    // Also add to user's attribution list
    const userKey = `${KEYS.ATTRIBUTION}user:${record.userId}`;
    const existing = await this.get<string[]>(userKey) || [];
    existing.push(record.id);
    await this.set(userKey, existing, TTL.ATTRIBUTION);
  }

  async getAttributionRecord(id: string): Promise<AttributionRecord | null> {
    return this.get<AttributionRecord>(`${KEYS.ATTRIBUTION}${id}`);
  }

  async getUserAttributions(userId: string): Promise<AttributionRecord[]> {
    const userKey = `${KEYS.ATTRIBUTION}user:${userId}`;
    const ids = await this.get<string[]>(userKey) || [];
    const records: AttributionRecord[] = [];
    for (const id of ids) {
      const record = await this.getAttributionRecord(id);
      if (record) records.push(record);
    }
    return records;
  }

  // ── Scored Intents ──────────────────────────────────────────────────────────

  async setScoredIntent(scored: ScoredIntent): Promise<void> {
    const key = `${KEYS.SCORED_INTENTS}${scored.intentId}`;
    await this.set(key, scored, TTL.SCORED_INTENTS);

    // Also index by user
    const userKey = `${KEYS.SCORED_INTENTS}user:${scored.userId}`;
    const existing = await this.get<string[]>(userKey) || [];
    if (!existing.includes(scored.intentId)) {
      existing.push(scored.intentId);
      await this.set(userKey, existing, TTL.SCORED_INTENTS);
    }
  }

  async getScoredIntent(intentId: string): Promise<ScoredIntent | null> {
    return this.get<ScoredIntent>(`${KEYS.SCORED_INTENTS}${intentId}`);
  }

  async getUserScoredIntents(userId: string): Promise<ScoredIntent[]> {
    const userKey = `${KEYS.SCORED_INTENTS}user:${userId}`;
    const ids = await this.get<string[]>(userKey) || [];
    const results: ScoredIntent[] = [];
    for (const id of ids) {
      const scored = await this.getScoredIntent(id);
      if (scored) results.push(scored);
    }
    return results;
  }

  // ── Optimization Recommendations ─────────────────────────────────────────────

  async addOptimization(rec: OptimizationRecommendation): Promise<void> {
    const key = `${KEYS.OPTIMIZATIONS}${rec.agent}:${Date.now()}`;
    await this.set(key, rec, TTL.OPTIMIZATIONS);

    // Also set as latest for agent
    await this.set(`${KEYS.OPTIMIZATIONS}latest:${rec.agent}`, rec, TTL.OPTIMIZATIONS);
  }

  async getLatestOptimization(agent: string): Promise<OptimizationRecommendation | null> {
    return this.get<OptimizationRecommendation>(`${KEYS.OPTIMIZATIONS}latest:${agent}`);
  }

  async getAllOptimizations(): Promise<OptimizationRecommendation[]> {
    const recs = await this.mget<OptimizationRecommendation>(`${KEYS.OPTIMIZATIONS}*`);
    return Array.from(recs.values()).filter((r) => r.type); // Filter out non-rec objects
  }

  // ── Collaborative Signals ────────────────────────────────────────────────────

  async setCollaborativeSignal(signal: CollaborativeSignal): Promise<void> {
    const key = `${KEYS.COLLABORATIVE}${signal.userId}`;
    await this.set(key, signal, TTL.COLLABORATIVE);
  }

  async getCollaborativeSignal(userId: string): Promise<CollaborativeSignal | null> {
    return this.get<CollaborativeSignal>(`${KEYS.COLLABORATIVE}${userId}`);
  }

  async addTrendingIntent(intentKey: string, category: string): Promise<void> {
    const key = `${KEYS.TRENDING}${category}`;
    const existing = await this.get<Record<string, number>>(key) || {};
    existing[intentKey] = (existing[intentKey] || 0) + 1;
    await this.set(key, existing, 3600); // 1 hour
  }

  async getTrendingIntents(category: string, limit = 10): Promise<Array<{ intentKey: string; count: number }>> {
    const trending = await this.get<Record<string, number>>(`${KEYS.TRENDING}${category}`) || {};
    return Object.entries(trending)
      .map(([intentKey, count]) => ({ intentKey, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // ── Revenue Reports ──────────────────────────────────────────────────────────

  async saveRevenueReport(report: RevenueReport): Promise<void> {
    const key = `${KEYS.REVENUE_REPORTS}${report.period.start.getTime()}`;
    await this.set(key, report, TTL.REVENUE_REPORTS);

    // Update latest
    await this.set(`${KEYS.REVENUE_REPORTS}latest`, report, TTL.REVENUE_REPORTS);
  }

  async getLatestRevenueReport(): Promise<RevenueReport | null> {
    return this.get<RevenueReport>(`${KEYS.REVENUE_REPORTS}latest`);
  }

  async getRevenueReports(since: Date): Promise<RevenueReport[]> {
    const reports = await this.mget<RevenueReport>(`${KEYS.REVENUE_REPORTS}*`);
    return Array.from(reports.values())
      .filter((r) => r.period.start >= since)
      .sort((a, b) => a.period.start.getTime() - b.period.start.getTime());
  }

  // ── Agent Health ─────────────────────────────────────────────────────────────

  async updateAgentHealth(health: AgentHealth): Promise<void> {
    const key = `${KEYS.AGENT_HEALTH}${health.agent}`;
    await this.set(key, health, TTL.HEALTH);
  }

  async getAgentHealth(agent: string): Promise<AgentHealth | null> {
    return this.get<AgentHealth>(`${KEYS.AGENT_HEALTH}${agent}`);
  }

  async getAllAgentHealth(): Promise<AgentHealth[]> {
    const health = await this.mget<AgentHealth>(`${KEYS.AGENT_HEALTH}*`);
    return Array.from(health.values()).filter((h) => h.agent); // Filter valid health objects
  }

  // ── Pub/Sub Messaging ────────────────────────────────────────────────────────

  async publish(message: AgentMessage): Promise<void> {
    const channel = `${KEYS.MESSAGE_QUEUE}${message.to}`;
    const subscribersList = subscribers.get(channel) || new Set();

    for (const callback of subscribersList) {
      try {
        callback(message);
      } catch (err) {
        logger.error('Subscriber callback failed', { error: err, channel });
      }
    }
  }

  subscribe(agent: string, callback: (msg: AgentMessage) => void): () => void {
    const channel = `${KEYS.MESSAGE_QUEUE}${agent}`;
    if (!subscribers.has(channel)) {
      subscribers.set(channel, new Set());
    }
    subscribers.get(channel)!.add(callback);

    return () => {
      subscribers.get(channel)?.delete(callback);
    };
  }

  // ── Utility ───────────────────────────────────────────────────────────────────

  async flush(): Promise<void> {
    memoryStore.clear();
  }

  async stats(): Promise<{ keys: number; memoryUsage: string }> {
    return {
      keys: memoryStore.size,
      memoryUsage: '~' + Math.round(JSON.stringify([...memoryStore.values()]).length / 1024) + ' KB',
    };
  }
}

export const sharedMemory = SharedMemory.getInstance();
