import type { AgentResult, AgentHealth } from './types.js';
export interface DangerousModeConfig {
    enabled: boolean;
    skipPermission: boolean;
    allowWalletOperations: boolean;
    allowPriceAdjustments: boolean;
    allowStrategyPause: boolean;
    allowBudgetReallocation: boolean;
    allowAutoRevival: boolean;
    maxConsecutiveActions: number;
    emergencyStop: boolean;
}
export interface SwarmStatus {
    totalAgents: number;
    healthy: number;
    degraded: number;
    failed: number;
    agents: AgentHealth[];
    dangerousMode?: DangerousModeConfig;
    consecutiveActions?: number;
}
export declare function startAllAgents(): void;
export declare function stopAllAgents(): void;
export declare function getSwarmStatus(): Promise<SwarmStatus>;
export declare function runAgent(agentName: string): Promise<AgentResult | null>;
export declare function runAllAgentsOnce(): Promise<AgentResult[]>;
export declare class SwarmCoordinator {
    private running;
    private consecutiveActions;
    private dangerousMode;
    start(): void;
    stop(): void;
    status(): Promise<SwarmStatus>;
    runAgent(agentName: string): Promise<AgentResult | null>;
    runAll(): Promise<AgentResult[]>;
    isRunning(): boolean;
    /**
     * Enable dangerous mode with skip-permission capabilities
     * DANGEROUS: Agents will execute actions without user confirmation
     */
    enableDangerousMode(config?: Partial<DangerousModeConfig>): void;
    /**
     * Disable dangerous mode
     */
    disableDangerousMode(): void;
    /**
     * Get current dangerous mode status
     */
    getDangerousMode(): DangerousModeConfig;
    /**
     * Check if agent can execute dangerous action
     */
    canExecuteDangerousAction(actionType: keyof DangerousModeConfig): boolean;
    /**
     * Record executed dangerous action
     */
    recordDangerousAction(): void;
    /**
     * Emergency stop - halts all dangerous operations immediately
     */
    emergencyStop(): void;
    /**
     * Reset emergency stop and restore operations
     */
    resetEmergencyStop(): void;
    /**
     * Quick enable for autonomous operations
     * Enables all dangerous capabilities at once
     */
    enableFullAutonomy(): void;
}
export declare function getSwarmCoordinator(): SwarmCoordinator;
export declare function enableDangerousMode(config?: Partial<DangerousModeConfig>): void;
export declare function disableDangerousMode(): void;
export declare function enableFullAutonomy(): void;
export declare function emergencyStop(): void;
export declare function isDangerousModeEnabled(): boolean;
//# sourceMappingURL=swarm-coordinator.d.ts.map