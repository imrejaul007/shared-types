// Store/Restaurant messaging types for rez-now and rez-web-menu
// These extend the base chat types with store-specific features
// ── Store Chat Events ──────────────────────────────────────────────────────────
export const STORE_CHAT_EVENTS = {
    // Customer events
    CUSTOMER_MESSAGE: 'store:customer_message',
    CUSTOMER_TYPING: 'store:customer_typing',
    // Store events
    STORE_MESSAGE: 'store:store_message',
    STORE_TYPING: 'store:store_typing',
    STORE_ONLINE: 'store:online',
    STORE_OFFLINE: 'store:offline',
    // Kitchen events
    KITCHEN_MESSAGE: 'kitchen:message',
    KITCHEN_ORDER: 'kitchen:order',
    KITCHEN_COMPLETE: 'kitchen:complete',
    // Table events
    TABLE_MESSAGE: 'table:message',
    TABLE_MESSAGE_RECEIVED: 'table:message:received',
    TABLE_MESSAGE_ACK: 'table:message:ack',
    TABLE_MESSAGE_ERROR: 'table:message:error',
    // Order events
    ORDER_STATUS_UPDATE: 'order:status_update',
    ORDER_ASSIGNED: 'order:assigned',
    DELIVERY_UPDATE: 'delivery:update',
};
// ── Store API Endpoints ─────────────────────────────────────────────────────────
export const STORE_CHAT_ENDPOINTS = {
    CONVERSATIONS: '/api/store/chat/conversations',
    MESSAGES: '/api/store/chat/messages',
    ORDERS: '/api/store/chat/orders',
    WAITER_CALL: '/api/store/chat/waiter',
};
//# sourceMappingURL=store.js.map