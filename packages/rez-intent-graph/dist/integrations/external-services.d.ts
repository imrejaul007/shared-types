export interface WalletTransaction {
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
    coinType?: 'rez' | 'prive' | 'branded' | 'promo' | 'cashback' | 'referral';
    description: string;
    referenceId?: string;
    referenceType?: 'order' | 'nudge' | 'refund' | 'bonus';
}
export interface WalletBalance {
    userId: string;
    total: number;
    available: number;
    pending: number;
    cashback: number;
    coins: Array<{
        type: string;
        amount: number;
    }>;
}
/**
 * Charge user wallet (Debit) via real HTTP call
 */
export declare function chargeWallet(userId: string, amount: number, description: string, options?: {
    coinType?: 'rez' | 'prive' | 'branded' | 'promo' | 'cashback' | 'referral';
    referenceId?: string;
    referenceType?: 'order' | 'nudge' | 'refund' | 'bonus';
}): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
}>;
/**
 * Credit user wallet (Refund/Bonus) via real HTTP call
 */
export declare function creditWallet(userId: string, amount: number, description: string, options?: {
    coinType?: 'rez' | 'prive' | 'branded' | 'promo' | 'cashback' | 'referral';
    referenceId?: string;
    referenceType?: 'order' | 'nudge' | 'refund' | 'bonus';
}): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
}>;
/**
 * Get user wallet balance via real HTTP call
 */
export declare function getWalletBalance(userId: string): Promise<WalletBalance | null>;
export interface OrderItem {
    itemId?: string;
    name: string;
    quantity: number;
    price: number;
}
export interface CreateOrderParams {
    userId: string;
    storeId: string;
    items: OrderItem[];
    deliveryType?: 'pickup' | 'delivery';
    deliveryAddress?: Record<string, unknown>;
    paymentMethod?: string;
    currency?: string;
}
export interface OrderResult {
    success: boolean;
    orderId?: string;
    status?: string;
    total?: number;
    error?: string;
}
/**
 * Create order in order service via real HTTP call
 */
export declare function createOrder(params: CreateOrderParams): Promise<OrderResult>;
/**
 * Update order status via real HTTP call
 */
export declare function updateOrderStatus(orderId: string, status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled'): Promise<{
    success: boolean;
    error?: string;
}>;
export interface PMSGuestRequest {
    hotelId: string;
    guestId: string;
    roomNumber: string;
    requestType: 'room_service' | 'housekeeping' | 'concierge' | 'minibar' | 'checkout';
    items: Array<{
        name: string;
        quantity: number;
        price?: number;
    }>;
    notes?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    [key: string]: unknown;
}
/**
 * Submit guest request to PMS via HTTP (when PMS service is available)
 * Falls back to shared memory pub/sub if service unavailable
 */
export declare function submitGuestRequest(request: PMSGuestRequest): Promise<{
    success: boolean;
    requestId?: string;
    error?: string;
}>;
export interface TaskAssignment {
    department: 'housekeeping' | 'concierge' | 'maintenance' | 'kitchen' | 'front_desk';
    taskType: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Create task in operational queue via shared memory pub/sub
 * (Task queue is typically consumed by dedicated operational services)
 */
export declare function createTask(task: TaskAssignment): Promise<{
    success: boolean;
    taskId?: string;
    error?: string;
}>;
export interface StaffNotification {
    staffId?: string;
    department: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    actionRequired?: string;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Send notification to staff via shared memory pub/sub
 */
export declare function sendStaffNotification(notification: StaffNotification): Promise<{
    success: boolean;
    notificationId?: string;
    error?: string;
}>;
/**
 * Send push notification to user via shared memory pub/sub
 */
export declare function sendUserNotification(userId: string, title: string, body: string, data?: Record<string, unknown>): Promise<{
    success: boolean;
    notificationId?: string;
    error?: string;
}>;
export interface MerchantOrder {
    merchantId: string;
    orderId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    customerId: string;
    deliveryType?: 'pickup' | 'delivery';
}
/**
 * Send order to merchant OS via shared memory pub/sub
 */
export declare function sendToMerchantOS(order: MerchantOrder): Promise<{
    success: boolean;
    merchantOrderId?: string;
    error?: string;
}>;
/**
 * Complete Room QR flow:
 * 1. Charge wallet (if chargeable items)
 * 2. Submit PMS request
 * 3. Create task
 * 4. Notify staff
 * 5. Update memory
 */
export declare function executeRoomServiceFlow(guestId: string, roomNumber: string, hotelId: string, items: Array<{
    name: string;
    quantity: number;
    price: number;
}>, complimentaryItems?: string[]): Promise<{
    success: boolean;
    walletTransactionId?: string;
    pmsRequestId?: string;
    taskId?: string;
    notificationId?: string;
    totalCharged?: number;
    error?: string;
}>;
/**
 * Complete shopping flow:
 * 1. Charge wallet
 * 2. Create order
 * 3. Send to merchant OS
 * 4. Update memory
 */
export declare function executeShoppingFlow(userId: string, storeId: string, merchantId: string, items: Array<{
    name: string;
    quantity: number;
    price: number;
    productId?: string;
}>): Promise<{
    success: boolean;
    orderId?: string;
    merchantOrderId?: string;
    total?: number;
    error?: string;
}>;
export interface UserValidationResult {
    valid: boolean;
    userId?: string;
    error?: string;
}
/**
 * Validate internal service token
 */
export declare function validateInternalToken(token: string): Promise<boolean>;
/**
 * Get user info from auth service
 */
export declare function getUserFromToken(token: string): Promise<{
    userId: string;
    phone?: string;
} | null>;
export interface ServiceHealthStatus {
    name: string;
    healthy: boolean;
    circuitBreakerStatus: 'closed' | 'open' | 'half-open';
    failureCount: number;
    lastFailure: number | null;
}
export declare function checkServiceHealth(service: string): Promise<boolean>;
export declare function getAllServiceHealth(): Promise<Record<string, boolean>>;
/**
 * Get detailed circuit breaker status for all services
 */
export declare function getCircuitBreakerStatus(): ServiceHealthStatus[];
/**
 * Reset circuit breaker for a service (admin operation)
 */
export declare function resetCircuitBreaker(serviceName: string): boolean;
/**
 * Force open circuit breaker for a service (admin operation)
 */
export declare function forceOpenCircuitBreaker(serviceName: string): boolean;
//# sourceMappingURL=external-services.d.ts.map