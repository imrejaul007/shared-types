// ── AI Chat Hook ──────────────────────────────────────────────────────────────────
// AI-powered chat hook for all ReZ ecosystem apps
// Works with hotel, restaurant, retail, support, and general queries
import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
// ── AI Socket Events ───────────────────────────────────────────────────────────
const AI_EVENTS = {
    JOIN: 'ai:join',
    MESSAGE: 'ai:message',
    SUGGESTION: 'ai:suggestion',
    TRANSFER: 'ai:transfer',
    END: 'ai:end',
    TYPING: 'ai:typing',
    JOINED: 'ai:joined',
    AI_TYPING: 'ai:typing',
    AI_MESSAGE: 'ai:message',
    ACTION_RESULT: 'ai:action-result',
    ENDED: 'ai:ended',
    ERROR: 'error',
};
// ── Hook Implementation ─────────────────────────────────────────────────────────
export function useAIChat(options) {
    const { userId, conversationId: initialConversationId, appType, industryCategory, merchantId, customerContext, socketUrl, token, autoConnect = true, enableSuggestions = true, onEscalate, onAction, } = options;
    // ── State ─────────────────────────────────────────────────────────────────
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [conversationId, setConversationId] = useState(initialConversationId || null);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const conversationIdRef = useRef(initialConversationId || null);
    const hasJoined = useRef(false);
    // ── Get Namespace ────────────────────────────────────────────────────────
    const getNamespace = useCallback((type) => {
        const namespaces = {
            hotel: '/ai/hotel',
            'room-qr': '/ai/room-qr',
            'web-menu': '/ai/web-menu',
            restaurant: '/ai/restaurant',
            retail: '/ai/retail',
            support: '/ai/support',
            general: '/ai/general',
        };
        return namespaces[type] || '/ai/general';
    }, []);
    // ── Connect ──────────────────────────────────────────────────────────────
    const connect = useCallback(() => {
        if (socketRef.current?.connected)
            return;
        setIsConnecting(true);
        setError(null);
        const namespace = getNamespace(appType);
        const url = `${socketUrl}${namespace}`;
        const socket = io(url, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling'],
            auth: token ? { token } : {},
        });
        socket.on('connect', () => {
            setIsConnected(true);
            setIsConnecting(false);
            logger.info('[useAIChat] Connected to', namespace);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
            logger.info('[useAIChat] Disconnected');
        });
        socket.on('connect_error', (err) => {
            setError(`Connection failed: ${err.message}`);
            setIsConnecting(false);
        });
        // ── Joined ──────────────────────────────────────────────────────────
        socket.on(AI_EVENTS.JOINED, (data) => {
            conversationIdRef.current = data.conversationId;
            setConversationId(data.conversationId);
            hasJoined.current = true;
        });
        // ── AI Typing ──────────────────────────────────────────────────────
        socket.on(AI_EVENTS.AI_TYPING, (data) => {
            setIsTyping(data.isTyping);
        });
        // ── AI Message ─────────────────────────────────────────────────────
        socket.on(AI_EVENTS.AI_MESSAGE, (message) => {
            setMessages((prev) => [...prev, message]);
            if (message.metadata?.suggestions) {
                setSuggestions(message.metadata.suggestions);
            }
        });
        // ── Action Result ─────────────────────────────────────────────────
        socket.on(AI_EVENTS.ACTION_RESULT, (data) => {
            onAction?.({ type: data.actionType, data: { status: data.status, message: data.message } });
        });
        // ── Escalate ──────────────────────────────────────────────────────
        socket.on('ai:escalate', (data) => {
            onEscalate?.(data);
        });
        // ── Error ─────────────────────────────────────────────────────────
        socket.on(AI_EVENTS.ERROR, (data) => {
            setError(data.message);
        });
        // ── End ───────────────────────────────────────────────────────────
        socket.on(AI_EVENTS.ENDED, () => {
            // Chat session ended
        });
        socketRef.current = socket;
    }, [appType, socketUrl, token, getNamespace, onEscalate, onAction]);
    // ── Disconnect ─────────────────────────────────────────────────────────
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
            hasJoined.current = false;
        }
    }, []);
    // ── Join Conversation ───────────────────────────────────────────────────
    const joinConversation = useCallback((convId) => {
        if (!socketRef.current?.connected)
            return;
        const convIdToUse = convId || conversationIdRef.current || `conv_${userId}_${Date.now()}`;
        socketRef.current.emit(AI_EVENTS.JOIN, {
            appType,
            industryCategory,
            merchantId,
            conversationId: convIdToUse,
            userId,
            customerContext,
        });
    }, [appType, industryCategory, merchantId, userId, customerContext]);
    // ── Send Message ───────────────────────────────────────────────────────
    const sendMessage = useCallback(async (content) => {
        if (!socketRef.current?.connected) {
            // Queue message for when connected
            return;
        }
        const convId = conversationIdRef.current || `conv_${userId}_${Date.now()}`;
        // Add user message to UI immediately
        const userMessage = {
            id: `user_${Date.now()}`,
            content,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);
        // Send to server
        socketRef.current.emit(AI_EVENTS.MESSAGE, {
            conversationId: convId,
            userId,
            content,
            customerContext,
            appType,
            industryCategory,
            merchantId,
        });
    }, [userId, customerContext, appType, industryCategory, merchantId]);
    // ── Select Suggestion ─────────────────────────────────────────────────
    const selectSuggestion = useCallback(async (suggestion) => {
        if (!socketRef.current?.connected)
            return;
        socketRef.current.emit(AI_EVENTS.SUGGESTION, {
            conversationId: conversationIdRef.current,
            suggestion,
            customerContext,
        });
    }, [customerContext]);
    // ── Transfer to Staff ─────────────────────────────────────────────────
    const transferToStaff = useCallback((reason, department) => {
        if (!socketRef.current?.connected)
            return;
        socketRef.current.emit(AI_EVENTS.TRANSFER, {
            conversationId: conversationIdRef.current,
            reason: reason || 'User requested human assistance',
            department,
        });
    }, []);
    // ── End Chat ─────────────────────────────────────────────────────────
    const endChat = useCallback((rating) => {
        if (!socketRef.current?.connected)
            return;
        socketRef.current.emit(AI_EVENTS.END, {
            conversationId: conversationIdRef.current,
            rating,
        });
        disconnect();
    }, [disconnect]);
    // ── Clear Messages ────────────────────────────────────────────────────
    const clearMessages = useCallback(() => {
        setMessages([]);
        setSuggestions([]);
    }, []);
    // ── Effects ───────────────────────────────────────────────────────────
    // Auto connect
    useEffect(() => {
        if (autoConnect) {
            connect();
        }
        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);
    // Auto join when connected
    useEffect(() => {
        if (isConnected && !hasJoined.current) {
            joinConversation();
        }
    }, [isConnected, joinConversation]);
    // ── Return ────────────────────────────────────────────────────────────
    return {
        messages,
        isTyping,
        isConnected,
        isConnecting,
        conversationId,
        suggestions,
        error,
        sendMessage,
        selectSuggestion,
        transferToStaff,
        endChat,
        clearMessages,
        connect,
        disconnect,
        socketRef,
    };
}
// ── Logger (for development) ─────────────────────────────────────────────────
const logger = {
    info: (...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('[useAIChat]', ...args);
        }
    },
    error: (...args) => {
        console.error('[useAIChat]', ...args);
    },
};
//# sourceMappingURL=useAIChat.js.map