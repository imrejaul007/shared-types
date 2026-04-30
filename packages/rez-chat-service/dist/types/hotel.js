// Hotel-specific chat types for Room QR / Hotel PMS
// These extend the base chat types with hotel-specific features
// ── Hotel Chat Events ────────────────────────────────────────────────────────────
export const HOTEL_CHAT_EVENTS = {
    // Guest events
    GUEST_JOIN: 'hotel:guest_join',
    GUEST_MESSAGE: 'hotel:guest_message',
    GUEST_TYPING: 'hotel:guest_typing',
    GUEST_READ: 'hotel:guest_read',
    // Staff events
    STAFF_JOIN: 'hotel:staff_join',
    STAFF_ASSIGNED: 'hotel:staff_assigned',
    STAFF_MESSAGE: 'hotel:staff_message',
    STAFF_TYPING: 'hotel:staff_typing',
    STAFF_READ: 'hotel:staff_read',
    // Request events
    REQUEST_CREATED: 'hotel:request_created',
    REQUEST_ASSIGNED: 'hotel:request_assigned',
    REQUEST_STATUS_CHANGED: 'hotel:request_status_changed',
    REQUEST_COMPLETED: 'hotel:request_completed',
    // Notifications
    NEW_GUEST_MESSAGE: 'hotel:new_guest_message',
    STAFF_AVAILABLE: 'hotel:staff_available',
    GUEST_LEFT: 'hotel:guest_left',
    // Room context
    ROOM_CONTEXT_SET: 'hotel:room_context_set',
    BOOKING_CONTEXT_SET: 'hotel:booking_context_set',
    // Conversation events
    CONVERSATION_CREATED: 'conversation:created',
    CONVERSATION_UPDATED: 'conversation:updated',
    CONVERSATION_RESOLVED: 'conversation:resolved',
};
// ── Hotel API Endpoints ─────────────────────────────────────────────────────────
export const HOTEL_CHAT_ENDPOINTS = {
    CONVERSATIONS: '/api/hotel/chat/conversations',
    MESSAGES: '/api/hotel/chat/messages',
    SERVICE_REQUESTS: '/api/hotel/chat/requests',
    STAFF_AVAILABILITY: '/api/hotel/chat/staff/availability',
    HOTEL_CONFIG: '/api/hotel/chat/config',
    MARK_READ: '/api/hotel/chat/read',
};
//# sourceMappingURL=hotel.js.map