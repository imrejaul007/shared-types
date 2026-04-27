export type MessageSender = 'user' | 'agent' | 'system' | 'bot' | 'staff' | 'guest' | 'store' | 'delivery';
export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'quick_reply' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type ConversationStatus = 'active' | 'archived' | 'closed';
export type ConversationType = 'support' | 'order' | 'ai_assistant' | 'direct' | 'room_service' | 'concierge' | 'housekeeping' | 'general' | 'order_inquiry' | 'product_inquiry' | 'delivery_issue';
export interface ChatParticipant {
    id: string;
    name: string;
    avatar?: string;
    role: 'customer' | 'agent' | 'admin' | 'bot' | 'staff' | 'guest' | 'store' | 'delivery_person';
    status?: 'online' | 'away' | 'busy' | 'offline';
    metadata?: Record<string, unknown>;
}
export interface AgentInfo {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    title?: string;
    department?: string;
    skills?: string[];
    rating?: number;
    responseTime?: number;
    languages?: string[];
}
export interface ChatMessage {
    id: string;
    conversationId: string;
    content: string;
    sender: MessageSender;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    type: MessageType;
    status: MessageStatus;
    timestamp: string;
    readAt?: string;
    deliveredAt?: string;
    attachments?: MessageAttachment[];
    replyTo?: MessageReference;
    metadata?: MessageMetadata;
}
export interface MessageAttachment {
    id: string;
    type: 'image' | 'file' | 'video' | 'audio';
    url: string;
    name: string;
    size: number;
    mimeType: string;
    thumbnail?: string;
    duration?: number;
}
export interface MessageReference {
    messageId: string;
    content: string;
    senderName: string;
    senderAvatar?: string;
}
export interface MessageMetadata {
    orderId?: string;
    productId?: string;
    storeId?: string;
    reservationParams?: ReservationParams;
    suggestedItems?: SuggestedItem[];
    quickReplies?: QuickReply[];
    [key: string]: unknown;
}
export interface ReservationParams {
    date: string;
    time: string;
    guests: number;
    name?: string;
    phone?: string;
    notes?: string;
}
export interface SuggestedItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    quantity?: number;
}
export interface QuickReply {
    id: string;
    text: string;
    value: string;
    icon?: string;
}
export interface Conversation {
    id: string;
    type: ConversationType;
    status: ConversationStatus;
    participants: ChatParticipant[];
    lastMessage?: ChatMessage;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    metadata?: ConversationMetadata;
}
export interface ConversationMetadata {
    storeId?: string;
    storeName?: string;
    orderId?: string;
    ticketId?: string;
    category?: SupportCategory;
    priority?: SupportPriority;
    isStoreOnline?: boolean;
    queuePosition?: number;
    estimatedWaitTime?: number;
}
export type SupportCategory = 'order' | 'payment' | 'product' | 'account' | 'technical' | 'delivery' | 'refund' | 'other';
export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent';
export interface QueueInfo {
    position: number;
    totalInQueue: number;
    estimatedWaitTime: number;
    averageWaitTime: number;
    availableAgents: number;
    busyAgents: number;
}
export interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    subject: string;
    category: SupportCategory;
    priority: SupportPriority;
    status: TicketStatus;
    assignedAgent?: AgentInfo;
    createdAt: string;
    updatedAt: string;
    firstResponseAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    messages: ChatMessage[];
    messageCount: number;
    unreadCount: number;
    rating?: ConversationRating;
    ratingComment?: string;
    queuePosition?: number;
    estimatedWaitTime?: number;
    tags?: string[];
    internalNotes?: string;
}
export type TicketStatus = 'open' | 'pending' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type ConversationRating = 1 | 2 | 3 | 4 | 5;
export interface TypingIndicator {
    conversationId: string;
    participantId: string;
    participantName: string;
    isTyping: boolean;
    timestamp: string;
}
export interface FAQSuggestion {
    id: string;
    question: string;
    answer: string;
    category: string;
    relevanceScore: number;
    helpful?: boolean;
    articleUrl?: string;
}
export interface ConversationTransfer {
    id: string;
    conversationId: string;
    fromAgentId: string;
    fromAgentName: string;
    toAgentId: string;
    toAgentName: string;
    reason?: string;
    timestamp: string;
    accepted: boolean;
    acceptedAt?: string;
}
export interface CallRequest {
    id: string;
    conversationId: string;
    type: 'voice' | 'video';
    initiatedBy: 'agent' | 'user';
    status: 'pending' | 'accepted' | 'rejected' | 'ended';
    startedAt?: string;
    endedAt?: string;
    duration?: number;
    callUrl?: string;
}
export interface BusinessHours {
    isOpen: boolean;
    timezone: string;
    schedule: {
        [day: string]: {
            open: string;
            close: string;
        };
    };
    nextOpenTime?: string;
    holidays?: string[];
}
export interface ChatConfig {
    enabled: boolean;
    businessHours: BusinessHours;
    autoAssignment: boolean;
    maxConcurrentChats: number;
    queueEnabled: boolean;
    offlineMessaging: boolean;
    fileUploadEnabled: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    ratingEnabled: boolean;
    transcriptEmail: boolean;
    aiSuggestionsEnabled: boolean;
}
export interface CreateConversationRequest {
    type: ConversationType;
    participantIds?: string[];
    metadata?: ConversationMetadata;
    initialMessage?: string;
}
export interface CreateConversationResponse {
    conversation: Conversation;
    queueInfo?: QueueInfo;
}
export interface SendMessageRequest {
    conversationId: string;
    content: string;
    type?: MessageType;
    attachments?: MessageAttachment[];
    replyToId?: string;
    metadata?: Record<string, unknown>;
}
export interface SendMessageResponse {
    message: ChatMessage;
    deliveryStatus: MessageDeliveryStatus;
}
export interface MessageDeliveryStatus {
    messageId: string;
    sent: boolean;
    sentAt?: string;
    delivered: boolean;
    deliveredAt?: string;
    read: boolean;
    readAt?: string;
    failed?: boolean;
    failureReason?: string;
}
export interface GetConversationsResponse {
    conversations: Conversation[];
    total: number;
    page: number;
    limit: number;
}
export interface GetMessagesResponse {
    messages: ChatMessage[];
    total: number;
    hasMore: boolean;
}
export interface RateConversationRequest {
    conversationId: string;
    rating: ConversationRating;
    comment?: string;
    tags?: string[];
}
export declare const CHAT_EVENTS: {
    readonly CONNECT: "connect";
    readonly DISCONNECT: "disconnect";
    readonly CONNECT_ERROR: "connect_error";
    readonly JOIN_CONVERSATION: "join_conversation";
    readonly LEAVE_CONVERSATION: "leave_conversation";
    readonly MESSAGE_SENT: "message:sent";
    readonly MESSAGE_RECEIVED: "message:received";
    readonly MESSAGE_DELIVERED: "message:delivered";
    readonly MESSAGE_READ: "message:read";
    readonly MESSAGE_FAILED: "message:failed";
    readonly MESSAGE_DELETED: "message:deleted";
    readonly TYPING_START: "typing:start";
    readonly TYPING_STOP: "typing:stop";
    readonly CONVERSATION_CREATED: "conversation:created";
    readonly CONVERSATION_UPDATED: "conversation:updated";
    readonly CONVERSATION_CLOSED: "conversation:closed";
    readonly CONVERSATION_ARCHIVED: "conversation:archived";
    readonly PARTICIPANT_JOINED: "participant:joined";
    readonly PARTICIPANT_LEFT: "participant:left";
    readonly PARTICIPANT_ONLINE: "participant:online";
    readonly PARTICIPANT_OFFLINE: "participant:offline";
    readonly SUPPORT_AGENT_ASSIGNED: "support_agent_assigned";
    readonly SUPPORT_AGENT_TYPING_START: "support_agent_typing_start";
    readonly SUPPORT_AGENT_TYPING_STOP: "support_agent_typing_stop";
    readonly SUPPORT_USER_TYPING_START: "support_user_typing_start";
    readonly SUPPORT_USER_TYPING_STOP: "support_user_typing_stop";
    readonly SUPPORT_TICKET_STATUS_CHANGED: "support_ticket_status_changed";
    readonly SUPPORT_MESSAGES_READ: "support_messages_read";
    readonly SUPPORT_NEW_TICKET: "support_new_ticket";
    readonly AI_RESPONSE: "ai:response";
    readonly AI_TYPING_START: "ai:typing_start";
    readonly AI_TYPING_STOP: "ai:typing_stop";
};
export type ChatEventName = (typeof CHAT_EVENTS)[keyof typeof CHAT_EVENTS];
export interface OfflineMessage {
    id: string;
    conversationId: string;
    message: Omit<ChatMessage, 'id' | 'status'>;
    queuedAt: string;
    retryCount: number;
    lastRetryAt?: string;
    status: 'queued' | 'sending' | 'sent' | 'failed';
}
export interface ChatSession {
    id: string;
    conversationId: string;
    startedAt: string;
    endedAt?: string;
    duration?: number;
    messageCount: number;
}
export interface ChatStatistics {
    totalConversations: number;
    activeConversations: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    totalMessages: number;
}
//# sourceMappingURL=index.d.ts.map