import { Socket } from 'socket.io-client';
export type AIAppType = 'hotel' | 'restaurant' | 'retail' | 'support' | 'general' | 'room-qr' | 'web-menu';
export interface CustomerContext {
    customerId: string;
    name?: string;
    email?: string;
    phone?: string;
    tier?: string;
    preferences?: Record<string, unknown>;
    recentOrders?: Array<{
        orderId: string;
        type: string;
        status: string;
        total: number;
        date: Date;
    }>;
    bookings?: Array<{
        bookingId: string;
        type: string;
        status: string;
        date: Date;
    }>;
    totalSpent?: number;
    visitCount?: number;
}
export interface AIMessage {
    id: string;
    content: string;
    sender: 'user' | 'ai' | 'staff';
    timestamp: string;
    metadata?: {
        confidence?: number;
        suggestions?: string[];
        actions?: Array<{
            type: string;
            data: Record<string, unknown>;
            reason: string;
        }>;
        knowledgeUsed?: string[];
    };
}
export interface UseAIChatOptions {
    /** User ID */
    userId: string;
    /** Conversation ID (for continuing chats) */
    conversationId?: string;
    /** App type for routing */
    appType: AIAppType;
    /** Industry category (hotel, restaurant, pharmacy, etc.) */
    industryCategory?: string;
    /** Merchant/hotel/restaurant ID */
    merchantId?: string;
    /** Customer context for personalization */
    customerContext?: CustomerContext;
    /** Socket server URL */
    socketUrl: string;
    /** Auth token */
    token?: string;
    /** Auto connect on mount */
    autoConnect?: boolean;
    /** Enable AI suggestions */
    enableSuggestions?: boolean;
    /** Callback when escalation needed */
    onEscalate?: (data: {
        reason: string;
        department?: string;
    }) => void;
    /** Callback when action is triggered */
    onAction?: (action: {
        type: string;
        data: Record<string, unknown>;
    }) => void;
}
export interface UseAIChatReturn {
    messages: AIMessage[];
    isTyping: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    conversationId: string | null;
    suggestions: string[];
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    selectSuggestion: (suggestion: string) => Promise<void>;
    transferToStaff: (reason?: string, department?: string) => void;
    endChat: (rating?: number) => void;
    clearMessages: () => void;
    connect: () => void;
    disconnect: () => void;
    socketRef: React.MutableRefObject<Socket | null>;
}
export declare function useAIChat(options: UseAIChatOptions): UseAIChatReturn;
//# sourceMappingURL=useAIChat.d.ts.map