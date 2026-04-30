"use strict";
// ── ReZ Agent OS - A/B Testing ─────────────────────────────────────────────────
// Prompt and behavior experimentation system
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABTesting = void 0;
exports.getABTesting = getABTesting;
const logger_1 = require("../logger");
class ABTesting {
    experiments = new Map();
    assignments = new Map();
    hashFunction;
    constructor(hashFunction) {
        // Default hash function for consistent assignment
        this.hashFunction = hashFunction || ((userId, experimentId) => {
            const combined = `${userId}:${experimentId}`;
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
                const char = combined.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash) % 100;
        });
    }
    // ── Experiment Management ──────────────────────────────────────────────────────
    createExperiment(config) {
        // Default to equal distribution if not specified
        const distribution = config.distribution || this.calculateEqualDistribution(config.variants);
        const experiment = {
            id: config.id,
            name: config.name,
            description: config.description,
            variants: config.variants,
            distribution,
            startDate: config.startDate,
            endDate: config.endDate,
            status: 'draft',
            metrics: {
                impressions: {},
                conversions: {},
                errors: {},
            },
        };
        // Initialize metrics for each variant
        for (const variantId of Object.keys(config.variants)) {
            experiment.metrics.impressions[variantId] = 0;
            experiment.metrics.conversions[variantId] = 0;
            experiment.metrics.errors[variantId] = 0;
        }
        this.experiments.set(config.id, experiment);
        logger_1.logger.info('[ABTesting] Created experiment', { id: config.id, name: config.name });
        return experiment;
    }
    calculateEqualDistribution(variants) {
        const count = Object.keys(variants).length;
        const equalShare = 100 / count;
        const distribution = {};
        for (const variantId of Object.keys(variants)) {
            distribution[variantId] = equalShare;
        }
        return distribution;
    }
    startExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return false;
        experiment.status = 'running';
        logger_1.logger.info('[ABTesting] Started experiment', { id: experimentId });
        return true;
    }
    pauseExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return false;
        experiment.status = 'paused';
        logger_1.logger.info('[ABTesting] Paused experiment', { id: experimentId });
        return true;
    }
    completeExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return false;
        experiment.status = 'completed';
        logger_1.logger.info('[ABTesting] Completed experiment', { id: experimentId });
        return true;
    }
    // ── Variant Assignment ─────────────────────────────────────────────────────────
    assignVariant(userId, experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return null;
        // Check if experiment is active
        const now = new Date();
        if (experiment.status !== 'running')
            return null;
        if (experiment.startDate > now)
            return null;
        if (experiment.endDate && experiment.endDate < now)
            return null;
        // Check for existing assignment
        const assignmentKey = `${userId}:${experimentId}`;
        const existing = this.assignments.get(assignmentKey);
        if (existing)
            return existing.variant;
        // Hash-based consistent assignment
        const hash = this.hashFunction(userId, experimentId);
        let cumulative = 0;
        for (const [variantId, percentage] of Object.entries(experiment.distribution)) {
            cumulative += percentage;
            if (hash < cumulative) {
                // Assign this variant
                const assignment = {
                    experimentId,
                    variant: variantId,
                    assignedAt: new Date(),
                };
                this.assignments.set(assignmentKey, assignment);
                experiment.metrics.impressions[variantId]++;
                logger_1.logger.debug('[ABTesting] Assigned variant', {
                    userId,
                    experimentId,
                    variant: variantId,
                });
                return variantId;
            }
        }
        // Fallback to first variant (shouldn't happen)
        const firstVariant = Object.keys(experiment.variants)[0];
        return firstVariant;
    }
    // ── Metric Tracking ─────────────────────────────────────────────────────────
    trackConversion(userId, experimentId) {
        const assignmentKey = `${userId}:${experimentId}`;
        const assignment = this.assignments.get(assignmentKey);
        if (!assignment)
            return;
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return;
        experiment.metrics.conversions[assignment.variant]++;
        logger_1.logger.debug('[ABTesting] Tracked conversion', {
            userId,
            experimentId,
            variant: assignment.variant,
        });
    }
    trackError(userId, experimentId) {
        const assignmentKey = `${userId}:${experimentId}`;
        const assignment = this.assignments.get(assignmentKey);
        if (!assignment)
            return;
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return;
        experiment.metrics.errors[assignment.variant]++;
        logger_1.logger.debug('[ABTesting] Tracked error', {
            userId,
            experimentId,
            variant: assignment.variant,
        });
    }
    // ── Variant Retrieval ──────────────────────────────────────────────────────────
    getVariant(experimentId, variantId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return null;
        return experiment.variants[variantId] || null;
    }
    getVariantForUser(userId, experimentId) {
        const variantId = this.assignVariant(userId, experimentId);
        if (!variantId)
            return null;
        return this.getVariant(experimentId, variantId);
    }
    // ── Results ─────────────────────────────────────────────────────────────────
    getExperimentResults(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment)
            return null;
        const results = {};
        let winner;
        let bestRate = -1;
        for (const [variantId, variant] of Object.entries(experiment.variants)) {
            const impressions = experiment.metrics.impressions[variantId] || 0;
            const conversions = experiment.metrics.conversions[variantId] || 0;
            const errors = experiment.metrics.errors[variantId] || 0;
            const conversionRate = impressions > 0 ? conversions / impressions : 0;
            const errorRate = impressions > 0 ? errors / impressions : 0;
            results[variantId] = {
                impressions,
                conversions,
                conversionRate,
                errors,
                errorRate,
            };
            if (conversionRate > bestRate) {
                bestRate = conversionRate;
                winner = variantId;
            }
        }
        // Calculate confidence (simplified)
        const totalImpressions = Object.values(experiment.metrics.impressions).reduce((a, b) => a + b, 0);
        const confidence = totalImpressions > 100 ? Math.min(0.95, totalImpressions / 1000) : undefined;
        return {
            experiment,
            results,
            winner,
            confidence,
        };
    }
    // ── Preset Experiments ───────────────────────────────────────────────────────
    createWelcomePromptExperiment() {
        return this.createExperiment({
            id: 'welcome_prompt_v1',
            name: 'Welcome Prompt Optimization',
            description: 'Test different welcome message styles',
            startDate: new Date(),
            variants: {
                friendly: {
                    name: 'Friendly',
                    systemPrompt: 'You are a friendly, casual assistant. Greet users warmly and use conversational language.',
                    temperature: 0.8,
                },
                professional: {
                    name: 'Professional',
                    systemPrompt: 'You are a professional assistant. Be concise and helpful in your responses.',
                    temperature: 0.5,
                },
            },
            distribution: {
                friendly: 50,
                professional: 50,
            },
        });
    }
    createToolSuggestionExperiment() {
        return this.createExperiment({
            id: 'tool_suggestion_v1',
            name: 'Tool Suggestion Timing',
            description: 'Test proactive vs reactive tool suggestions',
            startDate: new Date(),
            variants: {
                proactive: {
                    name: 'Proactive',
                    systemPrompt: 'Always suggest relevant tools proactively when users mention related needs.',
                },
                reactive: {
                    name: 'Reactive',
                    systemPrompt: 'Wait for users to ask about specific features before suggesting tools.',
                },
            },
            distribution: {
                proactive: 50,
                reactive: 50,
            },
        });
    }
}
exports.ABTesting = ABTesting;
// ── Singleton Instance ─────────────────────────────────────────────────────────
let abTesting = null;
function getABTesting() {
    if (!abTesting) {
        abTesting = new ABTesting();
    }
    return abTesting;
}
exports.default = ABTesting;
//# sourceMappingURL=abTesting.js.map