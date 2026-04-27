interface AutonomousConfig {
    enabled: boolean;
    dangerousMode: boolean;
    maxConcurrentAgents: number;
    allowWalletOperations: boolean;
    allowPriceAdjustments: boolean;
    allowAutoRevival: boolean;
    allowBudgetReallocation: boolean;
    allowStrategyPause: boolean;
    emergencyStopThreshold: number;
    heartbeatIntervalMs: number;
}
export declare class AutonomousOrchestrator {
    private running;
    private config;
    private actionCount;
    private heartbeatInterval;
    private agentIntervals;
    constructor(config?: Partial<AutonomousConfig>);
    enableFullAutonomy(): Promise<void>;
    disableAutonomy(): Promise<void>;
    emergencyStop(reason: string): Promise<void>;
    startAllAgents(): Promise<void>;
    private startAgent;
    private runAgent;
    private getAgentInterval;
    private startHeartbeat;
    private performHeartbeat;
    executeDangerousAction(actionType: string, payload: Record<string, unknown>, agentName: string): Promise<boolean>;
    getStatus(): Promise<{
        running: boolean;
        autonomous: boolean;
        agentCount: number;
        healthyAgents: number;
        actionCount: number;
        config: AutonomousConfig;
    }>;
    stop(): Promise<void>;
}
export declare function getAutonomousOrchestrator(): AutonomousOrchestrator;
export declare function startAutonomousMode(): Promise<void>;
export declare function stopAutonomousMode(): Promise<void>;
export declare function executeAutonomousAction(actionType: 'adjust_price' | 'send_nudge' | 'pause_strategy' | 'trigger_revival' | 'alert_support', payload: Record<string, unknown>): Promise<boolean>;
export {};
//# sourceMappingURL=autonomous-orchestrator.d.ts.map