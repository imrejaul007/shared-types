// ── Agent Index ─────────────────────────────────────────────────────────────────
// Public exports for all agent modules

// Types
export * from './types.js';

// Shared Memory
export { SharedMemory, sharedMemory } from './shared-memory.js';

// Individual Agents
export {
  runDemandSignalAgent,
  startDemandSignalCron,
  stopDemandSignalCron,
  demandSignalAgentConfig,
  getMerchantDemand,
} from './demand-signal-agent.js';

export {
  runScarcityAgent,
  startScarcityCron,
  stopScarcityCron,
  scarcityAgentConfig,
  updateInventory,
  getScarcityForDemandSignal,
} from './scarcity-agent.js';

export {
  runPersonalizationAgent,
  startPersonalizationCron,
  stopPersonalizationCron,
  personalizationAgentConfig,
  processNudgeEvent,
  selectOptimalVariant,
  getUserPersonalizationProfile,
} from './personalization-agent.js';

export {
  runAttributionAgent,
  startAttributionCron,
  stopAttributionCron,
  attributionAgentConfig,
  recordTouchpoint,
  calculateAttribution,
  detectOrganicVsInfluenced,
  calculateIncrementality,
} from './attribution-agent.js';

export {
  runAdaptiveScoringAgent,
  startAdaptiveScoringCron,
  stopAdaptiveScoringCron,
  adaptiveScoringAgentConfig,
  scoreIntentById,
  scoreIntents,
  retrainModel,
  getCurrentWeights,
} from './adaptive-scoring-agent.js';

export {
  runFeedbackLoopAgent,
  startFeedbackLoopCron,
  stopFeedbackLoopCron,
  feedbackLoopAgentConfig,
  handleAlert,
  getAgentHealth,
} from './feedback-loop-agent.js';

export {
  runNetworkEffectAgent,
  startNetworkEffectCron,
  stopNetworkEffectCron,
  networkEffectAgentConfig,
  findSimilarUsers,
  getCollaborativeRecommendations,
  generateCollaborativeSignal,
  getCollaborativeSignalForUser,
} from './network-effect-agent.js';

export {
  runRevenueAttributionAgent,
  startRevenueAttributionCron,
  stopRevenueAttributionCron,
  revenueAttributionAgentConfig,
  generateRevenueReport,
  getLatestReport,
} from './revenue-attribution-agent.js';

// Swarm Coordinator
export {
  SwarmCoordinator,
  getSwarmCoordinator,
  startAllAgents,
  stopAllAgents,
  getSwarmStatus,
  runAgent,
  runAllAgentsOnce,
} from './swarm-coordinator.js';

// Types re-exports
export type {
  DemandSignal,
  ScarcitySignal,
  UserResponseProfile,
  AttributionRecord,
  ScoredIntent,
  OptimizationRecommendation,
  CollaborativeSignal,
  RevenueReport,
  Touchpoint,
  AgentConfig,
  AgentResult,
  AgentHealth,
  AgentMessage,
} from './types.js';

// Re-export NudgeVariant
export { NudgeVariant } from './types.js';
