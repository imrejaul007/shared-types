// ── Shared Memory Hub ──────────────────────────────────────────────────────────
// Redis-based inter-agent communication and state sharing
// DANGEROUS: This enables distributed state across all agent instances
// Falls back to in-memory Map when Redis unavailable
// ── Redis Configuration ─────────────────────────────────────────────────────────
const REDIS_URL = process.env.REDIS_URL || process.env.INTENT_GRAPH_REDIS_URL || 'redis://localhost:6379';
// Try to load IORedis, fall back to null if not available
let IORedis = null;
try {
    // Dynamic import to avoid build errors when ioredis not installed
    IORedis = require('ioredis');
}
catch {
    // IORedis not available, will use in-memory fallback
}
const logger = {
    info: (msg, meta) => console.log(`[SharedMemory] ${msg}`, meta || ''),
    warn: (msg, meta) => console.warn(`[SharedMemory] ${msg}`, meta || ''),
    error: (msg, meta) => console.error(`[SharedMemory] ${msg}`, meta || ''),
};
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
    WALLET_TXN: 'wallet:txn:',
    WALLET_BALANCE: 'wallet:balance:',
    ORDER: 'order:',
    PMS_REQUEST: 'pms:request:',
    TASK: 'task:',
    MERCHANT_ORDER: 'merchant:order:',
    CHANNEL: 'channel:',
};
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
    WALLET_TXN: 86400, // 24 hours
    WALLET_BALANCE: 300, // 5 minutes
    ORDER: 604800, // 7 days
    PMS_REQUEST: 86400, // 24 hours
    TASK: 86400, // 24 hours
    MERCHANT_ORDER: 604800, // 7 days
};
// ── Redis Client (Lazy Init) ──────────────────────────────────────────────────
let redisClient = null;
let redisSubscriber = null;
let isRedisConnected = false;
function getRedisClient() {
    if (!IORedis) {
        logger.warn('IORedis not available, using in-memory fallback');
        return null;
    }
    if (redisClient && redisClient.status === 'ready') {
        return redisClient;
    }
    try {
        redisClient = new IORedis(REDIS_URL, {
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            retryStrategy: (times) => {
                if (times > 3)
                    return null; // Stop retrying
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });
        redisClient.on('connect', () => {
            logger.info('[Redis] Connected');
            isRedisConnected = true;
        });
        redisClient.on('error', (err) => {
            logger.warn('[Redis] Error:', err.message);
            isRedisConnected = false;
        });
        redisClient.on('close', () => {
            logger.warn('[Redis] Connection closed');
            isRedisConnected = false;
        });
        // Connect lazily
        redisClient.connect().catch((err) => {
            logger.warn('[Redis] Connection failed:', err.message);
            isRedisConnected = false;
        });
        return redisClient;
    }
    catch (err) {
        logger.warn('[Redis] Failed to create client:', err);
        return null;
    }
}
function getRedisSubscriber() {
    if (!IORedis)
        return null;
    if (redisSubscriber && redisSubscriber.status === 'ready') {
        return redisSubscriber;
    }
    try {
        const client = getRedisClient();
        if (!client)
            return null;
        redisSubscriber = client.duplicate();
        redisSubscriber.on('error', (err) => {
            logger.warn('[Redis Subscriber] Error:', err.message);
        });
        return redisSubscriber;
    }
    catch {
        return null;
    }
}
// ── In-Memory Fallback ────────────────────────────────────────────────────────
const memoryStore = new Map();
const subscribers = new Map();
// ── Shared Memory Class ────────────────────────────────────────────────────────
export class SharedMemory {
    static instance;
    constructor() { }
    static getInstance() {
        if (!SharedMemory.instance) {
            SharedMemory.instance = new SharedMemory();
        }
        return SharedMemory.instance;
    }
    // ── Generic Operations (Redis + In-Memory Fallback) ─────────────────────────
    async set(key, value, ttlSeconds) {
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
                await redis.set(key, JSON.stringify({ value, expiresAt }), 'EX', ttlSeconds || 999999);
                return;
            }
            catch (err) {
                logger.warn('[Redis] Set failed, using in-memory fallback:', err);
            }
        }
        // In-memory fallback
        memoryStore.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
    }
    async get(key) {
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                const data = await redis.get(key);
                if (!data)
                    return null;
                const parsed = JSON.parse(data);
                if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
                    await redis.del(key);
                    return null;
                }
                return parsed.value;
            }
            catch (err) {
                logger.warn('[Redis] Get failed, using in-memory fallback:', err);
            }
        }
        // In-memory fallback
        const entry = memoryStore.get(key);
        if (!entry)
            return null;
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            memoryStore.delete(key);
            return null;
        }
        return entry.value;
    }
    async delete(key) {
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                await redis.del(key);
                return;
            }
            catch (err) {
                logger.warn('[Redis] Delete failed:', err);
            }
        }
        memoryStore.delete(key);
    }
    async exists(key) {
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                const result = await redis.exists(key);
                return result === 1;
            }
            catch {
                // Fall through to in-memory
            }
        }
        const entry = memoryStore.get(key);
        if (!entry)
            return false;
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            memoryStore.delete(key);
            return false;
        }
        return true;
    }
    async keys(pattern) {
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
                const allKeys = await redis.keys(pattern);
                return allKeys.filter((k) => regex.test(k));
            }
            catch {
                // Fall through to in-memory
            }
        }
        // In-memory fallback
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        const result = [];
        for (const key of memoryStore.keys()) {
            if (regex.test(key)) {
                const entry = memoryStore.get(key);
                if (entry && (!entry.expiresAt || Date.now() <= entry.expiresAt)) {
                    result.push(key);
                }
            }
        }
        return result;
    }
    async mget(pattern) {
        const result = new Map();
        const keys = await this.keys(pattern);
        for (const key of keys) {
            const value = await this.get(key);
            if (value !== null) {
                result.set(key, value);
            }
        }
        return result;
    }
    // ── Demand Signals ──────────────────────────────────────────────────────────
    async setDemandSignal(signal) {
        const key = `${KEYS.DEMAND_SIGNALS}${signal.merchantId}:${signal.category}`;
        await this.set(key, signal, TTL.DEMAND_SIGNALS);
        await this.updateGlobalDemandIndex(signal);
    }
    async getDemandSignal(merchantId, category) {
        return this.get(`${KEYS.DEMAND_SIGNALS}${merchantId}:${category}`);
    }
    async getAllDemandSignals() {
        const signals = await this.mget(`${KEYS.DEMAND_SIGNALS}*`);
        return Array.from(signals.values());
    }
    async updateGlobalDemandIndex(signal) {
        const globalKey = `${KEYS.GLOBAL_DEMAND}${signal.category}`;
        const existing = await this.get(globalKey) || {};
        existing[signal.merchantId] = signal.demandCount;
        await this.set(globalKey, existing, TTL.DEMAND_SIGNALS * 2);
    }
    async getGlobalDemand(category) {
        return (await this.get(`${KEYS.GLOBAL_DEMAND}${category}`)) ?? {};
    }
    async getTopDemandedMerchants(category, limit = 10) {
        const global = await this.getGlobalDemand(category);
        return Object.entries(global)
            .map(([merchantId, demand]) => ({ merchantId, demand }))
            .sort((a, b) => b.demand - a.demand)
            .slice(0, limit);
    }
    // ── Scarcity Signals ────────────────────────────────────────────────────────
    async setScarcitySignal(signal) {
        const key = `${KEYS.SCARCITY_SIGNALS}${signal.merchantId}:${signal.category}`;
        await this.set(key, signal, TTL.SCARCITY_SIGNALS);
    }
    async getScarcitySignal(merchantId, category) {
        return this.get(`${KEYS.SCARCITY_SIGNALS}${merchantId}:${category}`);
    }
    async getAllScarcitySignals() {
        const signals = await this.mget(`${KEYS.SCARCITY_SIGNALS}*`);
        return Array.from(signals.values());
    }
    async getCriticalScarcity() {
        const signals = await this.getAllScarcitySignals();
        return signals.filter((s) => s.scarcityScore > 70);
    }
    // ── User Response Profiles ──────────────────────────────────────────────────
    async setUserProfile(profile) {
        const key = `${KEYS.USER_PROFILES}${profile.userId}`;
        await this.set(key, profile, TTL.USER_PROFILES);
    }
    async getUserProfile(userId) {
        return this.get(`${KEYS.USER_PROFILES}${userId}`);
    }
    async getUserProfiles(userIds) {
        const result = new Map();
        for (const userId of userIds) {
            const profile = await this.getUserProfile(userId);
            if (profile)
                result.set(userId, profile);
        }
        return result;
    }
    // ── Attribution Records ──────────────────────────────────────────────────────
    async recordAttribution(record) {
        const key = `${KEYS.ATTRIBUTION}${record.id}`;
        await this.set(key, record, TTL.ATTRIBUTION);
        const userKey = `${KEYS.ATTRIBUTION}user:${record.userId}`;
        const existing = await this.get(userKey) || [];
        existing.push(record.id);
        await this.set(userKey, existing, TTL.ATTRIBUTION);
    }
    async getAttributionRecord(id) {
        return this.get(`${KEYS.ATTRIBUTION}${id}`);
    }
    async getUserAttributions(userId) {
        const userKey = `${KEYS.ATTRIBUTION}user:${userId}`;
        const ids = await this.get(userKey) || [];
        const records = [];
        for (const id of ids) {
            const record = await this.getAttributionRecord(id);
            if (record)
                records.push(record);
        }
        return records;
    }
    // ── Scored Intents ──────────────────────────────────────────────────────────
    async setScoredIntent(scored) {
        const key = `${KEYS.SCORED_INTENTS}${scored.intentId}`;
        await this.set(key, scored, TTL.SCORED_INTENTS);
        const userKey = `${KEYS.SCORED_INTENTS}user:${scored.userId}`;
        const existing = await this.get(userKey) || [];
        if (!existing.includes(scored.intentId)) {
            existing.push(scored.intentId);
            await this.set(userKey, existing, TTL.SCORED_INTENTS);
        }
    }
    async getScoredIntent(intentId) {
        return this.get(`${KEYS.SCORED_INTENTS}${intentId}`);
    }
    async getUserScoredIntents(userId) {
        const userKey = `${KEYS.SCORED_INTENTS}user:${userId}`;
        const ids = await this.get(userKey) || [];
        const results = [];
        for (const id of ids) {
            const scored = await this.getScoredIntent(id);
            if (scored)
                results.push(scored);
        }
        return results;
    }
    // ── Optimization Recommendations ─────────────────────────────────────────────
    async addOptimization(rec) {
        const key = `${KEYS.OPTIMIZATIONS}${rec.agent}:${Date.now()}`;
        await this.set(key, rec, TTL.OPTIMIZATIONS);
        await this.set(`${KEYS.OPTIMIZATIONS}latest:${rec.agent}`, rec, TTL.OPTIMIZATIONS);
    }
    async getLatestOptimization(agent) {
        return this.get(`${KEYS.OPTIMIZATIONS}latest:${agent}`);
    }
    async getAllOptimizations() {
        const recs = await this.mget(`${KEYS.OPTIMIZATIONS}*`);
        return Array.from(recs.values()).filter((r) => r.type);
    }
    // ── Collaborative Signals ────────────────────────────────────────────────────
    async setCollaborativeSignal(signal) {
        const key = `${KEYS.COLLABORATIVE}${signal.userId}`;
        await this.set(key, signal, TTL.COLLABORATIVE);
    }
    async getCollaborativeSignal(userId) {
        return this.get(`${KEYS.COLLABORATIVE}${userId}`);
    }
    async addTrendingIntent(intentKey, category) {
        const key = `${KEYS.TRENDING}${category}`;
        const existing = await this.get(key) || {};
        existing[intentKey] = (existing[intentKey] || 0) + 1;
        await this.set(key, existing, 3600);
    }
    async getTrendingIntents(category, limit = 10) {
        const trending = await this.get(`${KEYS.TRENDING}${category}`) || {};
        return Object.entries(trending)
            .map(([intentKey, count]) => ({ intentKey, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    // ── Revenue Reports ──────────────────────────────────────────────────────────
    async saveRevenueReport(report) {
        const key = `${KEYS.REVENUE_REPORTS}${report.period.start.getTime()}`;
        await this.set(key, report, TTL.REVENUE_REPORTS);
        await this.set(`${KEYS.REVENUE_REPORTS}latest`, report, TTL.REVENUE_REPORTS);
    }
    async getLatestRevenueReport() {
        return this.get(`${KEYS.REVENUE_REPORTS}latest`);
    }
    async getRevenueReports(since) {
        const reports = await this.mget(`${KEYS.REVENUE_REPORTS}*`);
        return Array.from(reports.values())
            .filter((r) => r.period.start >= since)
            .sort((a, b) => a.period.start.getTime() - b.period.start.getTime());
    }
    // ── Agent Health ─────────────────────────────────────────────────────────────
    async updateAgentHealth(health) {
        const key = `${KEYS.AGENT_HEALTH}${health.agent}`;
        await this.set(key, health, TTL.HEALTH);
    }
    async getAgentHealth(agent) {
        return this.get(`${KEYS.AGENT_HEALTH}${agent}`);
    }
    async getAllAgentHealth() {
        const health = await this.mget(`${KEYS.AGENT_HEALTH}*`);
        return Array.from(health.values()).filter((h) => h.agent);
    }
    // ── Pub/Sub Messaging (Redis + In-Memory Fallback) ─────────────────────────
    async publish(message) {
        const channel = `${KEYS.CHANNEL}${message.to}`;
        // Publish to Redis for distributed messaging
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                await redis.publish(channel, JSON.stringify(message));
            }
            catch (err) {
                logger.warn('[Redis] Publish failed:', err);
            }
        }
        // Also call local subscribers
        const localSubscribers = subscribers.get(channel) || new Set();
        for (const callback of localSubscribers) {
            try {
                callback(message);
            }
            catch (err) {
                logger.error('Local subscriber callback failed', { error: err, channel });
            }
        }
    }
    subscribe(agent, callback) {
        const channel = `${KEYS.CHANNEL}${agent}`;
        // Add to local subscribers
        if (!subscribers.has(channel)) {
            subscribers.set(channel, new Set());
        }
        subscribers.get(channel).add(callback);
        // Subscribe to Redis channel if available
        const redis = getRedisSubscriber();
        if (redis && isRedisConnected) {
            redis.subscribe(channel).catch((err) => {
                logger.warn('[Redis] Subscribe failed:', err.message);
            });
            redis.on('message', (ch, msg) => {
                if (ch === channel) {
                    try {
                        const message = JSON.parse(msg);
                        callback(message);
                    }
                    catch (err) {
                        logger.error('Failed to parse Redis message', { error: err, channel });
                    }
                }
            });
        }
        // Return unsubscribe function
        return () => {
            subscribers.get(channel)?.delete(callback);
        };
    }
    // ── Wallet Integration Helpers ────────────────────────────────────────────────
    async setWalletTransaction(transactionId, data) {
        const key = `${KEYS.WALLET_TXN}${transactionId}`;
        await this.set(key, data, TTL.WALLET_TXN);
    }
    async getWalletTransaction(transactionId) {
        return this.get(`${KEYS.WALLET_TXN}${transactionId}`);
    }
    async setWalletBalance(userId, balance) {
        const key = `${KEYS.WALLET_BALANCE}${userId}`;
        await this.set(key, balance, TTL.WALLET_BALANCE);
    }
    async getWalletBalance(userId) {
        return this.get(`${KEYS.WALLET_BALANCE}${userId}`);
    }
    async invalidateWalletBalance(userId) {
        await this.delete(`${KEYS.WALLET_BALANCE}${userId}`);
    }
    // ── Order Integration Helpers ────────────────────────────────────────────────
    async setOrder(orderId, data) {
        const key = `${KEYS.ORDER}${orderId}`;
        await this.set(key, data, TTL.ORDER);
    }
    async getOrder(orderId) {
        return this.get(`${KEYS.ORDER}${orderId}`);
    }
    // ── PMS Integration Helpers ──────────────────────────────────────────────────
    async setPMSRequest(requestId, data) {
        const key = `${KEYS.PMS_REQUEST}${requestId}`;
        await this.set(key, data, TTL.PMS_REQUEST);
    }
    async getPMSRequest(requestId) {
        return this.get(`${KEYS.PMS_REQUEST}${requestId}`);
    }
    // ── Task Integration Helpers ────────────────────────────────────────────────
    async setTask(taskId, data) {
        const key = `${KEYS.TASK}${taskId}`;
        await this.set(key, data, TTL.TASK);
    }
    async getTask(taskId) {
        return this.get(`${KEYS.TASK}${taskId}`);
    }
    // ── Utility ───────────────────────────────────────────────────────────────────
    async flush() {
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                const keys = await this.keys('*');
                for (const key of keys) {
                    await redis.del(key);
                }
            }
            catch (err) {
                logger.warn('[Redis] Flush failed:', err);
            }
        }
        memoryStore.clear();
    }
    async stats() {
        let inMemoryCount = memoryStore.size;
        let redisCount = 0;
        const redis = getRedisClient();
        if (redis && isRedisConnected) {
            try {
                const keys = await redis.keys('*');
                redisCount = keys.length;
            }
            catch {
                // Ignore
            }
        }
        return {
            keys: inMemoryCount + redisCount,
            memoryUsage: `~${Math.round(JSON.stringify([...memoryStore.values()]).length / 1024)} KB`,
            redisConnected: isRedisConnected,
        };
    }
    isRedisAvailable() {
        return isRedisConnected;
    }
}
export const sharedMemory = SharedMemory.getInstance();
//# sourceMappingURL=shared-memory.js.map