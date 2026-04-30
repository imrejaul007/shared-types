import type { MessageAttachment, MessageType, MessageSender } from './index';
export type HotelConversationType = 'room_service' | 'concierge' | 'housekeeping' | 'maintenance' | 'spa' | 'transport' | 'general' | 'checkout';
export type HotelDepartment = 'front_desk' | 'concierge' | 'housekeeping' | 'room_service' | 'maintenance' | 'spa' | 'transport' | 'manager';
export type ServiceRequestStatus = 'pending' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled';
export interface HotelGuest {
    id: string;
    name: string;
    avatar?: string;
    role: 'guest';
    status?: 'online' | 'away' | 'busy' | 'offline';
    roomNumber?: string;
    bookingId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: number;
    preferences?: GuestPreferences;
    metadata?: Record<string, unknown>;
}
export interface HotelStaff {
    id: string;
    name: string;
    avatar?: string;
    role: 'staff';
    email?: string;
    status?: 'online' | 'away' | 'busy' | 'offline';
    department: HotelDepartment;
    employeeId: string;
    isOnDuty: boolean;
    metadata?: Record<string, unknown>;
}
export interface GuestPreferences {
    dietaryRestrictions?: string[];
    allergies?: string[];
    roomTemperature?: 'warmer' | 'cooler' | 'normal';
    pillowType?: 'firm' | 'soft' | 'foam';
    language?: string;
    specialNotes?: string;
}
export interface HotelMessage {
    id: string;
    conversationId: string;
    content: string;
    sender: MessageSender;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    type: MessageType;
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    readAt?: string;
    deliveredAt?: string;
    attachments?: MessageAttachment[];
    department?: HotelDepartment;
    serviceRequestId?: string;
    metadata?: HotelMessageMetadata;
}
export interface HotelMessageMetadata {
    orderId?: string;
    orderType?: 'food' | 'beverage' | 'amenity' | 'housekeeping' | 'laundry';
    items?: HotelOrderItem[];
    estimatedTime?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    attachments?: MessageAttachment[];
    quickReplies?: HotelQuickReply[];
    [key: string]: unknown;
}
export interface HotelOrderItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
    choices?: string[];
}
export interface HotelQuickReply {
    id: string;
    text: string;
    value?: string;
    icon?: string;
    action: 'send_message' | 'open_url' | 'create_request';
    payload?: string;
}
export interface HotelConversation {
    id: string;
    type: HotelConversationType;
    status: 'active' | 'archived' | 'closed' | 'resolved';
    participants: (HotelGuest | HotelStaff)[];
    guest: HotelGuest;
    staff?: HotelStaff;
    roomNumber: string;
    bookingId: string;
    department: HotelDepartment;
    lastMessage?: HotelMessage;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    serviceRequestId?: string;
    checkInDate: string;
    checkOutDate: string;
    metadata?: HotelConversationMetadata;
}
export interface HotelConversationMetadata {
    roomServiceMenu?: string;
    orderTotal?: number;
    estimatedDelivery?: string;
    specialRequests?: string;
    dietaryRestrictions?: string[];
    isPriority?: boolean;
    repeatGuest?: boolean;
    vipLevel?: 'standard' | 'silver' | 'gold' | 'platinum';
}
export interface HotelServiceRequest {
    id: string;
    conversationId: string;
    guestId: string;
    guestName: string;
    roomNumber: string;
    bookingId: string;
    type: HotelConversationType;
    department: HotelDepartment;
    status: ServiceRequestStatus;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    subject: string;
    description?: string;
    items?: HotelOrderItem[];
    scheduledTime?: string;
    completedAt?: string;
    assignedTo?: HotelStaff;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}
export interface StaffAvailability {
    staffId: string;
    department: HotelDepartment;
    status: 'available' | 'busy' | 'offline' | 'break';
    activeConversations: number;
    maxConversations: number;
    averageResponseTime: number;
    currentGuestRating?: number;
}
export declare const HOTEL_CHAT_EVENTS: {
    readonly GUEST_JOIN: "hotel:guest_join";
    readonly GUEST_MESSAGE: "hotel:guest_message";
    readonly GUEST_TYPING: "hotel:guest_typing";
    readonly GUEST_READ: "hotel:guest_read";
    readonly STAFF_JOIN: "hotel:staff_join";
    readonly STAFF_ASSIGNED: "hotel:staff_assigned";
    readonly STAFF_MESSAGE: "hotel:staff_message";
    readonly STAFF_TYPING: "hotel:staff_typing";
    readonly STAFF_READ: "hotel:staff_read";
    readonly REQUEST_CREATED: "hotel:request_created";
    readonly REQUEST_ASSIGNED: "hotel:request_assigned";
    readonly REQUEST_STATUS_CHANGED: "hotel:request_status_changed";
    readonly REQUEST_COMPLETED: "hotel:request_completed";
    readonly NEW_GUEST_MESSAGE: "hotel:new_guest_message";
    readonly STAFF_AVAILABLE: "hotel:staff_available";
    readonly GUEST_LEFT: "hotel:guest_left";
    readonly ROOM_CONTEXT_SET: "hotel:room_context_set";
    readonly BOOKING_CONTEXT_SET: "hotel:booking_context_set";
    readonly CONVERSATION_CREATED: "conversation:created";
    readonly CONVERSATION_UPDATED: "conversation:updated";
    readonly CONVERSATION_RESOLVED: "conversation:resolved";
};
export declare const HOTEL_CHAT_ENDPOINTS: {
    readonly CONVERSATIONS: "/api/hotel/chat/conversations";
    readonly MESSAGES: "/api/hotel/chat/messages";
    readonly SERVICE_REQUESTS: "/api/hotel/chat/requests";
    readonly STAFF_AVAILABILITY: "/api/hotel/chat/staff/availability";
    readonly HOTEL_CONFIG: "/api/hotel/chat/config";
    readonly MARK_READ: "/api/hotel/chat/read";
};
//# sourceMappingURL=hotel.d.ts.map