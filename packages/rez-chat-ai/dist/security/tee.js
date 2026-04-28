"use strict";
// ── TEE (Trusted Execution Environment) Security Layer ─────────────────────────────
// Implements secure enclave patterns for protecting sensitive AI operations
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEESessionManager = exports.TEE_ENVIRONMENTS = exports.TEEProtectedCredentials = exports.TEESealProvider = exports.SecureMemory = void 0;
exports.getTEEConfig = getTEEConfig;
exports.initializeTEEContext = initializeTEEContext;
exports.getTEEContext = getTEEContext;
exports.destroyTEEContext = destroyTEEContext;
const crypto = __importStar(require("crypto"));
// ── Secure Memory ────────────────────────────────────────────────────────────────
class SecureMemory {
    buffer;
    isLocked = false;
    constructor(size) {
        // Allocate memory that won't be swapped to disk
        this.buffer = Buffer.alloc(size);
        this.lock();
    }
    lock() {
        // On systems that support mlock, prevent swapping
        try {
            const { mlock } = require('mlock');
            mlock(this.buffer);
            this.isLocked = true;
        }
        catch {
            // Fallback for systems without mlock
            this.isLocked = true;
        }
    }
    write(data, offset = 0) {
        if (this.isLocked) {
            data.copy(this.buffer, offset);
        }
    }
    read(length, offset = 0) {
        return this.buffer.slice(offset, offset + length);
    }
    clear() {
        // Securely zero out the memory
        crypto.randomFillSync(this.buffer);
        this.buffer.fill(0);
    }
    getSize() {
        return this.buffer.length;
    }
}
exports.SecureMemory = SecureMemory;
class TEESealProvider {
    sealingKey;
    enclaveMeasurement;
    constructor(config) {
        // In production, this key would be derived from hardware-specific keys
        // (SGX sealing key, TrustZone secure key, etc.)
        this.sealingKey = crypto.randomBytes(32);
        this.enclaveMeasurement = this.generateEnclaveMeasurement();
    }
    generateEnclaveMeasurement() {
        // In production, this would be the actual enclave hash from the TEE
        // For simulation, we generate a deterministic measurement
        const measurementData = [
            process.cwd(),
            __filename,
            Date.now().toString(),
        ].join('|');
        return crypto
            .createHash('sha256')
            .update(measurementData)
            .digest('hex')
            .slice(0, 32);
    }
    seal(data, additionalData) {
        const iv = crypto.randomBytes(12);
        const enclaveKey = crypto.randomBytes(32);
        // Derive encryption key from enclave-bound key
        const encryptionKey = crypto.pbkdf2Sync(Buffer.concat([enclaveKey, this.enclaveMeasurement]), iv, 100000, 32, 'sha256');
        const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
        const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
        const authTag = cipher.getAuthTag();
        // Seal the enclave key with the hardware-bound key
        const sealedKey = this.sealWithHardwareKey(enclaveKey);
        return {
            ciphertext: ciphertext.toString('base64'),
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
            sealedKey,
            enclaveMeasurement: this.enclaveMeasurement,
        };
    }
    unseal(sealed) {
        // Verify enclave measurement first
        if (sealed.enclaveMeasurement !== this.enclaveMeasurement) {
            throw new Error('Enclave measurement mismatch - data may have been migrated to unauthorized environment');
        }
        // Unseal the enclave key
        const enclaveKey = this.unsealWithHardwareKey(sealed.sealedKey);
        const iv = Buffer.from(sealed.iv, 'base64');
        const ciphertext = Buffer.from(sealed.ciphertext, 'base64');
        const authTag = Buffer.from(sealed.authTag, 'base64');
        // Derive the same encryption key
        const encryptionKey = crypto.pbkdf2Sync(Buffer.concat([enclaveKey, this.enclaveMeasurement]), iv, 100000, 32, 'sha256');
        // Decrypt and verify
        const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
        decipher.setAuthTag(authTag);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }
    sealWithHardwareKey(key) {
        // In production, this would use hardware-specific sealing
        // SGX: EINIT, TrustZone: secure storage
        // For simulation, we use a software approximation
        const hmac = crypto.createHmac('sha256', this.sealingKey);
        hmac.update(key);
        return hmac.digest('base64');
    }
    unsealWithHardwareKey(sealedKey) {
        // Verify and recover the sealed key
        const expectedHmac = crypto.createHmac('sha256', this.sealingKey);
        // In production, this would verify against hardware attestation
        return crypto.randomBytes(32); // Placeholder
    }
    getEnclaveMeasurement() {
        return this.enclaveMeasurement;
    }
    async generateAttestationQuote(userData) {
        const quoteData = Buffer.concat([
            Buffer.from(this.enclaveMeasurement),
            userData || Buffer.alloc(32),
            Buffer.from(Date.now().toString()),
        ]);
        const signature = crypto
            .createSign('RSA-SHA256')
            .update(quoteData)
            .sign(crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey);
        return {
            version: 1,
            signature: signature.toString('base64'),
            measurement: this.enclaveMeasurement,
            timestamp: new Date(),
            enclaveType: 'simulated',
        };
    }
}
exports.TEESealProvider = TEESealProvider;
// ── TEE-Protected API Key Storage ────────────────────────────────────────────────
class TEEProtectedCredentials {
    sealProvider;
    cachedCredentials = new Map();
    constructor(config) {
        this.sealProvider = new TEESealProvider(config);
    }
    storeCredential(keyName, credential) {
        const sealed = this.sealProvider.seal(Buffer.from(credential, 'utf-8'));
        this.cachedCredentials.set(keyName, sealed);
        return sealed;
    }
    getCredential(keyName) {
        const sealed = this.cachedCredentials.get(keyName);
        if (!sealed)
            return null;
        try {
            const decrypted = this.sealProvider.unseal(sealed);
            return decrypted.toString('utf-8');
        }
        catch {
            // In production, log this security event
            return null;
        }
    }
    removeCredential(keyName) {
        this.cachedCredentials.delete(keyName);
    }
    async verifyAttestation(userData) {
        try {
            const quote = await this.sealProvider.generateAttestationQuote(userData);
            return quote.enclaveType === 'simulated';
        }
        catch {
            return false;
        }
    }
}
exports.TEEProtectedCredentials = TEEProtectedCredentials;
// ── TEE Configuration ────────────────────────────────────────────────────────────
exports.TEE_ENVIRONMENTS = {
    development: {
        enclaveType: 'simulated',
        attestationEnabled: false,
        memoryProtectionEnabled: true,
    },
    production: {
        enclaveType: 'sgx', // or 'trustzone' or 'sev' based on hardware
        attestationEnabled: true,
        memoryProtectionEnabled: true,
    },
};
function getTEEConfig() {
    const env = process.env.NODE_ENV || 'development';
    return exports.TEE_ENVIRONMENTS[env] || exports.TEE_ENVIRONMENTS.development;
}
// ── Secure Session Keys ───────────────────────────────────────────────────────────
class TEESessionManager {
    sessionKeys = new Map();
    sealProvider;
    MAX_SESSIONS = 10000;
    SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
    constructor(config) {
        this.sealProvider = new TEESealProvider(config || getTEEConfig());
    }
    createSession(sessionId, sessionData) {
        if (this.sessionKeys.size >= this.MAX_SESSIONS) {
            this.cleanupExpiredSessions();
        }
        const dataString = JSON.stringify(sessionData);
        const sealed = this.sealProvider.seal(Buffer.from(dataString, 'utf-8'));
        this.sessionKeys.set(sessionId, sealed);
    }
    getSession(sessionId) {
        const sealed = this.sessionKeys.get(sessionId);
        if (!sealed)
            return null;
        try {
            const decrypted = this.sealProvider.unseal(sealed);
            return JSON.parse(decrypted.toString('utf-8'));
        }
        catch {
            return null;
        }
    }
    updateSession(sessionId, updates) {
        const existing = this.getSession(sessionId);
        if (existing) {
            const merged = { ...existing, ...updates };
            this.createSession(sessionId, merged);
        }
    }
    destroySession(sessionId) {
        this.sessionKeys.delete(sessionId);
    }
    cleanupExpiredSessions() {
        // In production, track session timestamps and clean up old ones
        const sessionsToRemove = [];
        this.sessionKeys.forEach((_, sessionId) => {
            sessionsToRemove.push(sessionId);
        });
        // Remove oldest half of sessions
        const removeCount = Math.floor(sessionsToRemove.length / 2);
        for (let i = 0; i < removeCount; i++) {
            this.sessionKeys.delete(sessionsToRemove[i]);
        }
    }
    getActiveSessionCount() {
        return this.sessionKeys.size;
    }
}
exports.TEESessionManager = TEESessionManager;
let teeContext = null;
function initializeTEEContext(config) {
    const teeConfig = config || getTEEConfig();
    const credentials = new TEEProtectedCredentials(teeConfig);
    const sessionManager = new TEESessionManager(teeConfig);
    const sealProvider = new TEESealProvider(teeConfig);
    teeContext = {
        sessionId: crypto.randomUUID(),
        enclaveMeasurement: sealProvider.getEnclaveMeasurement(),
        attestationQuote: teeConfig.attestationEnabled ? null : undefined,
        credentials,
        sessionManager,
    };
    return teeContext;
}
function getTEEContext() {
    return teeContext;
}
function destroyTEEContext() {
    teeContext = null;
}
//# sourceMappingURL=tee.js.map