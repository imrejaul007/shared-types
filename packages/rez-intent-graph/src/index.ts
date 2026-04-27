// ── ReZ Mind ───────────────────────────────────────────────────────────────────
// AI-powered commerce intelligence platform
// RTMN Commerce Memory + ReZ Agent OS combined
// DANGEROUS: Full autonomous mode with skip-permission capabilities

// Types
export * from './types/intent.js';

// ── Agent Swarm ────────────────────────────────────────────────────────────────
// 8 autonomous agents for commerce intelligence
export * from './agents/index.js';

// Services
export { IntentCaptureService, intentCaptureService } from './services/IntentCaptureService.js';
export { IntentScoringService, intentScoringService } from './services/IntentScoringService.js';
export { DormantIntentService, dormantIntentService } from './services/DormantIntentService.js';
export { CrossAppAggregationService, crossAppAggregationService } from './services/CrossAppAggregationService.js';
export { nudgeQueue, createNudgeJob } from './services/nudge-queue.js';

// Prisma Client
export { prismaClient } from './services/prisma-client.js';

// Nudge Delivery
export { NudgeDeliveryService, nudgeDeliveryService } from './nudge/NudgeDeliveryService.js';
export type { Nudge, NudgeChannel, NudgeStatus, NudgeTemplate, NudgeChannelHandler } from './nudge/NudgeDeliveryService.js';

// Revival Triggers
export {
  handlePriceDropTrigger,
  handleReturnUserTrigger,
  handleSeasonalityTrigger,
  handleOfferMatchTrigger,
  handleManualTrigger,
  handleBulkTrigger,
} from './triggers/revivalTriggers.js';
export type { TriggerType, TriggerResult } from './triggers/revivalTriggers.js';

// API Routes
export { default as intentRouter } from './api/intent.routes.js';
export { default as commerceMemoryRouter } from './api/commerce-memory.routes.js';

// Webhooks
export {
  handleHotelSearch,
  handleHotelHold,
  handleHotelConfirm,
  handleRestaurantView,
  handleAddToCart,
  handleOrderPlaced,
  handleNudgeDelivered,
  handleNudgeClicked,
  handleNudgeConverted,
  handleBatchCapture,
} from './api/webhooks.js';

// Integrations
export { hotelOtaIntegration } from './integrations/hotelOtaIntegration.js';
export { rezNowIntegration } from './integrations/rezNowIntegration.js';

// Middleware
export { intentCaptureMiddleware } from './middleware/intentMiddleware.js';

// Jobs
export { DormantIntentCronJob } from './jobs/dormantIntentCron.js';

// Agent Server
export { startAgentServer } from './server/agent-server.js';

// Action Triggers (for testing)
export { actionExecutor, handleDemandSignalAction, handleScarcitySignalAction, handleOptimizationAction, triggerAutoRevival } from './agents/action-trigger.js';
