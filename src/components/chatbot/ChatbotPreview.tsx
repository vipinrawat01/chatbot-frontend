import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, Minimize2, MessageCircle, Sparkles, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { knowledgeApi } from '@/lib/api';
import { useSearchParams } from 'react-router-dom';

interface ChatbotPreviewProps {
  chatbotId: string;
  botName: string;
  welcomeMessage: string;
  primaryColor: string;
  primaryOpacity: number;
  userBubbleColor: string;
  userBubbleOpacity: number;
  agentBubbleColor: string;
  agentBubbleOpacity: number;
  chatBackgroundColor: string;
  chatBackgroundOpacity: number;
  userTextColor: string;
  agentTextColor: string;
  theme: string;
  icon: string;
  cornerRadius: number;
  bubbleRadius: number;
  bubbleStyle: string;
  effect: string;
  position: 'bottom-right' | 'bottom-left';
  branding: {
    enabled: boolean;
    text: string;
    link: string;
  };
  gradients: {
    header: boolean;
    userBubble: boolean;
    agentBubble: boolean;
    launcher: boolean;
  };
  width?: number;
  height?: number;
  backgroundImage?: string | null;
  // Voice message settings
  voiceEnabled?: boolean;
  voiceButtonColor?: string;
  voiceButtonOpacity?: number;
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
  botName,
  welcomeMessage,
  primaryColor,
  primaryOpacity,
  userBubbleColor,
  userBubbleOpacity,
  agentBubbleColor,
  agentBubbleOpacity,
  chatBackgroundColor,
  chatBackgroundOpacity,
  userTextColor,
  agentTextColor,
  theme,
  icon,
  cornerRadius,
  bubbleRadius,
  bubbleStyle,
  effect,
  position,
  branding,
  gradients,
  width = 320,
  height = 384,
  backgroundImage,
  voiceEnabled,
  voiceButtonColor,
  voiceButtonOpacity
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

  // Voice message state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

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
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage, timestamp: new Date() }]);
    setIsTyping(true);
    
    try {
      const response = await knowledgeApi.chatWithKnowledge(chatbotId, userMessage, sessionId);
      if (response.success) {
        const botResponse = response.response;
        setMessages(prev => [...prev, { 
        type: 'bot', 
          text: botResponse, 
        timestamp: new Date(),
        knowledge_used: response.knowledge_used,
        chunks_used: response.chunks_used
        }]);
        
        // Auto-speak the bot response if voice is enabled
        if (voiceEnabled) {
          speakText(botResponse);
        }
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Sorry, I encountered an error. Please try again.', 
          timestamp: new Date() 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice message functions
  const startSpeechRecognition = () => {
    if (!voiceEnabled) return;
    
    try {
      // Use Web Speech API for speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

              recognition.onstart = () => {
          setIsListening(true);
        };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        
        // Auto-send the transcribed text
        setInputValue(transcript);
        setTimeout(() => {
          handleSendMessage();
        }, 100);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      // Auto-stop after 3 seconds of silence
      setTimeout(() => {
        if (isListening) {
          recognition.stop();
        }
      }, 3000);

      recognition.start();
      setRecognition(recognition);
      
    } catch (error) {
      alert('Could not start speech recognition. Please check permissions.');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      // Silent error handling for TTS
    }
  };

  const convertTailwindToHex = (tailwindColor: string) => {
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
    
    return colorMap[tailwindColor] || tailwindColor;
  };

  const convertColorWithOpacity = (color: string, opacity: number) => {
    // If it's already a hex color, use it directly
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const alpha = opacity / 100;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // If it's a Tailwind class, convert it
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
    
    const hex = colorMap[color] || '#10B981';
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
    let baseStyle = '';
    
    if (backgroundImage) {
      baseStyle = `background-image: url('${backgroundImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
    }
    
    const colorStyle = `background-color: ${convertTailwindToHex(chatBackgroundColor)};`;
    
    let result = '';
    switch (effect) {
      case 'glass':
        result = `${baseStyle} ${colorStyle} backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1);`;
        break;
      case 'glass-tinted':
        result = `${baseStyle} ${colorStyle} backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2);`;
        break;
      case 'solid':
        result = `${baseStyle} background-color: #0F172A;`;
        break;
      case 'solid-colored':
        result = `${baseStyle} ${colorStyle}`;
        break;
      case 'bubbles':
        result = `${baseStyle} background: linear-gradient(135deg, ${convertTailwindToHex(primaryColor)}CC, rgba(147, 51, 234, 0.6)); backdrop-filter: blur(16px); border: 1px solid ${convertTailwindToHex(primaryColor)}4D;`;
        break;
      case 'liquid':
        result = `${baseStyle} background: linear-gradient(135deg, ${convertTailwindToHex(chatBackgroundColor)}, rgba(15, 23, 42, 0.2), rgba(30, 41, 59, 0.25)); backdrop-filter: blur(16px);`;
        break;
      default:
        result = `${baseStyle} ${colorStyle} backdrop-filter: blur(16px);`;
    }
    
    return result;
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
    <>
      {/* Chatbot Container - positioned like it would be on a real website */}
      <div 
        className="chatbot-container"
        style={{
          position: 'fixed',
          [position.includes('right') ? 'right' : 'left']: '24px',
          [position.includes('bottom') ? 'bottom' : 'top']: '24px',
          zIndex: 9999
        }}
      >
          {/* Launcher Button - always visible */}
          <button 
            className="chatbot-launcher"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: 'none',
              color: 'white',
              background: gradients.launcher 
                ? `linear-gradient(to right, ${convertTailwindToHex(primaryColor)}, ${convertColorWithOpacity(convertTailwindToHex(primaryColor), Math.min(100, primaryOpacity + 10))})`
                : convertTailwindToHex(primaryColor)
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span style={{ fontSize: '24px' }}>{icon}</span>
          </button>

          {/* Chat Widget - only visible when open */}
          {isOpen && (
            <div 
              className="chatbot-widget"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: `${cornerRadius}px`,
                // Use separate background properties for better compatibility
                backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'none',
                backgroundSize: backgroundImage ? 'cover' : 'auto',
                backgroundPosition: backgroundImage ? 'center' : 'initial',
                backgroundRepeat: backgroundImage ? 'no-repeat' : 'initial',
                backgroundColor: convertTailwindToHex(chatBackgroundColor),
                backdropFilter: effect.includes('glass') || effect === 'liquid' || effect === 'bubbles' ? 'blur(16px)' : 'none',
                // Add effect-specific styling
                ...(effect === 'glass' && { border: '1px solid rgba(255, 255, 255, 0.1)' }),
                ...(effect === 'glass-tinted' && { border: '1px solid rgba(255, 255, 255, 0.2)' }),
                ...(effect === 'solid' && { 
                  backgroundColor: '#0F172A',
                  // Preserve background image even for solid effect
                  backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'none',
                  backgroundSize: backgroundImage ? 'cover' : 'auto',
                  backgroundPosition: backgroundImage ? 'center' : 'auto',
                  backgroundRepeat: backgroundImage ? 'no-repeat' : 'auto'
                }),
                ...(effect === 'bubbles' && { 
                  // For bubbles effect, we need to layer the background image over the gradient
                  background: `linear-gradient(135deg, ${convertTailwindToHex(primaryColor)}CC, rgba(147, 51, 234, 0.6)), ${backgroundImage ? `url('${backgroundImage}')` : 'none'}`,
                  backgroundSize: backgroundImage ? 'cover' : 'auto',
                  backgroundPosition: backgroundImage ? 'center' : 'auto',
                  backgroundRepeat: backgroundImage ? 'no-repeat' : 'auto',
                  border: `1px solid ${convertTailwindToHex(primaryColor)}4D`
                }),
                ...(effect === 'liquid' && { 
                  // For liquid effect, layer the background image over the gradient
                  background: `linear-gradient(135deg, ${convertTailwindToHex(chatBackgroundColor)}, rgba(15, 23, 42, 0.2), rgba(30, 41, 59, 0.25)), ${backgroundImage ? `url('${backgroundImage}')` : 'none'}`,
                  backgroundSize: backgroundImage ? 'cover' : 'auto',
                  backgroundPosition: backgroundImage ? 'center' : 'auto',
                  backgroundRepeat: backgroundImage ? 'no-repeat' : 'auto'
                }),
                position: 'absolute',
                bottom: '80px',
                [position.includes('right') ? 'right' : 'left']: '0'
              }}
            >
              {/* Header */}
              <div 
                className="chatbot-header"
                style={{
                  color: 'white',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 10,
                  background: gradients.header 
                    ? `linear-gradient(to right, ${convertTailwindToHex(primaryColor)}, ${convertColorWithOpacity(convertTailwindToHex(primaryColor), Math.min(100, primaryOpacity + 10))})`
                    : convertTailwindToHex(primaryColor),
                  borderRadius: `${cornerRadius}px ${cornerRadius}px 0 0`,
                  ...(getHeaderStyle() || {})
                }}
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

              {/* Messages */}
              <div 
                className="chatbot-messages"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
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
                        <p className="text-sm" style={{ color: message.type === 'user' ? userTextColor : agentTextColor }}>{message.text}</p>
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

              {/* Input Area */}
              <div 
                className="chatbot-input-area"
                style={{
                  padding: '16px',
                  flexShrink: 0,
                  ...getFooterStyle()
                }}
              >
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about your knowledge base..."
                    className={`flex-1 ${getInputStyles()} focus:ring-2 focus:ring-${primaryColor.replace('bg-', '').replace('-500', '')}-500/50 transition-all duration-200`}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  {/* Voice Button - only show if voice is enabled */}
                  {voiceEnabled && (
                    <Button
                      onClick={toggleVoiceInput}
                      size="sm"
                      className="hover:scale-105 transition-all duration-200 shadow-lg"
                      style={{
                        background: voiceButtonColor?.includes('bg-') 
                          ? `var(--${voiceButtonColor.replace('bg-', '')}-color, ${voiceButtonColor})`
                          : voiceButtonColor || '#3B82F6',
                        opacity: (voiceButtonOpacity || 90) / 100
                      }}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4 text-white" />
                      ) : (
                        <Mic className="w-4 h-4 text-white" />
                      )}
                    </Button>
                  )}
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
          )}
        </div>
      </>
    );
  };

export default ChatbotPreview;
