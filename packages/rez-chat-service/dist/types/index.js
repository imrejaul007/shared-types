// Unified Chat Types for ReZ Ecosystem
// Common interfaces used across all ReZ apps: consumer, admin, now, web-menu
// ── WebSocket Events ──────────────────────────────────────────────────────────
// Unified event names - apps can alias to their existing event names
export const CHAT_EVENTS = {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    // Conversation management
    JOIN_CONVERSATION: 'join_conversation',
    LEAVE_CONVERSATION: 'leave_conversation',
    // Messaging
    MESSAGE_SENT: 'message:sent',
    MESSAGE_RECEIVED: 'message:received',
    MESSAGE_DELIVERED: 'message:delivered',
    MESSAGE_READ: 'message:read',
    MESSAGE_FAILED: 'message:failed',
    MESSAGE_DELETED: 'message:deleted',
    // Typing
    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop',
    // Status
    CONVERSATION_CREATED: 'conversation:created',
    CONVERSATION_UPDATED: 'conversation:updated',
    CONVERSATION_CLOSED: 'conversation:closed',
    CONVERSATION_ARCHIVED: 'conversation:archived',
    // Presence
    PARTICIPANT_JOINED: 'participant:joined',
    PARTICIPANT_LEFT: 'participant:left',
    PARTICIPANT_ONLINE: 'participant:online',
    PARTICIPANT_OFFLINE: 'participant:offline',
    // Support-specific events (aliased from backend)
    SUPPORT_AGENT_ASSIGNED: 'support_agent_assigned',
    SUPPORT_AGENT_TYPING_START: 'support_agent_typing_start',
    SUPPORT_AGENT_TYPING_STOP: 'support_agent_typing_stop',
    SUPPORT_USER_TYPING_START: 'support_user_typing_start',
    SUPPORT_USER_TYPING_STOP: 'support_user_typing_stop',
    SUPPORT_TICKET_STATUS_CHANGED: 'support_ticket_status_changed',
    SUPPORT_MESSAGES_READ: 'support_messages_read',
    SUPPORT_NEW_TICKET: 'support_new_ticket',
    // AI Chat events (for rez-now)
    AI_RESPONSE: 'ai:response',
    AI_TYPING_START: 'ai:typing_start',
    AI_TYPING_STOP: 'ai:typing_stop',
};
//# sourceMappingURL=index.js.map