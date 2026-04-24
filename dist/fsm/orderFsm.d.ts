import { OrderStatus } from '../enums/index';
export declare const ORDER_STATE_TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>>;
export declare function isValidOrderTransition(from: OrderStatus, to: OrderStatus): boolean;
export declare function assertValidOrderTransition(from: OrderStatus, to: OrderStatus): void;
export declare function getValidNextOrderStates(from: OrderStatus): readonly OrderStatus[];
export declare function isTerminalOrderStatus(status: OrderStatus): boolean;
export declare const ORDER_ACTIVE_STATES: ReadonlySet<OrderStatus>;
export declare const ORDER_CANCELLABLE_STATES: ReadonlySet<OrderStatus>;
export declare function canOrderBeCancelled(status: OrderStatus): boolean;
//# sourceMappingURL=orderFsm.d.ts.map