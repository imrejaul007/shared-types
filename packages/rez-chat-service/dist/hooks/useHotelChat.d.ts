import type { HotelConversation, HotelMessage, HotelStaff, HotelServiceRequest, HotelDepartment, HotelConversationType, HotelQuickReply, StaffAvailability } from '../types/hotel';
export interface UseHotelChatOptions {
    guestId: string;
    guestName: string;
    roomNumber?: string;
    bookingId?: string;
    apiBaseUrl: string;
    token?: string;
    namespace?: string;
    enableNotifications?: boolean;
    autoConnect?: boolean;
}
export interface UseHotelChatReturn {
    conversations: HotelConversation[];
    currentConversation: HotelConversation | null;
    messages: HotelMessage[];
    messagesLoading: boolean;
    connected: boolean;
    connecting: boolean;
    assignedStaff: HotelStaff | null;
    isStaffTyping: boolean;
    queueInfo: {
        position: number;
        estimatedWait: number;
    } | null;
    unreadCount: number;
    staffAvailability: StaffAvailability[];
    startConversation: (type: HotelConversationType, department?: HotelDepartment) => Promise<HotelConversation | null>;
    sendMessage: (content: string, quickReply?: HotelQuickReply) => Promise<boolean>;
    startTyping: () => void;
    stopTyping: () => void;
    markAsRead: (messageIds: string[]) => void;
    createServiceRequest: (request: Partial<HotelServiceRequest>) => Promise<HotelServiceRequest | null>;
    rateConversation: (rating: number, comment?: string) => Promise<boolean>;
    resolveConversation: () => Promise<boolean>;
    assignStaff: (staffId: string) => Promise<boolean>;
    transferToDepartment: (department: HotelDepartment) => Promise<boolean>;
    connect: () => void;
    disconnect: () => void;
}
export declare function useHotelChat(options: UseHotelChatOptions): UseHotelChatReturn;
//# sourceMappingURL=useHotelChat.d.ts.map