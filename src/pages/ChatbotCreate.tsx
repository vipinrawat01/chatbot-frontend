import React, { useState, useEffect } from 'react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://chatbot-npll.onrender.com';
const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bot, Palette, Image, Database, Bell, Save, Code2, Copy, Check, ArrowLeft } from 'lucide-react';
import ChatbotPreview from '@/components/chatbot/ChatbotPreview';
import DesignControls from '@/components/chatbot/DesignControls';
import KnowledgeOptions from '@/components/chatbot/KnowledgeOptions';
import ChatbotEmbedModal from '@/components/ChatbotEmbedModal';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Agent interface for selection
interface Agent {
  id: number;
  name: string;
  description: string;
  category: string;
  category_display: string;
  tone: string;
  tone_display: string;
  greeting_message: string;
}

const ChatbotCreate = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('setup');
  const [copied, setCopied] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Agent-related state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  
  const [botSettings, setBotSettings] = useState({
    id: isEditing ? editId : `chatbot_${Date.now()}`,
    name: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    agent_id: null as number | null, // Add agent selection
    primaryColor: 'bg-green-500',
    primaryOpacity: 100,
    userBubbleColor: 'bg-blue-500',
    userBubbleOpacity: 90,
    agentBubbleColor: 'bg-gray-500',
    agentBubbleOpacity: 85,
    chatBackgroundColor: 'bg-slate-500',
    chatBackgroundOpacity: 80,
    theme: 'modern',
    icon: '🤖',
    cornerRadius: 24,
    bubbleRadius: 24,
    bubbleStyle: 'rounded',
    effect: 'glass',
    position: 'bottom-right' as 'bottom-right' | 'bottom-left',
    type: 'FLOATING_WIDGET' as 'FLOATING_WIDGET' | 'EMBEDDED_WINDOW',
    size: 'medium' as 'small' | 'medium' | 'large',
    branding: {
      enabled: true,
      text: 'Powered by Your Company',
      link: ''
    },
    gradients: {
      header: true,
      userBubble: false,
      agentBubble: false,
      launcher: true
    }
  });

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create or edit chatbots.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  // Load existing chatbot data when editing
  useEffect(() => {
    if (isEditing && editId && user) {
      loadChatbotData(editId);
    }
  }, [isEditing, editId, user]);

  // Fetch available agents for selection
  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    console.log('🤖 Fetching agents for chatbot creation...');
    try {
              const response = await fetch(getApiUrl('/api/agents/for-selection/'), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🤖 Agents fetch response status:', response.status);
      console.log('🤖 Agents fetch response ok:', response.ok);
      
      const data = await response.json();
      console.log('🤖 Agents fetch response data:', data);
      
      if (response.ok && data.success) {
        setAgents(data.data || []);
        console.log(`✅ Successfully loaded ${data.data?.length || 0} agents`);
      } else {
        console.error('❌ Failed to fetch agents:', data.error || 'Unknown error');
        setAgents([]);
        
        // Show user-friendly toast for authentication issues
        if (response.status === 401) {
          toast({
            title: "Authentication Required",
            description: "Please log in to see available AI agents.",
            variant: "destructive"
          });
        } else if (response.status === 403) {
          toast({
            title: "Access Denied", 
            description: "You don't have permission to access AI agents.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Failed to Load Agents",
            description: data.error || "Could not load AI agents. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('❌ Error fetching agents:', error);
      setAgents([]);
      toast({
        title: "Network Error",
        description: "Could not connect to server. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoadingAgents(false);
    }
  };

  const loadChatbotData = async (chatbotId: string) => {
    setLoading(true);
    try {
      // Try to load from API first
              const response = await fetch(getApiUrl(`/api/chatbot-instances/${chatbotId}/`), {
        credentials: 'include' // Include authentication cookies
      });
      if (response.ok) {
        const chatbot = await response.json();
        convertApiDataToBotSettings(chatbot.data);
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('savedChatbots');
        if (saved) {
          const savedBots = JSON.parse(saved);
          const existingBot = savedBots.find((bot: any) => bot.id === chatbotId);
          if (existingBot) {
            setBotSettings(existingBot);
            toast({
              title: "Chatbot loaded",
              description: "Loaded from local storage.",
            });
          } else {
            throw new Error('Chatbot not found');
          }
        }
      }
    } catch (error) {
      console.error('Error loading chatbot:', error);
      toast({
        title: "Failed to load chatbot",
        description: "Could not load the chatbot data.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const convertApiDataToBotSettings = (apiData: any) => {
    // Convert API response format to botSettings format
    console.log('🔄 Loading chatbot data:', apiData);
    
    // If we have the new configuration structure, use it directly
    if (apiData.configuration && typeof apiData.configuration === 'object') {
      const config = apiData.configuration;
      console.log('✅ Using new configuration structure:', config);
      
      // Convert hex colors back to Tailwind classes for frontend use
      const hexToTailwind = (hexColor: string) => {
        const hexMap: { [key: string]: string } = {
          '#10B981': 'bg-green-500',
          '#34D399': 'bg-green-400',
          '#059669': 'bg-green-600',
          '#3B82F6': 'bg-blue-500',
          '#60A5FA': 'bg-blue-400',
          '#2563EB': 'bg-blue-600',
          '#8B5CF6': 'bg-purple-500',
          '#A78BFA': 'bg-purple-400',
          '#7C3AED': 'bg-purple-600',
          '#F97316': 'bg-orange-500',
          '#FB923C': 'bg-orange-400',
          '#EA580C': 'bg-orange-600',
          '#EF4444': 'bg-red-500',
          '#F87171': 'bg-red-400',
          '#DC2626': 'bg-red-600',
          '#EC4899': 'bg-pink-500',
          '#F472B6': 'bg-pink-400',
          '#DB2777': 'bg-pink-600',
          '#6366F1': 'bg-indigo-500',
          '#818CF8': 'bg-indigo-400',
          '#4F46E5': 'bg-indigo-600',
          '#14B8A6': 'bg-teal-500',
          '#2DD4BF': 'bg-teal-400',
          '#0D9488': 'bg-teal-600',
          '#6B7280': 'bg-gray-500',
          '#9CA3AF': 'bg-gray-400',
          '#4B5563': 'bg-gray-600',
          '#64748B': 'bg-slate-500',
          '#94A3B8': 'bg-slate-400',
          '#475569': 'bg-slate-600',
          '#F8FAFC': 'bg-slate-50',
          '#F9FAFB': 'bg-gray-50',
          '#EFF6FF': 'bg-blue-50',
          '#ECFDF5': 'bg-green-50'
        };
        return hexMap[hexColor] || 'bg-green-500'; // Default fallback
      };
      
      setBotSettings({
        id: apiData.id,
        name: config.name || 'AI Assistant',
        welcomeMessage: config.welcomeMessage || 'Hello! How can I help you today?',
        agent_id: apiData.agent_id || null, // Add agent_id from API data
        
        // Convert hex colors back to Tailwind for frontend controls
        primaryColor: hexToTailwind(config.primaryColor) || 'bg-green-500',
        primaryOpacity: config.primaryOpacity || 100,
        userBubbleColor: hexToTailwind(config.userBubbleColor) || 'bg-blue-500',
        userBubbleOpacity: config.userBubbleOpacity || 90,
        agentBubbleColor: hexToTailwind(config.agentBubbleColor) || 'bg-gray-500',
        agentBubbleOpacity: config.agentBubbleOpacity || 85,
        chatBackgroundColor: hexToTailwind(config.chatBackgroundColor) || 'bg-slate-500',
        chatBackgroundOpacity: config.chatBackgroundOpacity || 80,
        
        // Layout settings
        theme: config.theme || 'modern',
        icon: config.icon || '🤖',
        cornerRadius: config.cornerRadius || 24,
        bubbleRadius: config.bubbleRadius || 24,
        bubbleStyle: config.bubbleStyle || 'rounded',
        effect: config.effect || 'glass',
        position: config.position || 'bottom-right',
        type: apiData.type || 'FLOATING_WIDGET',
        size: apiData.size || 'medium',
        
        // Branding and gradients
        branding: {
          enabled: config.branding?.enabled ?? true,
          text: config.branding?.text || 'Powered by Your Company',
          link: config.branding?.link || ''
        },
        gradients: {
          header: config.gradients?.header ?? true,
          userBubble: config.gradients?.userBubble ?? false,
          agentBubble: config.gradients?.agentBubble ?? false,
          launcher: config.gradients?.launcher ?? true
        }
      });
    } else {
      // Legacy format - convert from old uiSettings structure
      console.log('⚠️ Using legacy configuration structure');
      const uiSettings = apiData.uiSettings || {};
      
      setBotSettings({
        id: apiData.id,
        name: apiData.name || 'AI Assistant',
        welcomeMessage: apiData.welcomeMessage || apiData.introMessage || 'Hello! How can I help you today?',
        agent_id: apiData.agent_id || null, // Add agent_id from API data
        
        // Use legacy field names
        primaryColor: uiSettings.primaryColor || 'bg-green-500',
        primaryOpacity: uiSettings.primaryOpacity || 100,
        userBubbleColor: uiSettings.userBubbleColor || 'bg-blue-500',
        userBubbleOpacity: uiSettings.userBubbleOpacity || 90,
        agentBubbleColor: uiSettings.agentBubbleColor || 'bg-gray-500',
        agentBubbleOpacity: uiSettings.agentBubbleOpacity || 85,
        chatBackgroundColor: uiSettings.chatBackgroundColor || 'bg-slate-500',
        chatBackgroundOpacity: uiSettings.chatBackgroundOpacity || 80,
        
        // Layout settings
        theme: uiSettings.theme || 'modern',
        icon: uiSettings.icon || '🤖',
        cornerRadius: uiSettings.cornerRadius || 24,
        bubbleRadius: uiSettings.bubbleRadius || 24,
        bubbleStyle: uiSettings.bubbleStyle || 'rounded',
        effect: uiSettings.effect || 'glass',
        position: uiSettings.position || 'bottom-right',
        type: apiData.type || 'FLOATING_WIDGET',
        size: uiSettings.size || 'medium',
        
        // Branding and gradients
        branding: {
          enabled: uiSettings.branding?.enabled ?? true,
          text: uiSettings.branding?.text || 'Powered by Your Company',
          link: uiSettings.branding?.link || ''
        },
        gradients: {
          header: uiSettings.gradients?.header ?? true,
          userBubble: uiSettings.gradients?.userBubble ?? false,
          agentBubble: uiSettings.gradients?.agentBubble ?? false,
          launcher: uiSettings.gradients?.launcher ?? true
        }
      });
    }
    
    toast({
      title: "Chatbot loaded",
      description: "Configuration loaded with exact structure support.",
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setBotSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleColorChange = (colorType: string, color: string, opacity: number) => {
    setBotSettings(prev => ({
      ...prev,
      [colorType]: color,
      [`${colorType}Opacity`]: opacity
    }));
  };

  const handleGradientToggle = (type: string, enabled: boolean) => {
    setBotSettings(prev => ({
      ...prev,
      gradients: {
        ...prev.gradients,
        [type]: enabled
      }
    }));
  };

  const handleBrandingChange = (branding: { enabled: boolean; text: string; link: string }) => {
    setBotSettings(prev => ({
      ...prev,
      branding
    }));
  };

  const handleIconSelect = (selectedIcon: string) => {
    handleSettingChange('icon', selectedIcon);
  };

  // Helper function to convert Tailwind colors to hex - COMPREHENSIVE
  const convertTailwindToHex = (tailwindColor: string) => {
    const colorMap: { [key: string]: string } = {
      // Green shades
      'bg-green-500': '#10B981',
      'bg-green-400': '#34D399',
      'bg-green-600': '#059669',
      
      // Blue shades  
      'bg-blue-500': '#3B82F6',
      'bg-blue-400': '#60A5FA',
      'bg-blue-600': '#2563EB',
      
      // Purple shades
      'bg-purple-500': '#8B5CF6',
      'bg-purple-400': '#A78BFA',
      'bg-purple-600': '#7C3AED',
      
      // Orange shades
      'bg-orange-500': '#F97316',
      'bg-orange-400': '#FB923C',
      'bg-orange-600': '#EA580C',
      
      // Red shades
      'bg-red-500': '#EF4444',
      'bg-red-400': '#F87171',
      'bg-red-600': '#DC2626',
      
      // Pink shades
      'bg-pink-500': '#EC4899',
      'bg-pink-400': '#F472B6',
      'bg-pink-600': '#DB2777',
      
      // Indigo shades
      'bg-indigo-500': '#6366F1',
      'bg-indigo-400': '#818CF8',
      'bg-indigo-600': '#4F46E5',
      
      // Teal shades
      'bg-teal-500': '#14B8A6',
      'bg-teal-400': '#2DD4BF',
      'bg-teal-600': '#0D9488',
      
      // Gray shades
      'bg-gray-500': '#6B7280',
      'bg-gray-400': '#9CA3AF',
      'bg-gray-600': '#4B5563',
      
      // Slate shades
      'bg-slate-500': '#64748B',
      'bg-slate-400': '#94A3B8',
      'bg-slate-600': '#475569',
      
      // Custom background colors
      'bg-slate-50': '#F8FAFC',
      'bg-gray-50': '#F9FAFB',
      'bg-blue-50': '#EFF6FF',
      'bg-green-50': '#ECFDF5'
    };
    
    // If it's already a hex color, return it
    if (tailwindColor.startsWith('#')) {
      return tailwindColor;
    }
    
    return colorMap[tailwindColor] || '#10B981'; // Default fallback
  };

  // Save function without popup - for tab save buttons
  const saveChatbotQuietly = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting quiet save process...');
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your chatbot.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
      
      // Convert botSettings to EXACT CHATBOT_CONFIG structure from test-chatbot.html
      const exactConfig = {
        name: botSettings.name,
        welcomeMessage: botSettings.welcomeMessage,
        primaryColor: convertTailwindToHex(botSettings.primaryColor),
        primaryOpacity: botSettings.primaryOpacity,
        userBubbleColor: convertTailwindToHex(botSettings.userBubbleColor),
        userBubbleOpacity: botSettings.userBubbleOpacity,
        agentBubbleColor: convertTailwindToHex(botSettings.agentBubbleColor),
        agentBubbleOpacity: botSettings.agentBubbleOpacity,
        chatBackgroundColor: convertTailwindToHex(botSettings.chatBackgroundColor),
        chatBackgroundOpacity: botSettings.chatBackgroundOpacity,
        theme: botSettings.theme,
        icon: botSettings.icon,
        cornerRadius: botSettings.cornerRadius,
        bubbleRadius: botSettings.bubbleRadius,
        bubbleStyle: botSettings.bubbleStyle,
        effect: botSettings.effect,
        position: botSettings.position,
        branding: {
          enabled: botSettings.branding.enabled,
          text: botSettings.branding.text,
          link: botSettings.branding.link
        },
        gradients: {
          header: botSettings.gradients.header,
          userBubble: botSettings.gradients.userBubble,
          agentBubble: botSettings.gradients.agentBubble,
          launcher: botSettings.gradients.launcher
        }
      };

      // Prepare data for backend API with new configuration structure
      const chatbotData = {
        id: botSettings.id,
        name: botSettings.name,
        type: botSettings.type,
        agent_id: botSettings.agent_id, // Include agent selection
        configuration: exactConfig, // Store the exact config structure
        
        // Legacy fields for backward compatibility
        position: botSettings.position,
        size: botSettings.size,
        welcome_message: botSettings.welcomeMessage
      };

      // Check if chatbot exists (update) or create new
      console.log('🔍 Checking if chatbot exists:', botSettings.id);
      const response = await fetch(getApiUrl(`/api/chatbot-instances/${botSettings.id}/`), {
        credentials: 'include' // Include authentication cookies
      });
      console.log('📡 Check response:', response.status, response.ok);

      let apiResponse;
      if (response.ok) {
        // Update existing chatbot
        console.log('📝 Updating existing chatbot...');
        apiResponse = await fetch(getApiUrl(`/api/chatbot-instances/${botSettings.id}/`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatbotData),
          credentials: 'include' // Include authentication cookies
        });
      } else {
        // Create new chatbot
        console.log('✨ Creating new chatbot...');
        console.log('📋 Chatbot data:', chatbotData);
        apiResponse = await fetch(getApiUrl('/api/chatbot-instances/'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatbotData),
          credentials: 'include' // Include authentication cookies
        });
      }

      console.log('📡 API Response:', apiResponse.status, apiResponse.ok);
      if (apiResponse.ok) {
        const result = await apiResponse.json();
        console.log('✅ API Result:', result);
        
        // Also save to localStorage for backwards compatibility
        const saved = localStorage.getItem('savedChatbots');
        const savedChatbots = saved ? JSON.parse(saved) : [];
        const updated = [...savedChatbots];
        const existingIndex = updated.findIndex(bot => bot.id === botSettings.id);
        
        if (existingIndex >= 0) {
          updated[existingIndex] = botSettings;
        } else {
          updated.push(botSettings);
        }
        
        localStorage.setItem('savedChatbots', JSON.stringify(updated));
        
        toast({
          title: isEditing ? "Changes saved!" : "Progress saved!",
          description: "Your chatbot settings have been saved successfully.",
        });
        
        console.log('✅ Saved quietly with exact config structure:', exactConfig);
        
        // DO NOT show code snippet popup
      } else {
        const errorData = await apiResponse.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to save chatbot');
      }
    } catch (error) {
      console.error('Error saving chatbot:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save chatbot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Original save function with popup - for main save button
  const saveChatbot = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting save process...');
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your chatbot.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
      
      // Convert botSettings to EXACT CHATBOT_CONFIG structure from test-chatbot.html
      const exactConfig = {
        name: botSettings.name,
        welcomeMessage: botSettings.welcomeMessage,
        primaryColor: convertTailwindToHex(botSettings.primaryColor),
        primaryOpacity: botSettings.primaryOpacity,
        userBubbleColor: convertTailwindToHex(botSettings.userBubbleColor),
        userBubbleOpacity: botSettings.userBubbleOpacity,
        agentBubbleColor: convertTailwindToHex(botSettings.agentBubbleColor),
        agentBubbleOpacity: botSettings.agentBubbleOpacity,
        chatBackgroundColor: convertTailwindToHex(botSettings.chatBackgroundColor),
        chatBackgroundOpacity: botSettings.chatBackgroundOpacity,
        theme: botSettings.theme,
        icon: botSettings.icon,
        cornerRadius: botSettings.cornerRadius,
        bubbleRadius: botSettings.bubbleRadius,
        bubbleStyle: botSettings.bubbleStyle,
        effect: botSettings.effect,
        position: botSettings.position,
        branding: {
          enabled: botSettings.branding.enabled,
          text: botSettings.branding.text,
          link: botSettings.branding.link
        },
        gradients: {
          header: botSettings.gradients.header,
          userBubble: botSettings.gradients.userBubble,
          agentBubble: botSettings.gradients.agentBubble,
          launcher: botSettings.gradients.launcher
        }
      };

      // Prepare data for backend API with new configuration structure
      const chatbotData = {
        id: botSettings.id,
        name: botSettings.name,
        type: botSettings.type,
        agent_id: botSettings.agent_id, // Include agent selection
        configuration: exactConfig, // Store the exact config structure
        
        // Legacy fields for backward compatibility
        position: botSettings.position,
        size: botSettings.size,
        welcome_message: botSettings.welcomeMessage
      };

      // Check if chatbot exists (update) or create new
      console.log('🔍 Checking if chatbot exists:', botSettings.id);
      const response = await fetch(getApiUrl(`/api/chatbot-instances/${botSettings.id}/`), {
        credentials: 'include' // Include authentication cookies
      });
      console.log('📡 Check response:', response.status, response.ok);

      let apiResponse;
      if (response.ok) {
        // Update existing chatbot
        console.log('📝 Updating existing chatbot...');
        apiResponse = await fetch(getApiUrl(`/api/chatbot-instances/${botSettings.id}/`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatbotData),
          credentials: 'include' // Include authentication cookies
        });
      } else {
        // Create new chatbot
        console.log('✨ Creating new chatbot...');
        console.log('📋 Chatbot data:', chatbotData);
        apiResponse = await fetch(getApiUrl('/api/chatbot-instances/'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatbotData),
          credentials: 'include' // Include authentication cookies
        });
      }

      console.log('📡 API Response:', apiResponse.status, apiResponse.ok);
      if (apiResponse.ok) {
        const result = await apiResponse.json();
        console.log('✅ API Result:', result);
        
        // Also save to localStorage for backwards compatibility
        const saved = localStorage.getItem('savedChatbots');
        const savedChatbots = saved ? JSON.parse(saved) : [];
        const updated = [...savedChatbots];
        const existingIndex = updated.findIndex(bot => bot.id === botSettings.id);
        
        if (existingIndex >= 0) {
          updated[existingIndex] = botSettings;
        } else {
          updated.push(botSettings);
        }
        
        localStorage.setItem('savedChatbots', JSON.stringify(updated));
        
        toast({
          title: isEditing ? "Chatbot updated!" : "Chatbot saved!",
          description: isEditing 
            ? "Your changes are saved with the exact configuration structure. The widget will show identical styling to your preview!"
            : "Your chatbot is saved with perfect design consistency. The snippet will match your preview 100%!",
        });
        
        console.log('✅ Saved with exact config structure:', exactConfig);
        
        // Show code snippet popup after successful save
        setShowCodeSnippet(true);
      } else {
        const errorData = await apiResponse.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to save chatbot');
      }
    } catch (error) {
      console.error('Error saving chatbot:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save chatbot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCodeSnippet = () => {
    const containerId = botSettings.type === 'FLOATING_WIDGET' ? 'agentive_floating' : 'agentive_embedded';
    const widgetType = botSettings.type === 'FLOATING_WIDGET' ? 'floating' : 'embedded';
    
    return `<div id="${containerId}" data-chatbot-id="${botSettings.id}" data-widget-type="${widgetType}"></div>
<script async src="${getApiUrl('/embed/v1/aiq-chat-widget.js')}"></script>`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Code copied!",
        description: "Integration code has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually.",
        variant: "destructive"
      });
    }
  };



  const iconOptions = [
    '🤖', '💬', '🎯', '✨', '🔮', '🎨', '🚀', '⚡', '🌟', '🎪',
    '🎭', '🎨', '🎯', '🎪', '🎨', '🔥', '💎', '🌈', '🎵', '🎪'
  ];

  if (authLoading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <Bot className="w-16 h-16 mx-auto text-slate-400 mb-4 animate-pulse" />
                <h2 className="text-xl font-medium text-slate-900 mb-2">Checking Authentication...</h2>
                <p className="text-slate-600">Please wait while we verify your login status.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <Bot className="w-16 h-16 mx-auto text-slate-400 mb-4 animate-pulse" />
                <h2 className="text-xl font-medium text-slate-900 mb-2">Loading Chatbot...</h2>
                <p className="text-slate-600">Please wait while we load your chatbot configuration.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isEditing && (
                  <Link to="/chatbots">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Chatbots
                    </Button>
                  </Link>
                )}
                <div>
          <h1 className="text-3xl font-bold text-slate-900">
                    {isEditing ? 'Edit Chatbot' : 'Create Chatbot'}
                  </h1>
                  <p className="text-slate-600 mt-2">
                    {isEditing 
                      ? `Editing: ${botSettings.name} (${botSettings.id})`
                      : 'Build and customize your AI-powered chatbot'
                    }
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={saveChatbot} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update & Get Code' : 'Save & Get Code'}
                </Button>
              </div>
            </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="setup" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Setup
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="icon" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Icon
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Knowledge
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              {/* Setup Tab */}
              <TabsContent value="setup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Set up your chatbot's basic details</CardDescription>
                  </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bot-name">Chatbot Name</Label>
                        <Input 
                          id="bot-name" 
                            placeholder="AI Assistant"
                          value={botSettings.name}
                          onChange={(e) => handleSettingChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="bot-type">Widget Type</Label>
                          <Select 
                            value={botSettings.type} 
                            onValueChange={(value) => handleSettingChange('type', value)}
                          >
                          <SelectTrigger>
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="FLOATING_WIDGET">Floating Widget</SelectItem>
                              <SelectItem value="EMBEDDED_WINDOW">Embedded Window</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="welcome-message">Welcome Message</Label>
                      <Textarea 
                        id="welcome-message" 
                        placeholder="Hello! How can I help you today?"
                        value={botSettings.welcomeMessage}
                        onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agent-selection">AI Agent Persona</Label>
                      <Select 
                        value={botSettings.agent_id?.toString() || 'none'} 
                        onValueChange={(value) => {
                          const agentId = (value && value !== 'none') ? parseInt(value) : null;
                          handleSettingChange('agent_id', agentId);
                          
                          // Auto-update greeting message when agent is selected
                          if (agentId) {
                            const selectedAgent = agents.find(a => a.id === agentId);
                            if (selectedAgent && selectedAgent.greeting_message) {
                              handleSettingChange('welcomeMessage', selectedAgent.greeting_message);
                            }
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            loadingAgents 
                              ? "Loading agents..." 
                              : agents.length === 0 
                                ? "No agents available"
                                : "Select an AI agent (optional)"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No specific agent (General)</SelectItem>
                          {loadingAgents && (
                            <SelectItem value="loading" disabled>
                              Loading agents...
                            </SelectItem>
                          )}
                          {!loadingAgents && agents.length === 0 && (
                            <SelectItem value="no-agents" disabled>
                              No agents available
                            </SelectItem>
                          )}
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{agent.name}</span>
                                <span className="text-xs text-gray-500">
                                  {agent.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        {loadingAgents ? (
                          "Loading available AI agents..."
                        ) : agents.length === 0 ? (
                          "No AI agents available. Admins can create agents in the AI Agents section."
                        ) : (
                          "Choose an AI agent to give your chatbot a specialized personality and expertise."
                        )}
                        {botSettings.agent_id && (() => {
                          const selectedAgent = agents.find(a => a.id === botSettings.agent_id);
                          return selectedAgent ? (
                            <span className="block mt-1 text-blue-600 font-medium">
                              Selected: {selectedAgent.name}
                            </span>
                          ) : null;
                        })()}
                      </p>
                    </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Select 
                            value={botSettings.position} 
                            onValueChange={(value) => handleSettingChange('position', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bottom-right">Bottom Right</SelectItem>
                              <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Size</Label>
                          <Select 
                            value={botSettings.size} 
                            onValueChange={(value) => handleSettingChange('size', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <Select 
                            value={botSettings.theme} 
                            onValueChange={(value) => handleSettingChange('theme', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Save button for Setup tab */}
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={saveChatbotQuietly} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Setup
                  </Button>
                </div>
              </TabsContent>

              {/* Design Tab */}
              <TabsContent value="design" className="space-y-6">
                <DesignControls 
                  onColorChange={(color, opacity) => handleColorChange('primaryColor', color, opacity || 100)}
                  onUserBubbleColorChange={(color, opacity) => handleColorChange('userBubbleColor', color, opacity || 90)}
                  onAgentBubbleColorChange={(color, opacity) => handleColorChange('agentBubbleColor', color, opacity || 85)}
                  onChatBackgroundColorChange={(color, opacity) => handleColorChange('chatBackgroundColor', color, opacity || 80)}
                  onThemeChange={(theme) => handleSettingChange('theme', theme)}
                  onCornerRadiusChange={(radius) => handleSettingChange('cornerRadius', radius)}
                  onBubbleRadiusChange={(radius) => handleSettingChange('bubbleRadius', radius)}
                  onBubbleStyleChange={(style) => handleSettingChange('bubbleStyle', style)}
                  onEffectChange={(effect) => handleSettingChange('effect', effect)}
                  onPositionChange={(position) => handleSettingChange('position', position)}
                  onGradientToggle={handleGradientToggle}
                  onBrandingChange={handleBrandingChange}
                />
                
                {/* Save button for Design tab */}
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={saveChatbotQuietly} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Design
                  </Button>
                </div>
              </TabsContent>

              {/* Icon Tab */}
              <TabsContent value="icon" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Chatbot Icon</CardTitle>
                      <CardDescription>Choose an icon for your chatbot launcher</CardDescription>
                  </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-10 gap-3">
                        {iconOptions.map((icon, index) => (
                          <button
                          key={index} 
                            onClick={() => handleIconSelect(icon)}
                            className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                              botSettings.icon === icon
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            {icon}
                          </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Save button for Icon tab */}
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={saveChatbotQuietly} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Icon
                  </Button>
                </div>
              </TabsContent>

              {/* Knowledge Tab */}
              <TabsContent value="knowledge" className="space-y-6">
                <KnowledgeOptions chatbotId={botSettings.id} />
                
                {/* Save button for Knowledge tab */}
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={saveChatbotQuietly} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Knowledge Settings
                  </Button>
                </div>
              </TabsContent>



              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Configure how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-slate-600">Get notified when users interact with your chatbot</p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">New Conversation Alerts</Label>
                          <p className="text-sm text-slate-600">Instant notifications for new conversations</p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Weekly Reports</Label>
                          <p className="text-sm text-slate-600">Weekly summary of chatbot performance</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Error Notifications</Label>
                          <p className="text-sm text-slate-600">Get alerted when chatbot encounters errors</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Save button for Notifications tab */}
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={saveChatbotQuietly} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

            {/* Right Panel - Preview */}
            <div className="w-96">
              <div className="sticky top-8">
                <Card>
              <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-green-600" />
                  Live Preview
                </CardTitle>
              </CardHeader>
                  <CardContent>
                    <div className="relative h-96 bg-slate-100 rounded-lg overflow-hidden">
        <ChatbotPreview 
          chatbotId={botSettings.id}
          botName={botSettings.name}
          welcomeMessage={botSettings.welcomeMessage}
          primaryColor={botSettings.primaryColor}
          primaryOpacity={botSettings.primaryOpacity}
          userBubbleColor={botSettings.userBubbleColor}
          userBubbleOpacity={botSettings.userBubbleOpacity}
          agentBubbleColor={botSettings.agentBubbleColor}
          agentBubbleOpacity={botSettings.agentBubbleOpacity}
          chatBackgroundColor={botSettings.chatBackgroundColor}
          chatBackgroundOpacity={botSettings.chatBackgroundOpacity}
          theme={botSettings.theme}
          icon={botSettings.icon}
          cornerRadius={botSettings.cornerRadius}
          bubbleRadius={botSettings.bubbleRadius}
          bubbleStyle={botSettings.bubbleStyle}
          effect={botSettings.effect}
          position={botSettings.position}
          branding={botSettings.branding}
          gradients={botSettings.gradients}
        />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Embed Modal */}
        <ChatbotEmbedModal
          isOpen={showEmbedModal}
          onClose={() => setShowEmbedModal(false)}
          chatbotData={{
            id: botSettings.id,
            name: botSettings.name,
            type: botSettings.type,
            headerText: botSettings.name,
            headerColor: botSettings.primaryColor.includes('bg-') 
              ? {'bg-green-500': '#10B981', 'bg-blue-500': '#3B82F6', 'bg-purple-500': '#8B5CF6'}[botSettings.primaryColor] || '#10B981'
              : botSettings.primaryColor,
            userBubbleColor: botSettings.userBubbleColor.includes('bg-')
              ? {'bg-green-500': '#10B981', 'bg-blue-500': '#3B82F6', 'bg-purple-500': '#8B5CF6'}[botSettings.userBubbleColor] || '#3B82F6'
              : botSettings.userBubbleColor,
            botBubbleColor: botSettings.agentBubbleColor.includes('bg-')
              ? {'bg-gray-500': '#6B7280', 'bg-slate-500': '#64748B'}[botSettings.agentBubbleColor] || '#F3F4F6'
              : botSettings.agentBubbleColor,
            backgroundColor: '#FFFFFF',
            position: botSettings.position,
            size: botSettings.size
          }}
        />

        {/* Code Snippet Popup */}
        {showCodeSnippet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <Code2 className="w-6 h-6 mr-2 text-green-600" />
                    🎉 {isEditing ? 'Chatbot Updated Successfully!' : 'Chatbot Saved Successfully!'}
                  </h2>
                  <button
                    onClick={() => setShowCodeSnippet(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-slate-600 mb-4">
                    Your chatbot has been saved to the database. Use this code snippet to integrate it into any website:
                  </p>
                  
                  <div className="bg-slate-900 rounded-lg p-4 mb-4">
                    <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                      <code>{generateCodeSnippet()}</code>
                    </pre>
                  </div>
                  
                  <div className="flex gap-3 mb-4">
                    <Button onClick={() => copyToClipboard(generateCodeSnippet())} className="flex-1">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                    <Button onClick={() => {setShowEmbedModal(true); setShowCodeSnippet(false);}} variant="outline">
                      <Code2 className="w-4 h-4 mr-2" />
                      Advanced Options
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">✅ What This Does:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Loads your exact chatbot design</li>
                        <li>• Updates automatically when you make changes</li>
                        <li>• Works on any website or platform</li>
                        <li>• Just 2 lines of code - super simple!</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">📋 Chatbot Details:</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>Name:</strong> {botSettings.name}</div>
                        <div><strong>ID:</strong> <span className="font-mono text-xs bg-blue-100 px-1 rounded">{botSettings.id}</span></div>
                        <div><strong>Type:</strong> {botSettings.type === 'FLOATING_WIDGET' ? 'Floating Widget' : 'Embedded Window'}</div>
                        <div><strong>Position:</strong> {botSettings.position}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Pro Tip:</strong> Paste this code before the closing &lt;/body&gt; tag in your HTML files for best performance.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button onClick={() => setShowCodeSnippet(false)} variant="outline">
                    Close
                  </Button>
                  <Button onClick={() => {
                    copyToClipboard(generateCodeSnippet());
                    setShowCodeSnippet(false);
                    toast({
                      title: "Code copied and ready to use!",
                      description: "Paste it into your website to start using your chatbot.",
                    });
                  }} className="bg-green-600 hover:bg-green-700">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy & Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatbotCreate;
