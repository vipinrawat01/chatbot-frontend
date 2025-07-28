
import React, { useState, useEffect } from 'react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://chatbot-npll.onrender.com';
const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, Code2, Plus, Copy, Check, Trash2, Play, Pause } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Chatbot {
  id: string;
  name: string;
  type: string;
  welcomeMessage: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  total_conversations: number;
}

const Chatbots = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }
  }, [user, authLoading, navigate]);

  // Load chatbots from database
  useEffect(() => {
    if (user) {
      loadChatbots();
    }
  }, [user]);

  const loadChatbots = async () => {
    try {
      setError(null);
      console.log('Loading chatbots from API...');
      const response = await fetch(getApiUrl('/api/chatbot-instances/'), {
        credentials: 'include' // Include cookies for authentication
      });
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Result:', result);
        
        // Handle the response structure properly
        if (result.success && Array.isArray(result.data)) {
          // Transform the data to match our interface
          const transformedChatbots = result.data.map((bot: any) => ({
            id: bot.id || `chatbot_${Date.now()}_${Math.random()}`,
            name: bot.name || 'Unnamed Chatbot',
            type: bot.type || 'FLOATING_WIDGET',
            welcomeMessage: bot.welcomeMessage || '',
            isActive: bot.isActive !== undefined ? bot.isActive : true,
            created_at: bot.created_at || new Date().toISOString(),
            updated_at: bot.updated_at || new Date().toISOString(),
            total_conversations: bot.total_conversations || 0
          }));
          
          setChatbots(transformedChatbots);
          console.log('Loaded chatbots:', transformedChatbots);
        } else {
          console.error('Invalid API response structure:', result);
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading chatbots:', error);
      setError('Failed to load chatbots');
      // Try localStorage as fallback
      const saved = localStorage.getItem('savedChatbots');
      if (saved) {
        try {
          const parsedChatbots = JSON.parse(saved);
          setChatbots(parsedChatbots);
          console.log('Loaded from localStorage:', parsedChatbots);
        } catch (parseError) {
          console.error('Error parsing saved chatbots:', parseError);
        }
      }
    }
    setLoading(false);
  };

  const handleEdit = (chatbotId: string) => {
    navigate(`/create?edit=${chatbotId}`);
  };

  const generateCodeSnippet = (chatbotId: string) => {
          return `<div id="agentive_floating" data-chatbot-id="${chatbotId}" data-widget-type="floating"></div>\n<script async src="${getApiUrl('/embed/v1/aiq-chat-widget.js')}"></script>`;
  };

  const copyCode = async (chatbotId: string) => {
    try {
      await navigator.clipboard.writeText(generateCodeSnippet(chatbotId));
      setCopiedId(chatbotId);
      toast({
        title: "Code copied!",
        description: "Integration code has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually.",
        variant: "destructive"
      });
    }
  };

  const deleteChatbot = async (chatbotId: string) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) return;
    
    try {
              const response = await fetch(getApiUrl(`/api/chatbot-instances/${chatbotId}/`), {
        method: 'DELETE',
        credentials: 'include' // Include cookies for authentication
      });
      
      if (response.ok || response.status === 404) {
        // Remove from local state
        setChatbots(prev => prev.filter(bot => bot.id !== chatbotId));
        
        // Also remove from localStorage
        const saved = localStorage.getItem('savedChatbots');
        if (saved) {
          const savedBots = JSON.parse(saved);
          const updated = savedBots.filter((bot: any) => bot.id !== chatbotId);
          localStorage.setItem('savedChatbots', JSON.stringify(updated));
        }
        
        toast({
          title: "Chatbot deleted",
          description: "The chatbot has been removed successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the chatbot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto text-slate-400 mb-4 animate-pulse" />
                <p className="text-slate-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto text-slate-400 mb-4 animate-pulse" />
                <p className="text-slate-600">Loading your chatbots...</p>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Chatbots</h1>
              <p className="text-slate-600 mt-2">Create, edit, and manage your chatbots with database integration</p>
            </div>
            <Link to="/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Chatbot
              </Button>
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading chatbots</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}. Using locally saved data if available.</p>
                  </div>
                  <div className="mt-4">
                    <Button 
                      onClick={loadChatbots}
                      variant="outline"
                      size="sm"
                      className="text-red-800 border-red-300 hover:bg-red-50"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chatbots.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-20 h-20 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No chatbots yet</h3>
              <p className="text-slate-600 mb-6">Create your first chatbot to get started with AI-powered conversations</p>
              <Link to="/create">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Chatbot
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {chatbots.map((chatbot) => (
                <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Bot className="w-5 h-5 mr-2 text-green-600" />
                        {chatbot.name}
                      </CardTitle>
                      <Badge variant={chatbot.isActive ? 'default' : 'secondary'}>
                        {chatbot.isActive ? (
                          <><Play className="w-3 h-3 mr-1" /> Active</>
                        ) : (
                          <><Pause className="w-3 h-3 mr-1" /> Inactive</>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {chatbot.welcomeMessage || 'AI-powered chatbot ready for integration'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Chatbot ID</span>
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                          {chatbot.id.replace('chatbot_', '')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Type</span>
                        <span className="font-medium">{chatbot.type === 'FLOATING_WIDGET' ? 'Floating' : 'Embedded'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Created</span>
                        <span className="font-medium">{formatDate(chatbot.created_at)}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEdit(chatbot.id)}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => deleteChatbot(chatbot.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                        <Button 
                          onClick={() => copyCode(chatbot.id)}
                          className="bg-blue-600 hover:bg-blue-700 w-full"
                          size="sm"
                        >
                          {copiedId === chatbot.id ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Code2 className="w-4 h-4 mr-1" />
                              Get Code Snippet
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chatbots;

