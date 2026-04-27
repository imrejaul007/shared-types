export * from './types';
export * from './types/hotel';
export * from './types/store';
export { ChatSocketClient, getChatSocket, destroyChatSocket } from './core/ChatSocketClient';
export type { ChatSocketConfig, ChatSocketOptions } from './core/ChatSocketClient';
export { useChat } from './hooks/useChat';
export type { UseChatOptions, UseChatReturn } from './hooks/useChat';
export { useHotelChat } from './hooks/useHotelChat';
export type { UseHotelChatOptions, UseHotelChatReturn } from './hooks/useHotelChat';
export { useAIChat } from './hooks/useAIChat';
export type { UseAIChatOptions, UseAIChatReturn, AIAppType, AIMessage, CustomerContext } from './hooks/useAIChat';
export { ChatProvider, useChatContext, useSupportChat, useAIMessage } from './providers/ChatProvider';
export type { ChatProviderConfig, ChatProviderProps, ChatContextValue } from './providers/ChatProvider';
export { CHAT_EVENTS } from './types';
export { HOTEL_CHAT_EVENTS, HOTEL_CHAT_ENDPOINTS } from './types/hotel';
export { STORE_CHAT_EVENTS, STORE_CHAT_ENDPOINTS } from './types/store';
export { AIFloatingChat } from './components/AIFloatingChat';
//# sourceMappingURL=index.d.ts.map