import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, Minimize2, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { knowledgeApi } from '@/lib/api';
import { useSearchParams } from 'react-router-dom';

interface ChatbotPreviewProps {
  chatbotId?: string;
  botName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  primaryOpacity?: number;
  userBubbleColor?: string;
  userBubbleOpacity?: number;
  agentBubbleColor?: string;
  agentBubbleOpacity?: number;
  chatBackgroundColor?: string;
  chatBackgroundOpacity?: number;
  theme?: string;
  icon?: string;
  cornerRadius?: number;
  bubbleRadius?: number;
  bubbleStyle?: string;
  effect?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  branding?: {
    enabled: boolean;
    text: string;
    link: string;
  };
  gradients?: {
    header?: boolean;
    userBubble?: boolean;
    agentBubble?: boolean;
    launcher?: boolean;
  };
}

interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  knowledge_used?: boolean;
  chunks_used?: number;
}

const ChatbotPreview = ({ 
  chatbotId,
  botName = "AI Assistant", 
  welcomeMessage = "Hello! How can I help you today?",
  primaryColor = "bg-green-500",
  primaryOpacity = 100,
  userBubbleColor = "bg-blue-500",
  userBubbleOpacity = 90,
  agentBubbleColor = "bg-gray-500",
  agentBubbleOpacity = 85,
  chatBackgroundColor = "bg-slate-500",
  chatBackgroundOpacity = 80,
  theme = "modern",
  icon = "🤖",
  cornerRadius = 24,
  bubbleRadius = 24,
  bubbleStyle = "rounded",
  effect = "glass",
  position = "bottom-right",
  branding = { enabled: true, text: "Powered by Your Company", link: "" },
  gradients = { header: true, launcher: true }
}: ChatbotPreviewProps) => {
  const [searchParams] = useSearchParams();
  const [sessionId] = useState(() => `preview-session-${Date.now()}`);
  
  const [isOpen, setIsOpen] = useState(true);
  const [launcherStyle, setLauncherStyle] = useState<'bubble' | 'minimal' | 'floating'>('bubble');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', text: welcomeMessage, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages(prev => [
      { type: 'bot', text: welcomeMessage, timestamp: new Date() },
      ...prev.slice(1)
    ]);
  }, [welcomeMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const newUserMessage: ChatMessage = { 
      type: 'user', 
      text: inputValue, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    
    // Always try real AI agent API first
    try {
      if (!chatbotId) {
        throw new Error('No chatbot ID provided');
      }
      
      const response = await knowledgeApi.chatWithKnowledge(chatbotId, userInput, sessionId);
      
      setIsTyping(false);
      const botResponse: ChatMessage = { 
        type: 'bot', 
        text: response.response,
        timestamp: new Date(),
        knowledge_used: response.knowledge_used,
        chunks_used: response.chunks_used
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    } catch (error: any) {
      console.error('AI agent error in preview:', error);
      
      // If API fails, show helpful message based on error type
      setIsTyping(false);
      let errorMessage = "I'm having trouble connecting. Please try again.";
      
      if (error.message === 'No chatbot ID provided') {
        errorMessage = "Please save your chatbot first before testing the chat functionality.";
      } else if (error.response?.status === 404) {
        errorMessage = "Chatbot not found. Please save your chatbot first.";
      } else if (error.response?.status === 500) {
        const errorData = error.response?.data;
        if (errorData?.error?.includes('API key')) {
          errorMessage = "AI service is not configured. Please ensure API keys are set in the backend.";
        } else {
          errorMessage = "Server error. Please check if the backend is running properly.";
        }
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      }
      
      const errorResponse: ChatMessage = { 
        type: 'bot', 
        text: errorMessage,
        timestamp: new Date(),
        knowledge_used: false,
        chunks_used: 0
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const convertColorWithOpacity = (tailwindColor: string, opacity: number) => {
    const colorMap: { [key: string]: string } = {
      'bg-green-500': '#10B981',
      'bg-blue-500': '#3B82F6',
      'bg-purple-500': '#8B5CF6',
      'bg-orange-500': '#F97316',
      'bg-red-500': '#EF4444',
      'bg-pink-500': '#EC4899',
      'bg-indigo-500': '#6366F1',
      'bg-teal-500': '#14B8A6',
      'bg-gray-500': '#6B7280',
      'bg-slate-500': '#64748B'
    };
    
    const hex = colorMap[tailwindColor] || '#10B981';
    const alpha = opacity / 100;
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getHeaderStyle = () => {
    const baseColor = convertColorWithOpacity(primaryColor, primaryOpacity);
    
    switch(effect) {
      case 'glass':
      case 'glass-tinted':
        if (gradients?.header) {
          const baseOpaque = convertColorWithOpacity(primaryColor, Math.min(100, primaryOpacity + 10));
          return {
            background: `linear-gradient(to right, ${baseColor}, ${baseOpaque})`,
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          };
        }
        return {
          backgroundColor: baseColor,
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        };
      case 'liquid':
        const liquidColor1 = convertColorWithOpacity(primaryColor, Math.max(15, primaryOpacity - 20));
        const liquidColor2 = convertColorWithOpacity(primaryColor, Math.max(25, primaryOpacity - 10));
        const liquidColor3 = convertColorWithOpacity(primaryColor, primaryOpacity);
        return {
          background: `linear-gradient(135deg, ${liquidColor1}, ${liquidColor2} 50%, ${liquidColor3})`,
          backdropFilter: 'blur(20px) saturate(150%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        };
      case 'bubbles':
        return {
          background: `linear-gradient(135deg, ${baseColor}, rgba(147, 51, 234, 0.3))`,
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        };
      default:
        if (gradients?.header) {
          const baseOpaque = convertColorWithOpacity(primaryColor, Math.min(100, primaryOpacity + 10));
          return {
            background: `linear-gradient(to right, ${baseColor}, ${baseOpaque})`
          };
        }
        return {
          backgroundColor: baseColor
        };
    }
  };

  const getFooterStyle = () => {
    const baseColor = convertColorWithOpacity(primaryColor, Math.max(20, primaryOpacity - 30));
    
    switch(effect) {
      case 'glass':
      case 'glass-tinted':
        return {
          backgroundColor: baseColor,
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        };
      case 'liquid':
        const liquidColor1 = convertColorWithOpacity(primaryColor, Math.max(10, primaryOpacity - 40));
        const liquidColor2 = convertColorWithOpacity(primaryColor, Math.max(20, primaryOpacity - 25));
        return {
          background: `linear-gradient(45deg, ${liquidColor1}, ${liquidColor2})`,
          backdropFilter: 'blur(20px) saturate(150%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)'
        };
      case 'bubbles':
        return {
          background: `linear-gradient(45deg, ${baseColor}, rgba(147, 51, 234, 0.2))`,
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        };
      default:
        return {
          backgroundColor: baseColor
        };
    }
  };

  const getUserBubbleStyle = () => {
    const baseColor = convertColorWithOpacity(userBubbleColor, userBubbleOpacity);
    
    if (gradients?.userBubble) {
      const lighterColor = convertColorWithOpacity(userBubbleColor, Math.min(100, userBubbleOpacity + 10));
      return {
        background: `linear-gradient(to right, ${baseColor}, ${lighterColor})`
      };
    }
    return {
      backgroundColor: baseColor
    };
  };

  const getAgentBubbleStyle = () => {
    if (gradients?.agentBubble) {
      const baseColor = convertColorWithOpacity(agentBubbleColor, agentBubbleOpacity);
      const lighterColor = convertColorWithOpacity(agentBubbleColor, Math.min(100, agentBubbleOpacity + 10));
      return {
        background: `linear-gradient(to right, ${baseColor}, ${lighterColor})`
      };
    }
    
    switch(effect) {
      case 'solid':
        return { backgroundColor: '#374151' };
      case 'solid-colored':
        return { backgroundColor: convertColorWithOpacity(agentBubbleColor, agentBubbleOpacity) };
      default:
        return { backgroundColor: convertColorWithOpacity(agentBubbleColor, agentBubbleOpacity) };
    }
  };

  const getLauncherStyle = () => {
    const baseColor = convertColorWithOpacity(primaryColor, primaryOpacity);
    
    if (gradients?.launcher) {
      const lighterColor = convertColorWithOpacity(primaryColor, Math.min(100, primaryOpacity + 10));
      return {
        background: `linear-gradient(to right, ${baseColor}, ${lighterColor})`
      };
    }
    return {
      backgroundColor: baseColor
    };
  };

  const getChatBackgroundStyle = () => {
    const bgColor = convertColorWithOpacity(chatBackgroundColor, chatBackgroundOpacity);
    
    switch(effect) {
      case 'glass':
        return { 
          backgroundColor: bgColor,
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        };
      case 'glass-tinted':
        return { 
          backgroundColor: bgColor,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        };
      case 'solid':
        return { backgroundColor: '#0F172A' };
      case 'solid-colored':
        return { backgroundColor: bgColor };
      case 'bubbles':
        return { 
          background: `linear-gradient(135deg, ${bgColor}, rgba(15, 23, 42, 0.3), rgba(30, 41, 59, 0.4))`,
          backdropFilter: 'blur(12px)'
        };
      case 'liquid':
        return { 
          background: `linear-gradient(135deg, ${bgColor}, rgba(15, 23, 42, 0.2), rgba(30, 41, 59, 0.25))`,
          backdropFilter: 'blur(16px)'
        };
      default:
        return { 
          backgroundColor: bgColor,
          backdropFilter: 'blur(16px)'
        };
    }
  };

  const getEffectStyles = () => {
    const baseColor = primaryColor.replace('bg-', '').replace('-500', '');
    switch(effect) {
      case 'glass':
        return `bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl`;
      case 'glass-tinted':
        return `bg-${baseColor}-500/20 backdrop-blur-xl border border-${baseColor}-200/30 shadow-2xl`;
      case 'solid':
        return `bg-slate-900 border border-slate-700 shadow-xl`;
      case 'solid-colored':
        return `bg-${baseColor}-50 border border-${baseColor}-200 shadow-xl`;
      case 'bubbles':
        return `bg-gradient-to-br from-${baseColor}-500/20 to-purple-600/20 backdrop-blur-lg border border-white/30 shadow-2xl`;
      case 'liquid':
        return `bg-gradient-to-br from-${baseColor}-400/15 via-${baseColor}-500/20 to-${baseColor}-600/15 backdrop-blur-2xl border border-${baseColor}-200/30 shadow-2xl`;
      default:
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl';
    }
  };

  const getPositionStyles = () => {
    return position === 'bottom-left' ? 'bottom-6 left-6' : 'bottom-6 right-6';
  };

  const getInputStyles = () => {
    switch(effect) {
      case 'solid':
        return 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-400';
      case 'solid-colored':
        const baseColor = primaryColor.replace('bg-', '').replace('-500', '');
        return `bg-${baseColor}-50 border-${baseColor}-200 text-slate-800 placeholder:text-slate-500`;
      default:
        return 'bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm';
    }
  };

  const getFooterStyles = () => {
    switch(effect) {
      case 'solid':
        return 'bg-slate-800 border-slate-600';
      case 'solid-colored':
        const baseColor = primaryColor.replace('bg-', '').replace('-500', '');
        return `bg-${baseColor}-50 border-${baseColor}-200`;
      default:
        return 'bg-slate-800/30 backdrop-blur-sm border-white/20';
    }
  };

  const getBubbleStyles = (messageType: string) => {
    const baseStyles = `max-w-[80%] p-3 transform transition-all duration-300 hover:scale-105`;
    
    if (messageType === 'user') {
      return `${baseStyles} text-white shadow-md`;
    } else {
      return `${baseStyles} text-white shadow-md`;
    }
  };

  const getBubbleShapeStyles = () => {
    switch(bubbleStyle) {
      case 'square':
        return { borderRadius: '4px' };
      case 'tail':
        return { 
          borderRadius: `${bubbleRadius}px`,
          position: 'relative' as const
        };
      default:
        return { borderRadius: `${bubbleRadius}px` };
    }
  };

  const renderLauncherIcon = () => {
    const baseColor = primaryColor.replace('bg-', '').replace('-500', '');
    const gradientClass = gradients?.launcher 
      ? `bg-gradient-to-r from-${baseColor}-500 to-${baseColor}-600`
      : `bg-${baseColor}-500`;

    switch(launcherStyle) {
      case 'minimal':
        return (
          <Button
            onClick={() => setIsOpen(true)}
            className={`w-12 h-12 rounded-lg ${gradientClass} hover:scale-110 transition-all duration-300 shadow-lg`}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        );
      case 'floating':
        return (
          <Button
            onClick={() => setIsOpen(true)}
            className={`w-16 h-16 rounded-full ${gradientClass} hover:scale-110 transition-all duration-300 shadow-2xl animate-bounce`}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => setIsOpen(true)}
            className={`w-16 h-16 rounded-full ${gradientClass} hover:scale-110 transition-all duration-300 shadow-2xl animate-pulse`}
          >
            <span className="text-2xl">{icon}</span>
          </Button>
        );
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className={`fixed ${getPositionStyles()} z-50`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl"
          style={getLauncherStyle()}
        >
          <span className="text-2xl">{icon}</span>
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`fixed ${getPositionStyles()} z-50 w-80 h-96 overflow-hidden animate-scale-in flex flex-col`}
      style={{ 
        borderRadius: `${cornerRadius}px`,
        ...getChatBackgroundStyle()
      }}
    >
      {/* Header - Fixed at top with background and glass effect */}
      <div 
        className="p-4 flex items-center justify-between flex-shrink-0 relative z-10"
        style={getHeaderStyle()}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-lg">{icon}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-semibold text-sm leading-tight">{botName}</h3>
            <div className="text-white/80 text-xs flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 transition-all duration-200"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages - Scrollable middle section */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} opacity-0 animate-fade-in`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex flex-col max-w-[80%]">
              <div
                className={getBubbleStyles(message.type)}
                style={{
                  borderRadius: `${bubbleRadius}px`,
                  ...(message.type === 'user' ? getUserBubbleStyle() : getAgentBubbleStyle())
                }}
              >
                <p className="text-sm">{message.text}</p>
                {bubbleStyle === 'tail' && message.type === 'user' && (
                  <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-0 h-0 border-l-8 border-r-0 border-t-8 border-b-8 border-l-current border-t-transparent border-b-transparent"></div>
                )}
                {bubbleStyle === 'tail' && message.type === 'bot' && (
                  <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-0 h-0 border-r-8 border-l-0 border-t-8 border-b-8 border-r-current border-t-transparent border-b-transparent"></div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <div
              className={getBubbleStyles('bot')}
              style={{
                borderRadius: `${bubbleRadius}px`,
                ...getAgentBubbleStyle()
              }}
            >
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer - Fixed at bottom with background and glass effect */}
      <div 
        className="p-4 flex-shrink-0"
        style={getFooterStyle()}
      >
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your knowledge base..."
            className={`flex-1 ${getInputStyles()} focus:ring-2 focus:ring-${primaryColor.replace('bg-', '').replace('-500', '')}-500/50 transition-all duration-200`}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="hover:scale-105 transition-all duration-200 shadow-lg"
            style={getUserBubbleStyle()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {branding?.enabled && (
          <div className="mt-2 text-center">
            {branding.link ? (
              <a 
                href={branding.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-white/60 hover:text-white/80 hover:underline transition-colors"
              >
                {branding.text}
              </a>
            ) : (
              <span className="text-xs text-white/60">
                {branding.text}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotPreview;
