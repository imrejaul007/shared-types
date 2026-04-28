import { EventTriggerManager, NotificationPayload } from './eventTriggers';
export interface TriggerWorkerConfig {
    pollIntervalMs?: number;
    batchSize?: number;
}
export declare class TriggerWorker {
    private manager;
    private intervalId;
    private isRunning;
    private pollIntervalMs;
    constructor(manager: EventTriggerManager, config?: TriggerWorkerConfig);
    sendPushNotification(payload: NotificationPayload): Promise<boolean>;
    sendSMS(payload: NotificationPayload): Promise<boolean>;
    sendEmail(payload: NotificationPayload): Promise<boolean>;
    start(): void;
    stop(): void;
    private processEvents;
}
export declare function startTriggerWorker(config?: TriggerWorkerConfig): TriggerWorker;
export declare function stopTriggerWorker(): void;
export declare function getTriggerWorker(): TriggerWorker | null;
export default TriggerWorker;
//# sourceMappingURL=triggerWorker.d.ts.map