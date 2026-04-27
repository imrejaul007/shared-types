import React from 'react';
import { UseChatReturn } from '../hooks/useChat';
export interface ChatProviderConfig {
    socketUrl: string;
    namespace?: string;
    enableOfflineQueue?: boolean;
    enableOptimistic?: boolean;
    typingTimeout?: number;
}
export interface ChatContextValue extends Omit<UseChatReturn, 'config'> {
    config: ChatProviderConfig;
}
export interface ChatProviderProps {
    children: React.ReactNode;
    userId: string;
    userName: string;
    userAvatar?: string;
    token?: string;
    config: ChatProviderConfig;
    conversationId?: string;
}
export declare function ChatProvider({ children, userId, userName, userAvatar, token, config, conversationId, }: ChatProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useChatContext(): ChatContextValue;
export declare function useSupportChat(options: {
    userId: string;
    userName: string;
    userAvatar?: string;
    token?: string;
    apiBaseUrl: string;
    conversationId?: string;
}): UseChatReturn;
export declare function useAIMessage(options: {
    userId: string;
    userName: string;
    userAvatar?: string;
    apiBaseUrl: string;
    conversationId?: string;
}): UseChatReturn;
//# sourceMappingURL=ChatProvider.d.ts.map