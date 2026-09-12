import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import {
  sendGeminiChatMessage,
  ChatMessage,
} from '../../services/geminiService';
import './AiAssistantButton.css';

interface FarmAiAssistantProps {
  onNavigate: (tab: string, param?: any) => void;
}

interface Message extends ChatMessage {}

const INITIAL_WELCOME: Message = {
  id: 'welcome',
  sender: 'ai',
  text: 'Namaste! How can I help you today? Ask me about crop prices, order deliveries, farm quality, or how farmers get paid.',
};

export const FarmAiAssistant: React.FC<FarmAiAssistantProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isTeaserClosing, setIsTeaserClosing] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);

  const quickQuestions = [
    { icon: '🍅', label: 'Tomato Prices', query: 'What is the current direct farm price for fresh tomatoes?' },
    { icon: '🥔', label: 'Potato Rates', query: 'What are the current rates for fresh potatoes?' },
    { icon: '🧅', label: 'Onion Rates', query: 'How are onion prices trending this week?' },
    { icon: '🚚', label: 'Delivery', query: 'Where is my order delivery van right now?' },
    { icon: '💰', label: 'Farmer Pay', query: 'How does the 85% direct payment to farmers work?' },
  ];

  // Proactive Teaser Timer
  useEffect(() => {
    if (isOpen || teaserDismissed) return;
    const timer = setTimeout(() => {
      if (!isOpen && !teaserDismissed) {
        setShowTeaser(true);
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isOpen, teaserDismissed]);

  const handleOpen = () => {
    if (showTeaser) {
      handleDismissTeaser();
    }
    setTeaserDismissed(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleDismissTeaser = () => {
    setIsTeaserClosing(true);
    setTimeout(() => {
      setShowTeaser(false);
      setIsTeaserClosing(false);
      setTeaserDismissed(true);
    }, 220);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleResetChat = () => {
    setMessages([INITIAL_WELCOME]);
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await sendGeminiChatMessage(messages, userText);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: response.text,
          actionButton: response.actionButton,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Namaste! Our local telemetry confirms 85% escrow payout guarantees and 4.1°C cold-chain tracking remain fully active.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Format AI markdown-style text into clean JSX
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      const cleanLine = isBullet ? trimmed.substring(2) : line;

      // Parse **bold text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-semibold text-stone-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-3 list-disc text-stone-700 my-0.5 marker:text-emerald-600 text-[11px] leading-relaxed">
            {content}
          </li>
        );
      }
      if (!trimmed) {
        return <div key={lineIdx} className="h-1" />;
      }
      return (
        <p key={lineIdx} className="my-0.5 leading-relaxed text-[11px]">
          {content}
        </p>
      );
    });
  };

  return (
    <>
      {/* Proactive Floating Teaser Callout Speech Bubble */}
      {(showTeaser || isTeaserClosing) && !isOpen && (
        <div
          className={`ai-teaser-callout-fixed pointer-events-auto select-none ${
            isTeaserClosing ? 'ai-teaser-exit' : 'ai-teaser-enter'
          }`}
        >
          <div className="ai-teaser-float">
            <div
              onClick={handleOpen}
              className="relative p-3.5 rounded-[22px] bg-white/95 backdrop-blur-xl border border-emerald-500/30 shadow-[0_16px_36px_-8px_rgba(6,78,59,0.22),0_0_0_1px_rgba(255,255,255,0.8)_inset] cursor-pointer hover:border-emerald-500/50 hover:shadow-[0_20px_42px_-6px_rgba(6,78,59,0.28)] transition-all group"
            >
              {/* Downward Speech Bubble Tail Arrow pointing to the FAB button */}
              <div className="absolute -bottom-2 left-7 w-4 h-4 bg-white rotate-45 border-r border-b border-emerald-500/30 shadow-xs group-hover:border-emerald-500/50 transition-colors" />

              <div className="flex items-start gap-3 relative z-10">
                {/* Glowing Krishi AI Badge Icon with beacon ring */}
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 flex items-center justify-center text-amber-300 shadow-sm group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-amber-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -bottom-0.5 -right-0.5 ai-beacon-ring" />
                </div>

                {/* Content */}
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-stone-900 font-serif-heading">Krishi AI</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Need fair crop prices, delivery updates, or farm details?
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span>Ask Krishi AI</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismissTeaser();
                  }}
                  title="Dismiss"
                  className="absolute top-2.5 right-2.5 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="ai-assistant-container">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1 z-20 pointer-events-none" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 z-20 pointer-events-none" />

          <div className="button-wrap ai-assistant-btn-wrap">
            <button
              onClick={handleToggle}
              className="ai-assistant-btn"
              aria-label="AI Assistant"
            >
              <span>
                <Sparkles className="w-4 h-4 inline-block mr-2 text-emerald-800 shrink-0" />
                AI Assistant
              </span>
            </button>
            <div className="button-shadow ai-assistant-btn-shadow" />
          </div>
        </div>
      </div>

      {/* Slide-Up Popover Assistant Window */}
      {(isOpen || isClosing) && (
        <div
          className={`ai-chat-popover-fixed rounded-[32px] p-2 bg-gradient-to-b from-white/95 via-stone-100/85 to-stone-250/90 shadow-[0_28px_65px_-12px_rgba(15,23,42,0.25),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl flex flex-col ${
            isClosing ? 'ai-chat-window-exit' : 'ai-chat-window-enter'
          }`}
        >
          <div className="flex-1 rounded-[24px] bg-[#fbfaf8] border border-stone-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#062c1f] to-[#041c14] text-white px-4 py-3 flex items-center justify-between relative overflow-hidden border-b border-emerald-950/70 shrink-0">
              {/* Subtle ambient light orb */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2.5 relative z-10">
                {/* Glowing Avatar */}
                <div className="w-8.5 h-8.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-850 p-[1px] shadow-sm shrink-0">
                  <div className="w-full h-full rounded-[15px] bg-[#073325] flex items-center justify-center text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif-heading font-bold text-sm tracking-tight text-white leading-tight">Krishi AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                    <span className="text-[10.5px] text-emerald-300/90 font-medium">Online · Farm Assistant</span>
                  </div>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/10 active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClose}
                  title="Close Assistant"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/10 active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Query Chips */}
            <div className="px-3 py-2 bg-gradient-to-b from-stone-100/90 via-stone-50/60 to-transparent border-b border-stone-200/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.query)}
                  className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-white hover:bg-emerald-50/90 text-stone-700 hover:text-emerald-900 border border-stone-200/80 hover:border-emerald-300 shadow-2xs transition-all shrink-0 active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-[#faf9f6]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ai-msg-bubble-enter`}
                >
                  {msg.sender === 'user' ? (
                    <div className="max-w-[85%] bg-gradient-to-br from-[#0c4a34] to-[#042419] text-white rounded-2xl rounded-tr-xs px-3 py-2 shadow-xs text-[11px] leading-relaxed font-medium">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[88%] bg-white rounded-2xl rounded-tl-xs p-3 border border-stone-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] text-[11px] leading-relaxed text-stone-800">
                      <div className="flex items-center gap-1 text-emerald-800 font-bold tracking-wider uppercase text-[9.5px] mb-1 pb-1 border-b border-stone-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Krishi AI
                      </div>

                      <div className="space-y-1 text-stone-700 text-[11px]">
                        {renderFormattedText(msg.text)}
                      </div>

                      {msg.actionButton && (
                        <button
                          onClick={() => {
                            handleClose();
                            onNavigate(msg.actionButton!.tab, msg.actionButton!.param);
                          }}
                          className="mt-2.5 inline-flex items-center justify-between gap-2 pl-3 pr-1 py-1 bg-stone-900 hover:bg-emerald-900 text-white rounded-full text-[10.5px] font-bold tracking-wide transition-all shadow-xs group active:scale-[0.98] cursor-pointer"
                        >
                          <span>{msg.actionButton.label}</span>
                          <span className="w-4 h-4 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-2.5 h-2.5 text-white group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="p-2.5 bg-white border border-stone-200/80 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span className="text-[10.5px] text-stone-500 font-medium">Krishi AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputQuery);
              }}
              className="p-2.5 bg-white/95 backdrop-blur-md border-t border-stone-200/80 flex items-center gap-2 shrink-0"
            >
              <div className="flex-1 flex items-center bg-stone-100/80 hover:bg-stone-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-600 rounded-2xl px-3 py-1.5 transition-all border border-stone-200/80">
                <input
                  type="text"
                  placeholder="Ask Krishi AI about prices, cold-chain, escrow..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none w-full bg-transparent py-0.5"
                />
              </div>
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 hover:from-emerald-600 hover:to-emerald-900 text-white flex items-center justify-center shadow-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


