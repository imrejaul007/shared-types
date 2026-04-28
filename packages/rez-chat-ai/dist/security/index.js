"use strict";
// ── Security Module ─────────────────────────────────────────────────────────────────
// TEE and secure execution layer for AI chat
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCustomerContext = exports.defaultSanitizer = exports.transactionSanitizer = exports.idSanitizer = exports.phoneSanitizer = exports.emailSanitizer = exports.cardNumberSanitizer = exports.sensitiveDataSanitizer = exports.DataSanitizer = exports.TEE_ENVIRONMENTS = exports.destroyTEEContext = exports.initializeTEEContext = exports.getTEEContext = exports.getTEEConfig = exports.TEESessionManager = exports.TEEProtectedCredentials = exports.TEESealProvider = exports.SecureMemory = void 0;
var tee_1 = require("./tee");
Object.defineProperty(exports, "SecureMemory", { enumerable: true, get: function () { return tee_1.SecureMemory; } });
Object.defineProperty(exports, "TEESealProvider", { enumerable: true, get: function () { return tee_1.TEESealProvider; } });
Object.defineProperty(exports, "TEEProtectedCredentials", { enumerable: true, get: function () { return tee_1.TEEProtectedCredentials; } });
Object.defineProperty(exports, "TEESessionManager", { enumerable: true, get: function () { return tee_1.TEESessionManager; } });
Object.defineProperty(exports, "getTEEConfig", { enumerable: true, get: function () { return tee_1.getTEEConfig; } });
Object.defineProperty(exports, "getTEEContext", { enumerable: true, get: function () { return tee_1.getTEEContext; } });
Object.defineProperty(exports, "initializeTEEContext", { enumerable: true, get: function () { return tee_1.initializeTEEContext; } });
Object.defineProperty(exports, "destroyTEEContext", { enumerable: true, get: function () { return tee_1.destroyTEEContext; } });
Object.defineProperty(exports, "TEE_ENVIRONMENTS", { enumerable: true, get: function () { return tee_1.TEE_ENVIRONMENTS; } });
var sanitize_1 = require("../sanitizers/sanitize");
Object.defineProperty(exports, "DataSanitizer", { enumerable: true, get: function () { return sanitize_1.DataSanitizer; } });
Object.defineProperty(exports, "sensitiveDataSanitizer", { enumerable: true, get: function () { return sanitize_1.sensitiveDataSanitizer; } });
Object.defineProperty(exports, "cardNumberSanitizer", { enumerable: true, get: function () { return sanitize_1.cardNumberSanitizer; } });
Object.defineProperty(exports, "emailSanitizer", { enumerable: true, get: function () { return sanitize_1.emailSanitizer; } });
Object.defineProperty(exports, "phoneSanitizer", { enumerable: true, get: function () { return sanitize_1.phoneSanitizer; } });
Object.defineProperty(exports, "idSanitizer", { enumerable: true, get: function () { return sanitize_1.idSanitizer; } });
Object.defineProperty(exports, "transactionSanitizer", { enumerable: true, get: function () { return sanitize_1.transactionSanitizer; } });
Object.defineProperty(exports, "defaultSanitizer", { enumerable: true, get: function () { return sanitize_1.defaultSanitizer; } });
Object.defineProperty(exports, "sanitizeCustomerContext", { enumerable: true, get: function () { return sanitize_1.sanitizeCustomerContext; } });
//# sourceMappingURL=index.js.map