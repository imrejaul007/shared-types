export interface TEEConfig {
    enclaveType: 'sgx' | 'trustzone' | 'sev' | 'simulated';
    attestationEnabled: boolean;
    memoryProtectionEnabled: boolean;
    sealedDataPath?: string;
}
export interface AttestationQuote {
    version: number;
    signature: string;
    measurement: string;
    timestamp: Date;
    enclaveType: string;
}
export declare class SecureMemory {
    private buffer;
    private isLocked;
    constructor(size: number);
    private lock;
    write(data: Buffer, offset?: number): void;
    read(length: number, offset?: number): Buffer;
    clear(): void;
    getSize(): number;
}
export interface SealedData {
    ciphertext: string;
    iv: string;
    authTag: string;
    sealedKey: string;
    enclaveMeasurement: string;
}
export declare class TEESealProvider {
    private sealingKey;
    private enclaveMeasurement;
    constructor(config: TEEConfig);
    private generateEnclaveMeasurement;
    seal(data: Buffer, additionalData?: Buffer): SealedData;
    unseal(sealed: SealedData): Buffer;
    private sealWithHardwareKey;
    private unsealWithHardwareKey;
    getEnclaveMeasurement(): string;
    generateAttestationQuote(userData?: Buffer): Promise<AttestationQuote>;
}
export declare class TEEProtectedCredentials {
    private sealProvider;
    private cachedCredentials;
    constructor(config: TEEConfig);
    storeCredential(keyName: string, credential: string): SealedData;
    getCredential(keyName: string): string | null;
    removeCredential(keyName: string): void;
    verifyAttestation(userData?: Buffer): Promise<boolean>;
}
export declare const TEE_ENVIRONMENTS: Record<string, TEEConfig>;
export declare function getTEEConfig(): TEEConfig;
export declare class TEESessionManager {
    private sessionKeys;
    private sealProvider;
    private readonly MAX_SESSIONS;
    private readonly SESSION_TTL_MS;
    constructor(config?: TEEConfig);
    createSession(sessionId: string, sessionData: Record<string, unknown>): void;
    getSession(sessionId: string): Record<string, unknown> | null;
    updateSession(sessionId: string, updates: Partial<Record<string, unknown>>): void;
    destroySession(sessionId: string): void;
    private cleanupExpiredSessions;
    getActiveSessionCount(): number;
}
export interface TEEContext {
    sessionId: string;
    enclaveMeasurement: string;
    attestationQuote: AttestationQuote | null;
    credentials: TEEProtectedCredentials;
    sessionManager: TEESessionManager;
}
export declare function initializeTEEContext(config?: TEEConfig): TEEContext;
export declare function getTEEContext(): TEEContext | null;
export declare function destroyTEEContext(): void;
//# sourceMappingURL=tee.d.ts.map