
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bot, Code, Eye, Search, Filter, Download, ExternalLink, Settings, Globe, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChatbotEmbedModal from '@/components/ChatbotEmbedModal';
import { useCopySnippet } from '@/components/useCopySnippet';

interface SavedChatbot {
  id: string;
  name: string;
  type: 'FLOATING_WIDGET' | 'EMBEDDED_WINDOW';
  headerText: string;
  headerColor: string;
  userBubbleColor: string;
  botBubbleColor: string;
  backgroundColor: string;
  position: string;
  size: string;
  status: 'active' | 'paused' | 'draft';
  domain?: string;
  lastUpdated: string;
  integrations: number;
}

const CodeSnippets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedChatbot, setSelectedChatbot] = useState<SavedChatbot | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [savedChatbots, setSavedChatbots] = useState<SavedChatbot[]>([]);
  const { copySnippet } = useCopySnippet();

  // Load saved chatbots from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedChatbots');
    if (saved) {
      const chatbots = JSON.parse(saved);
      const enhancedChatbots = chatbots.map((bot: any) => ({
        ...bot,
        status: bot.status || 'active',
        domain: bot.domain || 'yoursite.com',
        lastUpdated: bot.lastUpdated || 'Today',
        integrations: Math.floor(Math.random() * 10) + 1 // Mock integration count
      }));
      setSavedChatbots(enhancedChatbots);
    }
  }, []);

  const handleViewCode = (chatbot: SavedChatbot) => {
    setSelectedChatbot(chatbot);
    setShowEmbedModal(true);
  };

  const handleQuickCopy = async (chatbot: SavedChatbot, event: React.MouseEvent) => {
    event.stopPropagation();
    await copySnippet({
      chatbotId: chatbot.id,
      chatbotType: chatbot.type,
      position: chatbot.position,
      size: chatbot.size,
      headerColor: chatbot.headerColor,
      userBubbleColor: chatbot.userBubbleColor,
      botBubbleColor: chatbot.botBubbleColor,
      backgroundColor: chatbot.backgroundColor
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'FLOATING_WIDGET' ? (
      <Smartphone className="w-4 h-4" />
    ) : (
      <Globe className="w-4 h-4" />
    );
  };

  const filteredChatbots = savedChatbots.filter(chatbot => {
    const matchesSearch = chatbot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chatbot.headerText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || chatbot.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportAll = () => {
    const exportData = {
      chatbots: savedChatbots,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatbot-configurations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful!",
      description: "All chatbot configurations have been exported.",
    });
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Integration Codes</h1>
                  <p className="text-slate-600 mt-1">Manage and deploy your chatbot integration snippets</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleExportAll} disabled={savedChatbots.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search chatbots by name or header text..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['all', 'active', 'paused', 'draft'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Bot className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Chatbots</p>
                    <p className="text-2xl font-bold text-slate-900">{savedChatbots.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Active Deployments</p>
                    <p className="text-2xl font-bold text-slate-900">{savedChatbots.filter(bot => bot.status === 'active').length}</p>
                      </div>
                    </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Smartphone className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Floating Widgets</p>
                    <p className="text-2xl font-bold text-slate-900">{savedChatbots.filter(bot => bot.type === 'FLOATING_WIDGET').length}</p>
                  </div>
                    </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Code className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Integrations</p>
                    <p className="text-2xl font-bold text-slate-900">{savedChatbots.reduce((sum, bot) => sum + bot.integrations, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chatbots List */}
          {filteredChatbots.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'No matching chatbots found' : 'No chatbots created yet'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Create your first chatbot to get integration codes'
                  }
                </p>
                <Button asChild>
                  <a href="/create">
                    <Bot className="w-4 h-4 mr-2" />
                    Create Chatbot
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredChatbots.map((chatbot) => (
                <Card key={chatbot.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Chatbot Icon and Info */}
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: chatbot.headerColor }}
                          >
                            {getTypeIcon(chatbot.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-slate-900">{chatbot.name}</h3>
                              {getStatusBadge(chatbot.status)}
                              <Badge variant="outline" className="text-xs">
                                {chatbot.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{chatbot.headerText}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Updated {chatbot.lastUpdated}</span>
                              <span>•</span>
                              <span>{chatbot.integrations} integration{chatbot.integrations !== 1 ? 's' : ''}</span>
                              <span>•</span>
                              <span className="capitalize">{chatbot.position} • {chatbot.size}</span>
                            </div>
                          </div>
                        </div>

                        {/* Color Preview */}
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="text-xs text-slate-500">Colors:</div>
                          <div className="flex gap-1">
                            <div 
                              className="w-4 h-4 rounded border border-slate-200" 
                              style={{ backgroundColor: chatbot.headerColor }}
                              title="Header Color"
                            />
                            <div 
                              className="w-4 h-4 rounded border border-slate-200" 
                              style={{ backgroundColor: chatbot.userBubbleColor }}
                              title="User Bubble Color"
                            />
                            <div 
                              className="w-4 h-4 rounded border border-slate-200" 
                              style={{ backgroundColor: chatbot.botBubbleColor }}
                              title="Bot Bubble Color"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleQuickCopy(chatbot, e)}
                        >
                          <Code className="w-4 h-4 mr-2" />
                          Quick Copy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleViewCode(chatbot)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Code
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                        >
                          <a href={`/create?edit=${chatbot.id}`}>
                            <Settings className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Integration Help
              </CardTitle>
              <CardDescription>
                Need help integrating your chatbot? Here are some quick resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium mb-2">HTML Websites</h4>
                  <p className="text-sm text-slate-600 mb-3">Paste the code before closing &lt;/body&gt; tag</p>
                  <Button size="sm" variant="outline">
                    View Guide
                  </Button>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium mb-2">React Applications</h4>
                  <p className="text-sm text-slate-600 mb-3">Use the React component for optimal integration</p>
                  <Button size="sm" variant="outline">
                    View Guide
                  </Button>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium mb-2">WordPress Sites</h4>
                  <p className="text-sm text-slate-600 mb-3">Add to functions.php or use as shortcode</p>
                  <Button size="sm" variant="outline">
                    View Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embed Modal */}
        <ChatbotEmbedModal
          isOpen={showEmbedModal}
          onClose={() => setShowEmbedModal(false)}
          chatbotData={selectedChatbot}
        />
      </div>
    </Layout>
  );
};

export default CodeSnippets;
