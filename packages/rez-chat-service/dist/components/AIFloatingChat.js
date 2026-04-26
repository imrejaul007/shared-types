import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ── AI Floating Chat Component ────────────────────────────────────────────────────
// Universal AI chat widget for all ReZ ecosystem apps
import { useState, useRef, useEffect } from 'react';
import { useAIChat } from '../hooks/useAIChat';
export function AIFloatingChat({ appType, industryCategory, userId, merchantId, customerContext, socketUrl, token, position = 'bottom-right', themeColor = '#6366f1', showSuggestions = true, enableTransfer = true, onEscalate, onAction, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isTyping, isConnected, suggestions, sendMessage, selectSuggestion, transferToStaff, endChat, clearMessages, } = useAIChat({
        userId,
        appType,
        industryCategory,
        merchantId,
        customerContext,
        socketUrl,
        token,
        autoConnect: true,
        onEscalate,
        onAction,
    });
    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Open chat on mount
    useEffect(() => {
        if (isConnected) {
            setIsOpen(true);
        }
    }, [isConnected]);
    const handleSend = async () => {
        if (!inputValue.trim())
            return;
        await sendMessage(inputValue);
        setInputValue('');
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return (_jsxs("div", { style: {
            position: 'fixed',
            [position]: '20px',
            zIndex: 9999,
            fontFamily: 'system-ui, sans-serif',
        }, children: [!isOpen && (_jsx("button", { onClick: () => setIsOpen(true), style: {
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: themeColor,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                }, children: "\uD83D\uDCAC" })), isOpen && (_jsxs("div", { style: {
                    width: '380px',
                    height: '520px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }, children: [_jsxs("div", { style: {
                            backgroundColor: themeColor,
                            color: 'white',
                            padding: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: '16px' }, children: "AI Assistant" }), _jsx("div", { style: { fontSize: '12px', opacity: 0.9 }, children: isConnected ? 'Online' : 'Connecting...' })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [enableTransfer && (_jsx("button", { onClick: () => transferToStaff('User requested human help'), style: {
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                        }, children: "Transfer" })), _jsx("button", { onClick: () => {
                                            setIsOpen(false);
                                            endChat();
                                        }, style: {
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            width: '32px',
                                            height: '32px',
                                            color: 'white',
                                            cursor: 'pointer',
                                        }, children: "\u2715" })] })] }), _jsxs("div", { style: {
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }, children: [messages.map((message) => (_jsx("div", { style: {
                                    display: 'flex',
                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                }, children: _jsx("div", { style: {
                                        maxWidth: '80%',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        backgroundColor: message.sender === 'user' ? themeColor : message.sender === 'ai' ? '#f3f4f6' : '#e0e7ff',
                                        color: message.sender === 'user' ? 'white' : '#1f2937',
                                        fontSize: '14px',
                                        lineHeight: 1.5,
                                    }, children: message.content }) }, message.id))), isTyping && (_jsx("div", { style: { display: 'flex', justifyContent: 'flex-start' }, children: _jsx("div", { style: {
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        backgroundColor: '#f3f4f6',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                    }, children: "Typing..." }) })), _jsx("div", { ref: messagesEndRef })] }), showSuggestions && suggestions.length > 0 && (_jsx("div", { style: {
                            padding: '8px 16px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            borderTop: '1px solid #e5e7eb',
                        }, children: suggestions.map((suggestion, i) => (_jsx("button", { onClick: () => selectSuggestion(suggestion), style: {
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: `1px solid ${themeColor}`,
                                backgroundColor: 'transparent',
                                color: themeColor,
                                fontSize: '12px',
                                cursor: 'pointer',
                            }, children: suggestion }, i))) })), _jsxs("div", { style: {
                            padding: '12px 16px',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            gap: '8px',
                        }, children: [_jsx("input", { type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyPress: handleKeyPress, placeholder: "Type your message...", style: {
                                    flex: 1,
                                    padding: '10px 16px',
                                    borderRadius: '24px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '14px',
                                    outline: 'none',
                                } }), _jsx("button", { onClick: handleSend, disabled: !inputValue.trim(), style: {
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    backgroundColor: inputValue.trim() ? themeColor : '#e5e7eb',
                                    border: 'none',
                                    color: 'white',
                                    cursor: inputValue.trim() ? 'pointer' : 'default',
                                    fontSize: '18px',
                                }, children: "\u27A4" })] })] }))] }));
}
// ── Hook Export ─────────────────────────────────────────────────────────────────
export { useAIChat } from '../hooks/useAIChat';
//# sourceMappingURL=AIFloatingChat.js.map