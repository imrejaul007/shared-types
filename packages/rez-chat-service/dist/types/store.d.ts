import type { MessageAttachment, MessageType, MessageSender } from './index';
export type StoreConversationType = 'order_inquiry' | 'product_inquiry' | 'delivery_issue' | 'order_status' | 'refund_request' | 'general';
export type StoreDepartment = 'sales' | 'support' | 'delivery' | 'kitchen' | 'manager';
export interface StoreParticipant {
    id: string;
    name: string;
    avatar?: string;
    role: 'customer' | 'store' | 'delivery_person' | 'system';
    status?: 'online' | 'away' | 'busy' | 'offline';
    storeId?: string;
    storeName?: string;
    storeLogo?: string;
    isOnline?: boolean;
}
export interface StoreMessage {
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
    storeDepartment?: StoreDepartment;
    metadata?: StoreMessageMetadata;
}
export interface StoreMessageMetadata {
    orderId?: string;
    orderNumber?: string;
    productId?: string;
    productName?: string;
    storeId?: string;
    estimatedTime?: number;
    deliveryAddress?: string;
    trackingUrl?: string;
    items?: StoreOrderItem[];
    quickReplies?: StoreQuickReply[];
    [key: string]: unknown;
}
export interface StoreOrderItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    image?: string;
    options?: Record<string, string>;
}
export interface StoreQuickReply {
    id: string;
    text: string;
    value?: string;
    icon?: string;
    action: 'send_message' | 'open_url' | 'view_order' | 'track_order';
    payload?: string;
}
export interface StoreConversation {
    id: string;
    type: StoreConversationType;
    status: 'active' | 'archived' | 'closed';
    participants: StoreParticipant[];
    storeId: string;
    storeName: string;
    storeLogo?: string;
    customerId: string;
    customerName: string;
    isStoreOnline: boolean;
    department: StoreDepartment;
    lastMessage?: StoreMessage;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    lastOrderContext?: {
        orderId: string;
        orderNumber: string;
        status: string;
    };
}
export interface KitchenMessage extends StoreMessage {
    tableNumber?: string;
    orderType: 'dine_in' | 'takeout' | 'delivery';
    priority?: 'normal' | 'rush' | 'vip';
}
export interface KitchenTable {
    tableNumber: string;
    orderCount: number;
    lastMessage?: KitchenMessage;
    isActive: boolean;
}
export interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'order' | 'recommendation' | 'reservation' | 'handoff';
    metadata?: AIMetadata;
    createdAt: string;
}
export interface AIMetadata {
    items?: AIOrderItem[];
    reservationParams?: AIReservationParams;
    suggestedItems?: AISuggestedItem[];
}
export interface AIOrderItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    image?: string;
}
export interface AIReservationParams {
    date: string;
    time: string;
    guests: number;
    name?: string;
    phone?: string;
    notes?: string;
}
export interface AISuggestedItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
}
export declare const STORE_CHAT_EVENTS: {
    readonly CUSTOMER_MESSAGE: "store:customer_message";
    readonly CUSTOMER_TYPING: "store:customer_typing";
    readonly STORE_MESSAGE: "store:store_message";
    readonly STORE_TYPING: "store:store_typing";
    readonly STORE_ONLINE: "store:online";
    readonly STORE_OFFLINE: "store:offline";
    readonly KITCHEN_MESSAGE: "kitchen:message";
    readonly KITCHEN_ORDER: "kitchen:order";
    readonly KITCHEN_COMPLETE: "kitchen:complete";
    readonly TABLE_MESSAGE: "table:message";
    readonly TABLE_MESSAGE_RECEIVED: "table:message:received";
    readonly TABLE_MESSAGE_ACK: "table:message:ack";
    readonly TABLE_MESSAGE_ERROR: "table:message:error";
    readonly ORDER_STATUS_UPDATE: "order:status_update";
    readonly ORDER_ASSIGNED: "order:assigned";
    readonly DELIVERY_UPDATE: "delivery:update";
};
export declare const STORE_CHAT_ENDPOINTS: {
    readonly CONVERSATIONS: "/api/store/chat/conversations";
    readonly MESSAGES: "/api/store/chat/messages";
    readonly ORDERS: "/api/store/chat/orders";
    readonly WAITER_CALL: "/api/store/chat/waiter";
};
//# sourceMappingURL=store.d.ts.map