import type { ChatMessage, Conversation, MessageAttachment, QueueInfo, CreateConversationRequest, ConversationRating } from '../types';
export interface UseChatOptions {
    conversationId?: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    apiBaseUrl: string;
    token?: string;
    namespace?: string;
    enableOfflineQueue?: boolean;
    enableOptimistic?: boolean;
    typingTimeout?: number;
    autoConnect?: boolean;
}
export interface UseChatReturn {
    messages: ChatMessage[];
    messagesLoading: boolean;
    messagesError: string | null;
    conversation: Conversation | null;
    conversations: Conversation[];
    connected: boolean;
    connecting: boolean;
    isTyping: boolean;
    otherTyping: boolean;
    typingUser?: {
        id: string;
        name: string;
    };
    queueInfo: QueueInfo | null;
    sendMessage: (content: string, attachments?: MessageAttachment[]) => Promise<boolean>;
    sendTyping: (isTyping: boolean) => void;
    markAsRead: (messageIds: string[]) => void;
    createConversation: (request: CreateConversationRequest) => Promise<Conversation | null>;
    joinConversation: (conversationId: string) => void;
    leaveConversation: () => void;
    loadMessages: (before?: string, limit?: number) => Promise<void>;
    loadConversations: (page?: number, limit?: number) => Promise<void>;
    rateConversation: (rating: ConversationRating, comment?: string) => Promise<boolean>;
    closeConversation: (reason?: string) => Promise<boolean>;
    connect: () => void;
    disconnect: () => void;
}
export declare function useChat(options: UseChatOptions): UseChatReturn;
//# sourceMappingURL=useChat.d.ts.map