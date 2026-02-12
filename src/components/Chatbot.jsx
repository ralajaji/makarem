import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const Chatbot = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatState, setChatState] = useState('idle'); // idle, selecting_quantity, completed
    const messagesEndRef = useRef(null);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            handleReset();
        }
    }, [isOpen]); // ESLint might warn about handleReset dependency, but it's fine here or we can extract logic

    const handleReset = () => {
        setIsTyping(true);
        setChatState('idle');
        setTimeout(() => {
            setMessages([
                {
                    id: Date.now(),
                    text: t.chatbot ? t.chatbot.greeting : "Welcome! How can I help you today?",
                    sender: 'bot'
                }
            ]);
            setIsTyping(false);
        }, 600);
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);


    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        const newUserMsg = {
            id: Date.now(),
            text: text,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Process response
        setTimeout(() => {
            processBotResponse(text);
        }, 1000);
    };

    const processBotResponse = (text) => {
        const lowerText = text.toLowerCase();
        let botResponseText = "";
        let quickActions = null;
        let nextState = chatState;

        // Helper for keywords (covers English and Arabic)
        const hasKeyword = (keywords) => keywords.some(k => lowerText.includes(k));

        if (chatState === 'idle' || chatState === 'completed') { // Allow new requests even if 'completed' state wasn't reset manually
            // Keywords
            const isPillow = hasKeyword(['pillow', 'مخدة', 'وسادة', 'وساده']);
            const isFork = hasKeyword(['fork', 'شوكة', 'شوكه']);
            const isBlanket = hasKeyword(['blanket', 'بطانية', 'لحاف', 'بطانيه']);
            const isWater = hasKeyword(['water', 'مياه', 'ماء', 'مويه']);

            if (isPillow) {
                // Pillow flow
                botResponseText = t.chatbot ? t.chatbot.howManyPillows : "How many pillows would you like?";
                quickActions = [
                    { label: t.chatbot?.optionOne || "1", value: "1" },
                    { label: t.chatbot?.optionTwo || "2", value: "2" }
                ];
                nextState = 'selecting_quantity';
            } else if (isFork || isBlanket || isWater) {
                // Direct confirm flow
                botResponseText = t.chatbot ? t.chatbot.orderCreated : "Order created and the housekeeper is coming in 5 minutes.";
                quickActions = [
                    { label: t.chatbot?.newRequest || "New Request", value: "RESET_CHAT" }
                ];
                nextState = 'completed';
            } else {
                // Fallback
                botResponseText = t.chatbot ? t.chatbot.fallback : "I can help you with housekeeping items like pillows, blankets, forks, or water.";
                nextState = 'idle';
            }
        } else if (chatState === 'selecting_quantity') {
            // Check for quantity
            const isOne = hasKeyword(['1', 'one', 'واحد', 'واحدة']);
            const isTwo = hasKeyword(['2', 'two', 'اثنين', 'إثنان']);

            if (isOne || isTwo) {
                botResponseText = t.chatbot ? t.chatbot.orderCreated : "Order created and the housekeeper is coming in 5 minutes.";
                quickActions = [
                    { label: t.chatbot?.newRequest || "New Request", value: "RESET_CHAT" }
                ];
                nextState = 'completed';
            } else {
                // Ambiguous response in quantity state? 
                // Maybe user changed mind and asked for water?
                // Let's restart logic if it matches other items, otherwise repeat question
                const isPillow = hasKeyword(['pillow', 'مخدة']);
                const isOther = hasKeyword(['fork', 'blanket', 'water', 'شوكة', 'بطانية', 'مياه']);

                if (isOther || isPillow) {
                    // Reset to idle and process again (recursive call or just manual reset logic)
                    // For simplicity, just handle as new request logic here or reset state
                    // Let's just ask again to be safe
                    botResponseText = t.chatbot ? t.chatbot.howManyPillows : "How many pillows would you like?";
                    quickActions = [
                        { label: t.chatbot?.optionOne || "1", value: "1" },
                        { label: t.chatbot?.optionTwo || "2", value: "2" }
                    ];
                } else {
                    botResponseText = t.chatbot ? t.chatbot.howManyPillows : "How many pillows would you like?";
                    quickActions = [
                        { label: t.chatbot?.optionOne || "1", value: "1" },
                        { label: t.chatbot?.optionTwo || "2", value: "2" }
                    ];
                }
            }
        }

        const newBotMsg = {
            id: Date.now() + 1,
            text: botResponseText,
            sender: 'bot',
            quickActions: quickActions
        };

        setMessages(prev => [...prev, newBotMsg]);
        setChatState(nextState);
        setIsTyping(false);
    };

    const handleQuickAction = (action) => {
        if (action.value === 'RESET_CHAT') {
            handleReset();
        } else {
            handleSendMessage(action.value);
        }
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-50 w-16 h-16 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95`}
                aria-label={t.chatbot?.toggleChat || "Toggle Chat"}
            >
                {isOpen ? (
                    <span className="material-icons-outlined text-3xl">close</span>
                ) : (
                    <span className="material-icons-outlined text-3xl">chat_bubble_outline</span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed bottom-24 ${language === 'ar' ? 'left-6' : 'right-6'} z-50 w-80 md:w-96 bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in origin-bottom-${language === 'ar' ? 'left' : 'right'}`} style={{ height: '500px', maxHeight: '80vh' }}>

                    {/* Header */}
                    <div className="bg-primary p-4 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="material-icons-outlined">support_agent</span>
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-lg">{t.chatbot ? t.chatbot.title : "Guest Services"}</h3>
                                <p className="text-xs text-white/70 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 rtl:ml-1"></span>
                                    {t.chatbot ? t.chatbot.online : "Online"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-hide">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none transform transition-all duration-300'
                                        }`}
                                >
                                    {msg.text}
                                </div>

                                {/* Quick Actions Chips */}
                                {msg.quickActions && (
                                    <div className="mt-2 flex flex-wrap gap-2 animate-fade-in">
                                        {msg.quickActions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuickAction(action)}
                                                className={`text-xs font-medium px-4 py-2 rounded-full transition-colors border shadow-sm ${action.value === 'RESET_CHAT'
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                                                    : 'bg-primary/5 hover:bg-primary/10 text-primary border-primary/10'
                                                    }`}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center space-x-1 rtl:space-x-reverse self-start bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none shadow-sm w-16 h-10">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        {/* Removed focus-within:ring-2 and focus-within:border-primary/50 to fix blue border issue */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:bg-white focus-within:shadow-md transition-all duration-300">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                                placeholder={t.chatbot ? t.chatbot.placeholder : "Type a message..."}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400 outline-none"
                            />
                            <button
                                onClick={() => handleSendMessage(inputValue)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${inputValue.trim()
                                    ? 'bg-primary text-white shadow-md hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                disabled={!inputValue.trim()}
                            >
                                <span className="material-icons-outlined text-sm rtl:-rotate-90">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
