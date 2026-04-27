import type { DemandSignal, ScarcitySignal, OptimizationRecommendation, RevenueReport } from './types.js';
export type ActionType = 'send_nudge' | 'send_urgency_nudge' | 'update_merchant_dashboard' | 'adjust_price' | 'pause_strategy' | 'alert_support' | 'trigger_revival' | 'pause_nudge_campaign' | 'reallocate_budget' | 'retrain_model' | 'threshold_adjust' | 'charge_wallet' | 'refund_wallet' | 'send_to_pms' | 'send_to_merchant_os' | 'route_to_task_queue' | 'update_order_status' | 'send_staff_notification';
export interface Action {
    type: ActionType;
    target: string;
    payload: unknown;
    agent: string;
    skipPermission: boolean;
    risk: 'low' | 'medium' | 'high' | 'critical';
    executedAt?: Date;
    success?: boolean;
}
declare class ActionExecutor {
    private actionHistory;
    private dailyNudgeCounts;
    execute(action: Action): Promise<boolean>;
    private sendNudge;
    private sendUrgencyNudge;
    private updateMerchantDashboard;
    private adjustPrice;
    private pauseStrategy;
    private alertSupport;
    private triggerRevival;
    private pauseNudgeCampaign;
    private reallocateBudget;
    private retrainModel;
    private chargeWallet;
    private refundWallet;
    private sendToPMS;
    private sendToMerchantOS;
    private routeToTaskQueue;
    private updateOrderStatus;
    private sendStaffNotification;
    getHistory(limit?: number): Action[];
    resetDailyCounts(): void;
}
declare const actionExecutor: ActionExecutor;
export declare function handleDemandSignalAction(signal: DemandSignal): Promise<void>;
export declare function handleScarcitySignalAction(signal: ScarcitySignal): Promise<void>;
export declare function handleOptimizationAction(recommendation: OptimizationRecommendation): Promise<void>;
export declare function handleRevenueDropAction(report: RevenueReport, previousReport: RevenueReport): Promise<void>;
export declare function triggerAutoRevival(userId: string, dormantIntentId: string, message: string): Promise<boolean>;
export declare function getActionCircuitBreakerStatus(): Record<string, {
    status: string;
    failures: number;
}>;
export declare function resetActionCircuitBreaker(actionType?: string): void;
export { actionExecutor };
//# sourceMappingURL=action-trigger.d.ts.map