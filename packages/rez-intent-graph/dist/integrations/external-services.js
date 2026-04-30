// ── External Service Integrations ─────────────────────────────────────────────────
// Real integrations with ReZ ecosystem services via HTTP API
// Connects intent-graph to wallet, order, payment, and operational services
// Includes retry + circuit breaker for resilient autonomous operations
import crypto from 'crypto';
import { sharedMemory } from '../agents/shared-memory.js';
import { SERVICE_URLS } from '../config/services.js';
const logger = {
    info: (msg, meta) => console.log(`[ExternalServices] ${msg}`, meta || ''),
    warn: (msg, meta) => console.warn(`[ExternalServices] ${msg}`, meta || ''),
    error: (msg, meta) => console.error(`[ExternalServices] ${msg}`, meta || ''),
};
// ── Service URLs — sourced from src/config/services.ts ──────────────────────────────
const SERVICES = SERVICE_URLS;
const circuitBreakers = new Map();
const CIRCUIT_BREAKER_CONFIG = {
    failureThreshold: 5, // Open circuit after 5 failures
    resetTimeoutMs: 60000, // Try again after 60 seconds
    halfOpenSuccessThreshold: 2, // Need 2 successes to close circuit
};
function getCircuitBreaker(serviceName) {
    if (!circuitBreakers.has(serviceName)) {
        circuitBreakers.set(serviceName, { failures: 0, lastFailure: 0, status: 'closed' });
    }
    return circuitBreakers.get(serviceName);
}
function recordSuccess(serviceName) {
    const cb = getCircuitBreaker(serviceName);
    cb.failures = 0;
    cb.status = 'closed';
}
function recordFailure(serviceName) {
    const cb = getCircuitBreaker(serviceName);
    cb.failures++;
    cb.lastFailure = Date.now();
    if (cb.failures >= CIRCUIT_BREAKER_CONFIG.failureThreshold) {
        cb.status = 'open';
        logger.warn(`[CircuitBreaker] Circuit OPEN for ${serviceName} after ${cb.failures} failures`);
    }
}
function canAttempt(serviceName) {
    const cb = getCircuitBreaker(serviceName);
    if (cb.status === 'closed')
        return true;
    if (cb.status === 'open') {
        const timeSinceFailure = Date.now() - cb.lastFailure;
        if (timeSinceFailure >= CIRCUIT_BREAKER_CONFIG.resetTimeoutMs) {
            cb.status = 'half-open';
            logger.info(`[CircuitBreaker] Circuit HALF-OPEN for ${serviceName}, allowing test request`);
            return true;
        }
        return false;
    }
    // half-open: allow limited attempts
    return true;
}
// ── Retry Configuration ─────────────────────────────────────────────────────────
const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelayMs: 100,
    maxDelayMs: 2000,
    backoffMultiplier: 2,
};
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, Math.min(ms, RETRY_CONFIG.maxDelayMs)));
}
async function httpRequest(url, options = {}) {
    const { method = 'GET', body, headers = {}, timeout = 10000, serviceName = 'unknown' } = options;
    // Check circuit breaker
    if (!canAttempt(serviceName)) {
        return {
            success: false,
            error: `Circuit breaker open for ${serviceName}`,
            statusCode: 503,
        };
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    let lastError = '';
    let attempts = 0;
    const maxAttempts = options.retries ?? RETRY_CONFIG.maxRetries;
    while (attempts < maxAttempts) {
        attempts++;
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Internal-Token': process.env.INTERNAL_SERVICE_TOKEN || '',
                    ...headers,
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                // Don't retry on client errors (4xx)
                if (response.status >= 400 && response.status < 500) {
                    recordFailure(serviceName);
                    return {
                        success: false,
                        error: data.message || `HTTP ${response.status}`,
                        statusCode: response.status,
                        retries: attempts - 1,
                    };
                }
                // Retry on server errors (5xx)
                lastError = data.message || `HTTP ${response.status}`;
                logger.warn(`[HTTP] Server error ${response.status}, attempt ${attempts}/${maxAttempts}`, { url });
                if (attempts < maxAttempts) {
                    const delay = RETRY_CONFIG.baseDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempts - 1);
                    await sleep(delay);
                    continue;
                }
                recordFailure(serviceName);
                return {
                    success: false,
                    error: lastError,
                    statusCode: response.status,
                    retries: attempts - 1,
                };
            }
            // Success!
            recordSuccess(serviceName);
            return { success: true, data: data, statusCode: response.status, retries: attempts - 1 };
        }
        catch (error) {
            clearTimeout(timeoutId);
            lastError = error instanceof Error ? error.message : String(error);
            // Network errors - retry
            if (attempts < maxAttempts) {
                logger.warn(`[HTTP] Network error, attempt ${attempts}/${maxAttempts}`, { url, error: lastError });
                const delay = RETRY_CONFIG.baseDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempts - 1);
                await sleep(delay);
                continue;
            }
            recordFailure(serviceName);
            logger.error(`[HTTP] Request failed after ${maxAttempts} attempts: ${url}`, { error: lastError });
            return { success: false, error: lastError, retries: attempts - 1 };
        }
    }
    recordFailure(serviceName);
    return { success: false, error: lastError || 'Max retries exceeded', retries: maxAttempts };
}
/**
 * Charge user wallet (Debit) via real HTTP call
 */
export async function chargeWallet(userId, amount, description, options = {}) {
    try {
        // Safety cap: wallet operations must have a configurable max amount (default: 0 = disabled)
        const MAX_CHARGE_AMOUNT = parseInt(process.env.MAX_WALLET_CHARGE_AMOUNT || '0', 10);
        if (MAX_CHARGE_AMOUNT > 0 && amount > MAX_CHARGE_AMOUNT) {
            logger.error('[Wallet] Charge rejected — exceeds max amount', { userId, amount, maxAmount: MAX_CHARGE_AMOUNT });
            return { success: false, error: `Amount exceeds maximum allowed: ${MAX_CHARGE_AMOUNT}` };
        }
        // Map referenceType to wallet source
        const sourceMap = {
            order: 'order_payment',
            nudge: 'nudge_charge',
            refund: 'refund',
            bonus: 'bonus',
        };
        const result = await httpRequest(`${SERVICES.wallet}/wallet/debit`, {
            method: 'POST',
            body: {
                userId,
                amount,
                coinType: options.coinType || 'rez',
                source: sourceMap[options.referenceType || 'order'] || 'intent_graph',
                description,
                sourceId: options.referenceId,
            },
            serviceName: 'wallet',
            retries: 3,
        });
        if (result.success && result.data) {
            logger.info('[Wallet] Charging user', { userId, amount, description, transactionId: result.data.transactionId });
            // Also publish to shared memory for event tracking
            await sharedMemory.publish({
                from: 'intent-graph',
                to: 'wallet-service',
                type: 'transaction',
                payload: {
                    action: 'charge',
                    userId,
                    amount,
                    coinType: options.coinType || 'rez',
                    description,
                    transactionId: result.data.transactionId,
                },
                timestamp: new Date(),
            });
            // Cache transaction locally
            await sharedMemory.set(`wallet:txn:${result.data.transactionId}`, {
                userId,
                amount,
                coinType: options.coinType || 'rez',
                description,
                transactionId: result.data.transactionId,
                status: 'completed',
                timestamp: new Date(),
            }, 86400);
            return { success: true, transactionId: result.data.transactionId };
        }
        logger.error('[Wallet] Charge failed', { userId, amount, error: result.error });
        return { success: false, error: result.error };
    }
    catch (error) {
        logger.error('[Wallet] Charge exception', { userId, amount, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Credit user wallet (Refund/Bonus) via real HTTP call
 */
export async function creditWallet(userId, amount, description, options = {}) {
    try {
        // Map referenceType to wallet source
        const sourceMap = {
            order: 'order_refund',
            nudge: 'nudge_refund',
            refund: 'refund',
            bonus: 'bonus',
        };
        const result = await httpRequest(`${SERVICES.wallet}/wallet/credit`, {
            method: 'POST',
            body: {
                userId,
                amount,
                coinType: options.coinType || 'cashback',
                source: sourceMap[options.referenceType || 'refund'] || 'intent_graph_refund',
                description,
                sourceId: options.referenceId,
            },
            serviceName: 'wallet',
            retries: 3,
        });
        if (result.success && result.data) {
            logger.info('[Wallet] Crediting user', { userId, amount, description, transactionId: result.data.transactionId });
            await sharedMemory.publish({
                from: 'intent-graph',
                to: 'wallet-service',
                type: 'transaction',
                payload: {
                    action: 'credit',
                    userId,
                    amount,
                    coinType: options.coinType || 'cashback',
                    description,
                    transactionId: result.data.transactionId,
                },
                timestamp: new Date(),
            });
            await sharedMemory.set(`wallet:txn:${result.data.transactionId}`, {
                userId,
                amount,
                coinType: options.coinType || 'cashback',
                description,
                transactionId: result.data.transactionId,
                status: 'completed',
                timestamp: new Date(),
            }, 86400);
            return { success: true, transactionId: result.data.transactionId };
        }
        logger.error('[Wallet] Credit failed', { userId, amount, error: result.error });
        return { success: false, error: result.error };
    }
    catch (error) {
        logger.error('[Wallet] Credit exception', { userId, amount, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Get user wallet balance via real HTTP call
 */
export async function getWalletBalance(userId) {
    try {
        // Check cache first (5 min TTL)
        const cached = await sharedMemory.get(`wallet:balance:${userId}`);
        if (cached)
            return cached;
        const result = await httpRequest(`${SERVICES.wallet}/wallet/${userId}/balance`, { serviceName: 'wallet' });
        if (result.success && result.data) {
            const balance = {
                userId,
                total: result.data.total || 0,
                available: result.data.total || 0,
                pending: result.data.pending || 0,
                cashback: result.data.coins?.find(c => c.coinType === 'cashback')?.amount || 0,
                coins: result.data.coins?.map(c => ({ type: c.coinType, amount: c.amount })) || [],
            };
            // Cache for 5 minutes
            await sharedMemory.set(`wallet:balance:${userId}`, balance, 300);
            return balance;
        }
        logger.warn('[Wallet] Get balance failed, returning cached', { userId, error: result.error });
        return cached || null;
    }
    catch (error) {
        logger.error('[Wallet] Get balance exception', { userId, error });
        // Return cached on failure
        const cached = await sharedMemory.get(`wallet:balance:${userId}`);
        return cached || null;
    }
}
/**
 * Create order in order service via real HTTP call
 */
export async function createOrder(params) {
    try {
        const total = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderPayload = {
            userId: params.userId,
            storeId: params.storeId,
            items: params.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                itemId: item.itemId,
            })),
            payment: {
                method: params.paymentMethod || 'wallet',
                status: 'pending',
                amount: total,
            },
            delivery: params.deliveryType ? {
                type: params.deliveryType,
                address: params.deliveryAddress,
            } : undefined,
            currency: params.currency || 'INR',
        };
        const result = await httpRequest(`${SERVICES.monolith}/api/orders/create`, {
            method: 'POST',
            body: orderPayload,
            serviceName: 'order',
            retries: 3,
        });
        if (result.success && result.data) {
            const orderId = result.data.orderId || result.data._id;
            logger.info('[Order] Order created', {
                userId: params.userId,
                storeId: params.storeId,
                orderId,
                items: params.items.length,
                total,
            });
            // Publish to shared memory
            await sharedMemory.publish({
                from: 'intent-graph',
                to: 'order-service',
                type: 'order',
                payload: {
                    action: 'create',
                    orderId,
                    ...orderPayload,
                },
                timestamp: new Date(),
            });
            // Store order in memory
            await sharedMemory.set(`order:${orderId}`, {
                orderId,
                ...orderPayload,
                status: result.data.status || 'placed',
                totals: { total, subtotal: total },
                createdAt: new Date(),
            }, 86400 * 7);
            return { success: true, orderId, status: result.data.status || 'placed', total };
        }
        logger.error('[Order] Create order failed', { params, error: result.error });
        return { success: false, error: result.error };
    }
    catch (error) {
        logger.error('[Order] Create order exception', { params, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Update order status via real HTTP call
 */
export async function updateOrderStatus(orderId, status) {
    try {
        const result = await httpRequest(`${SERVICES.monolith}/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: { status },
            serviceName: 'order',
            retries: 3,
        });
        if (result.success) {
            logger.info('[Order] Status updated', { orderId, status });
            // Update cached order
            const order = await sharedMemory.get(`order:${orderId}`);
            if (order) {
                await sharedMemory.set(`order:${orderId}`, { ...order, status }, 86400 * 7);
            }
            // Publish status change
            await sharedMemory.publish({
                from: 'intent-graph',
                to: 'order-service',
                type: 'status_update',
                payload: { orderId, status },
                timestamp: new Date(),
            });
            return { success: true };
        }
        logger.error('[Order] Status update failed', { orderId, status, error: result.error });
        return { success: false, error: result.error };
    }
    catch (error) {
        logger.error('[Order] Status update exception', { orderId, status, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Submit guest request to PMS via HTTP (when PMS service is available)
 * Falls back to shared memory pub/sub if service unavailable
 */
export async function submitGuestRequest(request) {
    try {
        // Try HTTP call first if PMS service URL is configured
        if (SERVICES.pms && SERVICES.pms !== 'http://localhost:3006') {
            const result = await httpRequest(`${SERVICES.pms}/guest-requests`, {
                method: 'POST',
                body: request,
            });
            if (result.success && result.data) {
                return { success: true, requestId: result.data.requestId };
            }
        }
        // Fallback: publish to shared memory for other services to consume
        const requestId = `pms_${crypto.randomUUID()}`;
        await sharedMemory.publish({
            from: 'intent-graph',
            to: 'pms-service',
            type: 'request',
            payload: {
                action: 'guest_request',
                requestId,
                ...request,
            },
            timestamp: new Date(),
        });
        logger.info('[PMS] Guest request submitted', {
            hotelId: request.hotelId,
            guestId: request.guestId,
            type: request.requestType,
            requestId,
        });
        await sharedMemory.set(`pms:request:${requestId}`, { ...request, requestId, status: 'submitted', timestamp: new Date() }, 86400);
        return { success: true, requestId };
    }
    catch (error) {
        logger.error('[PMS] Request failed', { request, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Create task in operational queue via shared memory pub/sub
 * (Task queue is typically consumed by dedicated operational services)
 */
export async function createTask(task) {
    try {
        const taskId = `task_${crypto.randomUUID()}`;
        await sharedMemory.publish({
            from: 'intent-graph',
            to: 'task-queue',
            type: 'task',
            payload: {
                action: 'create',
                taskId,
                ...task,
            },
            timestamp: new Date(),
        });
        logger.info('[Task] Task created', {
            department: task.department,
            type: task.taskType,
            priority: task.priority,
            taskId,
        });
        await sharedMemory.set(`task:${taskId}`, { ...task, taskId, status: 'pending', createdAt: new Date() }, 86400);
        return { success: true, taskId };
    }
    catch (error) {
        logger.error('[Task] Create task failed', { task, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Send notification to staff via shared memory pub/sub
 */
export async function sendStaffNotification(notification) {
    try {
        const notificationId = `notif_${crypto.randomUUID()}`;
        await sharedMemory.publish({
            from: 'intent-graph',
            to: 'notification-service',
            type: 'notification',
            payload: {
                action: 'staff_alert',
                notificationId,
                ...notification,
            },
            timestamp: new Date(),
        });
        logger.info('[Notification] Staff notification sent', {
            department: notification.department,
            title: notification.title,
            notificationId,
        });
        return { success: true, notificationId };
    }
    catch (error) {
        logger.error('[Notification] Send failed', { notification, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Send push notification to user via shared memory pub/sub
 */
export async function sendUserNotification(userId, title, body, data) {
    try {
        const notificationId = `notif_${crypto.randomUUID()}`;
        await sharedMemory.publish({
            from: 'intent-graph',
            to: 'notification-service',
            type: 'notification',
            payload: {
                action: 'user_push',
                notificationId,
                userId,
                title,
                body,
                data,
            },
            timestamp: new Date(),
        });
        logger.info('[Notification] User notification sent', { userId, title, notificationId });
        return { success: true, notificationId };
    }
    catch (error) {
        logger.error('[Notification] User send failed', { userId, title, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Send order to merchant OS via shared memory pub/sub
 */
export async function sendToMerchantOS(order) {
    try {
        const merchantOrderId = `merch_${crypto.randomUUID()}`;
        await sharedMemory.publish({
            from: 'intent-graph',
            to: 'merchant-os',
            type: 'order',
            payload: {
                action: 'new_order',
                merchantOrderId,
                ...order,
            },
            timestamp: new Date(),
        });
        logger.info('[Merchant] Order sent to merchant OS', {
            merchantId: order.merchantId,
            orderId: order.orderId,
            total: order.totalAmount,
            merchantOrderId,
        });
        await sharedMemory.set(`merchant:order:${merchantOrderId}`, { ...order, merchantOrderId, status: 'received', timestamp: new Date() }, 86400 * 7);
        return { success: true, merchantOrderId };
    }
    catch (error) {
        logger.error('[Merchant] Send to OS failed', { order, error });
        return { success: false, error: String(error) };
    }
}
// ── Complete Flow Helpers ────────────────────────────────────────────────────────
/**
 * Complete Room QR flow:
 * 1. Charge wallet (if chargeable items)
 * 2. Submit PMS request
 * 3. Create task
 * 4. Notify staff
 * 5. Update memory
 */
export async function executeRoomServiceFlow(guestId, roomNumber, hotelId, items, complimentaryItems = []) {
    const totalCharged = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const chargeableItems = items.filter(item => !complimentaryItems.includes(item.name));
    let walletTransactionId;
    let pmsRequestId;
    let taskId;
    let notificationId;
    try {
        // 1. Charge wallet if there are chargeable items
        if (chargeableItems.length > 0) {
            const chargeResult = await chargeWallet(guestId, totalCharged, `Room service: ${items.map(i => i.name).join(', ')}`, { referenceType: 'order', referenceId: `room_${roomNumber}` });
            if (!chargeResult.success) {
                return { success: false, error: `Wallet charge failed: ${chargeResult.error}` };
            }
            walletTransactionId = chargeResult.transactionId;
        }
        // 2. Submit to PMS
        const pmsResult = await submitGuestRequest({
            hotelId,
            guestId,
            roomNumber,
            requestType: totalCharged > 0 ? 'room_service' : 'housekeeping',
            items,
            notes: complimentaryItems.length > 0 ? `Complimentary: ${complimentaryItems.join(', ')}` : undefined,
            priority: 'medium',
        });
        pmsRequestId = pmsResult.requestId;
        // 3. Create task for staff
        const taskResult = await createTask({
            department: 'concierge',
            taskType: 'room_delivery',
            description: `Room ${roomNumber}: ${items.map(i => `${i.quantity}x ${i.name}`).join(', ')}`,
            priority: 'medium',
            metadata: { guestId, hotelId, pmsRequestId },
        });
        taskId = taskResult.taskId;
        // 4. Notify staff
        const notifResult = await sendStaffNotification({
            department: 'concierge',
            title: 'Room Service Request',
            message: `Room ${roomNumber}: ${items.map(i => `${i.quantity}x ${i.name}`).join(', ')}`,
            priority: 'medium',
            actionRequired: 'Deliver to room',
            metadata: { taskId, pmsRequestId },
        });
        notificationId = notifResult.notificationId;
        // 5. Update memory with the flow completion
        await sharedMemory.set(`room_service:${guestId}:${Date.now()}`, {
            guestId,
            roomNumber,
            hotelId,
            items,
            totalCharged,
            walletTransactionId,
            pmsRequestId,
            taskId,
            notificationId,
            completedAt: new Date(),
        }, 86400 * 30);
        logger.info('[RoomService] Flow completed', { guestId, roomNumber, totalCharged });
        return {
            success: true,
            walletTransactionId,
            pmsRequestId,
            taskId,
            notificationId,
            totalCharged,
        };
    }
    catch (error) {
        logger.error('[RoomService] Flow failed', { guestId, roomNumber, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Complete shopping flow:
 * 1. Charge wallet
 * 2. Create order
 * 3. Send to merchant OS
 * 4. Update memory
 */
export async function executeShoppingFlow(userId, storeId, merchantId, items) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
        // 1. Charge wallet first
        const chargeResult = await chargeWallet(userId, total, `Order: ${items.map(i => i.name).join(', ')}`, { referenceType: 'order' });
        if (!chargeResult.success) {
            return { success: false, error: `Payment failed: ${chargeResult.error}` };
        }
        // 2. Create order
        const orderResult = await createOrder({
            userId,
            storeId,
            items: items.map(i => ({
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                itemId: i.productId,
            })),
            paymentMethod: 'wallet',
        });
        if (!orderResult.success || !orderResult.orderId) {
            // Refund wallet on order failure
            await creditWallet(userId, total, 'Order failed - refund', { referenceType: 'refund' });
            return { success: false, error: 'Order creation failed' };
        }
        // 3. Send to merchant OS
        const merchantResult = await sendToMerchantOS({
            merchantId,
            orderId: orderResult.orderId,
            items: items.map(i => ({
                productId: i.productId || '',
                quantity: i.quantity,
                price: i.price,
            })),
            totalAmount: total,
            customerId: userId,
        });
        // 4. Update memory
        await sharedMemory.set(`order:history:${userId}:${orderResult.orderId}`, {
            orderId: orderResult.orderId,
            merchantOrderId: merchantResult.merchantOrderId,
            items,
            total,
            status: 'placed',
            placedAt: new Date(),
        }, 86400 * 90);
        logger.info('[Shopping] Flow completed', { userId, orderId: orderResult.orderId, total });
        return {
            success: true,
            orderId: orderResult.orderId,
            merchantOrderId: merchantResult.merchantOrderId,
            total,
        };
    }
    catch (error) {
        logger.error('[Shopping] Flow failed', { userId, error });
        return { success: false, error: String(error) };
    }
}
/**
 * Validate internal service token
 */
export async function validateInternalToken(token) {
    try {
        const result = await httpRequest(`${SERVICES.auth}/auth/validate`, {
            method: 'GET',
            headers: {
                'X-Internal-Token': token,
            },
            serviceName: 'auth',
            retries: 1,
            timeout: 3000,
        });
        return result.success && result.data?.valid === true;
    }
    catch {
        return false;
    }
}
/**
 * Get user info from auth service
 */
export async function getUserFromToken(token) {
    try {
        const result = await httpRequest(`${SERVICES.auth}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            serviceName: 'auth',
            retries: 2,
            timeout: 5000,
        });
        return result.success ? result.data || null : null;
    }
    catch {
        return null;
    }
}
export async function checkServiceHealth(service) {
    const healthEndpoints = {
        wallet: `${SERVICES.wallet}/health`,
        monolith: `${SERVICES.monolith}/api/health`,
        order: `${SERVICES.order}/health`,
        payment: `${SERVICES.payment}/health`,
        merchant: `${SERVICES.merchant}/health`,
        notification: `${SERVICES.notification}/health`,
        auth: `${SERVICES.auth}/health`,
        catalog: `${SERVICES.catalog}/health`,
        search: `${SERVICES.search}/health`,
        marketing: `${SERVICES.marketing}/health`,
        gamification: `${SERVICES.gamification}/health`,
        ads: `${SERVICES.ads}/health`,
        analytics: `${SERVICES.analytics}/health`,
    };
    const url = healthEndpoints[service];
    if (!url)
        return false;
    try {
        const result = await httpRequest(url, {
            timeout: 3000,
            serviceName: service,
            retries: 1,
        });
        return result.success && result.data?.status === 'ok';
    }
    catch {
        return false;
    }
}
export async function getAllServiceHealth() {
    const services = ['wallet', 'monolith', 'payment', 'merchant', 'notification', 'auth', 'analytics'];
    const results = await Promise.all(services.map(async (service) => ({
        service,
        healthy: await checkServiceHealth(service),
    })));
    return results.reduce((acc, { service, healthy }) => {
        acc[service] = healthy;
        return acc;
    }, {});
}
/**
 * Get detailed circuit breaker status for all services
 */
export function getCircuitBreakerStatus() {
    const services = [
        'wallet', 'monolith', 'order', 'payment', 'merchant',
        'notification', 'auth', 'catalog', 'search', 'marketing',
        'gamification', 'ads', 'pms', 'analytics'
    ];
    return services.map(name => {
        const cb = getCircuitBreaker(name);
        return {
            name,
            healthy: cb.status === 'closed',
            circuitBreakerStatus: cb.status,
            failureCount: cb.failures,
            lastFailure: cb.lastFailure > 0 ? cb.lastFailure : null,
        };
    });
}
/**
 * Reset circuit breaker for a service (admin operation)
 */
export function resetCircuitBreaker(serviceName) {
    if (circuitBreakers.has(serviceName)) {
        const cb = getCircuitBreaker(serviceName);
        cb.failures = 0;
        cb.status = 'closed';
        cb.lastFailure = 0;
        logger.info(`[CircuitBreaker] Reset circuit breaker for ${serviceName}`);
        return true;
    }
    return false;
}
/**
 * Force open circuit breaker for a service (admin operation)
 */
export function forceOpenCircuitBreaker(serviceName) {
    if (circuitBreakers.has(serviceName)) {
        const cb = getCircuitBreaker(serviceName);
        cb.status = 'open';
        cb.failures = CIRCUIT_BREAKER_CONFIG.failureThreshold;
        cb.lastFailure = Date.now();
        logger.warn(`[CircuitBreaker] Force OPEN circuit breaker for ${serviceName}`);
        return true;
    }
    return false;
}
//# sourceMappingURL=external-services.js.map