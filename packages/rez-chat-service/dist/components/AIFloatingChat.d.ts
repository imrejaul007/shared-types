import { AIAppType, CustomerContext } from '../hooks/useAIChat';
export interface AIFloatingChatProps {
    /** App type for routing */
    appType: AIAppType;
    /** Industry category (hotel, restaurant, pharmacy, etc.) */
    industryCategory?: string;
    /** User ID */
    userId: string;
    /** Merchant/hotel/restaurant ID */
    merchantId?: string;
    /** Customer context for personalization */
    customerContext?: CustomerContext;
    /** Socket server URL */
    socketUrl: string;
    /** Auth token */
    token?: string;
    /** Chat button position */
    position?: 'bottom-right' | 'bottom-left';
    /** Custom theme color */
    themeColor?: string;
    /** Show/hide suggestions */
    showSuggestions?: boolean;
    /** Enable transfer to staff */
    enableTransfer?: boolean;
    /** On escalation callback */
    onEscalate?: (data: {
        reason: string;
        department?: string;
    }) => void;
    /** On action callback */
    onAction?: (action: {
        type: string;
        data: Record<string, unknown>;
    }) => void;
}
export declare function AIFloatingChat({ appType, industryCategory, userId, merchantId, customerContext, socketUrl, token, position, themeColor, showSuggestions, enableTransfer, onEscalate, onAction, }: AIFloatingChatProps): import("react/jsx-runtime").JSX.Element;
export { useAIChat } from '../hooks/useAIChat';
export type { UseAIChatOptions, UseAIChatReturn, AIAppType, AIMessage, CustomerContext } from '../hooks/useAIChat';
//# sourceMappingURL=AIFloatingChat.d.ts.map