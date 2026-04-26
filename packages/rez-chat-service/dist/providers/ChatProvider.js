import { jsx as _jsx } from "react/jsx-runtime";
// Chat Context Provider
// React context that provides chat functionality throughout the app
import { createContext, useContext, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
const ChatContext = createContext(null);
export function ChatProvider({ children, userId, userName, userAvatar, token, config, conversationId, }) {
    const chat = useChat({
        conversationId,
        userId,
        userName,
        userAvatar,
        apiBaseUrl: config.socketUrl,
        token,
        namespace: config.namespace,
        enableOfflineQueue: config.enableOfflineQueue,
        enableOptimistic: config.enableOptimistic,
        typingTimeout: config.typingTimeout,
        autoConnect: true,
    });
    const value = useMemo(() => ({
        ...chat,
        config,
    }), [chat, config]);
    return _jsx(ChatContext.Provider, { value: value, children: children });
}
export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}
// Convenience hooks for specific use cases
export function useSupportChat(options) {
    return useChat({
        ...options,
        namespace: 'support',
        enableOptimistic: true,
        enableOfflineQueue: true,
        typingTimeout: 3000,
    });
}
export function useAIMessage(options) {
    return useChat({
        ...options,
        namespace: 'ai',
        enableOptimistic: true,
        enableOfflineQueue: false,
        typingTimeout: 5000,
    });
}
//# sourceMappingURL=ChatProvider.js.map