"use strict";
// ── Analytics Module ─────────────────────────────────────────────────────────────
// Learning and improvement system for AI chat
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsEventTracker = exports.resetAnalyticsService = exports.getAnalyticsService = exports.AnalyticsService = exports.extractKeywords = exports.normalizeText = exports.detectIntent = exports.ConversationOutcomeTracker = exports.ImprovementRecommender = exports.ResponseQualityAnalyzer = exports.KnowledgeGapDetector = exports.PatternAnalyzer = exports.resetLearningSystem = exports.getLearningSystem = exports.LearningSystem = void 0;
// Types
__exportStar(require("./types"), exports);
// Learning Engine
var learningEngine_1 = require("./learningEngine");
Object.defineProperty(exports, "LearningSystem", { enumerable: true, get: function () { return learningEngine_1.LearningSystem; } });
Object.defineProperty(exports, "getLearningSystem", { enumerable: true, get: function () { return learningEngine_1.getLearningSystem; } });
Object.defineProperty(exports, "resetLearningSystem", { enumerable: true, get: function () { return learningEngine_1.resetLearningSystem; } });
Object.defineProperty(exports, "PatternAnalyzer", { enumerable: true, get: function () { return learningEngine_1.PatternAnalyzer; } });
Object.defineProperty(exports, "KnowledgeGapDetector", { enumerable: true, get: function () { return learningEngine_1.KnowledgeGapDetector; } });
Object.defineProperty(exports, "ResponseQualityAnalyzer", { enumerable: true, get: function () { return learningEngine_1.ResponseQualityAnalyzer; } });
Object.defineProperty(exports, "ImprovementRecommender", { enumerable: true, get: function () { return learningEngine_1.ImprovementRecommender; } });
Object.defineProperty(exports, "ConversationOutcomeTracker", { enumerable: true, get: function () { return learningEngine_1.ConversationOutcomeTracker; } });
Object.defineProperty(exports, "detectIntent", { enumerable: true, get: function () { return learningEngine_1.detectIntent; } });
Object.defineProperty(exports, "normalizeText", { enumerable: true, get: function () { return learningEngine_1.normalizeText; } });
Object.defineProperty(exports, "extractKeywords", { enumerable: true, get: function () { return learningEngine_1.extractKeywords; } });
// Analytics Service
var service_1 = require("./service");
Object.defineProperty(exports, "AnalyticsService", { enumerable: true, get: function () { return service_1.AnalyticsService; } });
Object.defineProperty(exports, "getAnalyticsService", { enumerable: true, get: function () { return service_1.getAnalyticsService; } });
Object.defineProperty(exports, "resetAnalyticsService", { enumerable: true, get: function () { return service_1.resetAnalyticsService; } });
Object.defineProperty(exports, "AnalyticsEventTracker", { enumerable: true, get: function () { return service_1.AnalyticsEventTracker; } });
//# sourceMappingURL=index.js.map