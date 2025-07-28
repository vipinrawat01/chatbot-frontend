
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  Database, 
  Upload, 
  Globe, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Trash2,
  ExternalLink,
  MessageSquare,
  Send,
  Bot,
  Eye
} from 'lucide-react';
import { knowledgeApi } from '@/lib/api';
import { useSearchParams } from 'react-router-dom';

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  total_documents: number;
  total_web_pages: number;
  total_chunks: number;
  created_at: string;
  updated_at: string;
}

interface WebPage {
  id: string;
  url: string;
  title: string;
  crawl_type: string;
  status: string;
  pages_crawled: number;
  total_chunks: number;
  created_at: string;
  updated_at: string;
  error_message?: string;
}

interface Document {
  id: string;
  filename: string;
  file_size: number;
  file_type: string;
  status: string;
  total_chunks: number;
  created_at: string;
  updated_at: string;
  error_message?: string;
}

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  knowledge_used: boolean;
  chunks_used: number;
  timestamp: string;
}

interface KnowledgeOptionsProps {
  chatbotId: string;
}

const KnowledgeOptions: React.FC<KnowledgeOptionsProps> = ({ chatbotId }) => {
  const [selectedChatbot] = useState<string>(chatbotId);
  
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [webPages, setWebPages] = useState<WebPage[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Crawl form states
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawlType, setCrawlType] = useState<'SINGLE' | 'MULTI'>('SINGLE');
  const [maxPages, setMaxPages] = useState(1);
  const [crawlDepth, setCrawlDepth] = useState(1);
  const [includeSubdomains, setIncludeSubdomains] = useState(false);
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [crawlResults, setCrawlResults] = useState<WebPage[]>([]);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [showPreviewChat, setShowPreviewChat] = useState(false);

  // Load initial data
  useEffect(() => {
    if (selectedChatbot) {
      loadKnowledgeData();
    }
  }, [selectedChatbot]);

  const loadKnowledgeData = async () => {
    if (!selectedChatbot) return;
    
    setLoading(true);
    try {
      const [kbResponse, webPagesResponse, documentsResponse] = await Promise.all([
        knowledgeApi.getKnowledgeBase(selectedChatbot).catch(() => ({ knowledge_base: null })),
        knowledgeApi.getWebPages(selectedChatbot).catch(() => ({ webpages: [] })),
        knowledgeApi.getDocuments(selectedChatbot).catch(() => ({ documents: [] }))
      ]);

      setKnowledgeBase(kbResponse.knowledge_base);
      setWebPages(webPagesResponse.webpages || []);
      setDocuments(documentsResponse.documents || []);
    } catch (error) {
      console.error('Failed to load knowledge data:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebPage = async (webpageId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will permanently remove it from the knowledge base.`)) {
      return;
    }

    try {
      await knowledgeApi.deleteWebPage(selectedChatbot, webpageId);
      
      // Remove from local state immediately
      setWebPages(prev => prev.filter(page => page.id !== webpageId));
      
      // Update knowledge base stats
      if (knowledgeBase) {
        setKnowledgeBase(prev => prev ? {
          ...prev,
          total_web_pages: Math.max(0, prev.total_web_pages - 1)
        } : null);
      }
      
      toast({
        title: "Success",
        description: `Web page "${title}" deleted successfully`,
      });
      
      // Reload data to get updated counts
      setTimeout(() => {
        loadKnowledgeData();
      }, 1000);
    } catch (error) {
      console.error('Failed to delete web page:', error);
      toast({
        title: "Error",
        description: "Failed to delete web page",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (documentId: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"? This will permanently remove it from the knowledge base.`)) {
      return;
    }

    try {
      await knowledgeApi.deleteDocument(selectedChatbot, documentId);
      
      // Remove from local state immediately
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      // Update knowledge base stats
      if (knowledgeBase) {
        setKnowledgeBase(prev => prev ? {
          ...prev,
          total_documents: Math.max(0, prev.total_documents - 1)
        } : null);
      }
      
      toast({
        title: "Success",
        description: `Document "${filename}" deleted successfully`,
      });
      
      // Reload data to get updated counts
      setTimeout(() => {
        loadKnowledgeData();
      }, 1000);
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleCrawlWebsite = async () => {
    if (!crawlUrl.trim()) {
      setError('Please enter a URL to crawl');
      return;
    }

    setCrawlLoading(true);
    setError('');
    setCrawlResults([]);

    try {
      const response = await knowledgeApi.crawlWebsite(selectedChatbot, {
        url: crawlUrl,
        crawl_type: crawlType,
        max_pages: maxPages,
        include_subdomains: includeSubdomains
      });

      if (response.success) {
        setCrawlResults([response.webpage]);
        toast({
          title: "✅ Website Crawled Successfully",
          description: `Successfully crawled ${response.webpage.url} and created ${response.webpage.total_chunks} knowledge chunks.`,
          duration: 5000,
        });
        setCrawlUrl('');
        loadKnowledgeData();
      } else {
        throw new Error(response.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Crawling failed:', error);
      
      let errorMessage = 'Failed to crawl website. Please try again.';
      let errorTitle = '❌ Crawling Failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        switch (errorData.error_type) {
          case 'firecrawl_not_configured':
            errorTitle = '⚙️ FireCrawl Not Configured';
            errorMessage = 'FireCrawl service is not properly configured. Please contact your administrator to set up the FIRECRAWL_API_KEY.';
            break;
          case 'firecrawl_api_error':
            errorTitle = '🔥 FireCrawl API Error';
            errorMessage = errorData.error || 'FireCrawl service encountered an error. Please check your API key and try again.';
            break;
          case 'invalid_url':
            errorTitle = '🔗 Invalid URL';
            errorMessage = errorData.error || 'Please enter a valid URL.';
            break;
          case 'no_content':
            errorTitle = '❌ No Content Found';
            errorMessage = 'No content could be extracted from this webpage. The page might be empty, protected, or require JavaScript rendering.';
            break;
          default:
            errorMessage = errorData.error || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setCrawlLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChatbot) return;

    setUploadLoading(true);
    try {
      await knowledgeApi.uploadDocument(selectedChatbot, file);
      
      toast({
        title: "Success",
        description: `Document "${file.name}" uploaded successfully`,
      });

      // Reset file input
      event.target.value = '';
      
      // Reload data after a short delay
      setTimeout(() => {
        loadKnowledgeData();
      }, 2000);
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleChatMessage = async () => {
    if (!currentMessage.trim() || !selectedChatbot) return;

    setChatLoading(true);
    const userMessage = currentMessage;
    setCurrentMessage('');

    try {
      const response = await knowledgeApi.chatWithKnowledge(selectedChatbot, userMessage, sessionId);
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: userMessage,
        response: response.response,
        knowledge_used: response.knowledge_used,
        chunks_used: response.chunks_used,
        timestamp: new Date().toISOString(),
      };

      setChatMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send chat message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'PROCESSING':
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'FAILED':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-purple-600" />
            Knowledge Base Overview
          </CardTitle>
          <CardDescription>Current knowledge sources and AI training data for chatbot: {selectedChatbot}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading knowledge base...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {(knowledgeBase?.total_documents || 0) + (knowledgeBase?.total_web_pages || 0)}
                </div>
                <div className="text-sm text-slate-600">Total Sources</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{knowledgeBase?.total_chunks || 0}</div>
                <div className="text-sm text-slate-600">Vector Chunks</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{knowledgeBase?.total_web_pages || 0}</div>
                <div className="text-sm text-slate-600">Web Pages</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{knowledgeBase?.total_documents || 0}</div>
                <div className="text-sm text-slate-600">Documents</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Knowledge Management Tabs */}
      <Tabs defaultValue="crawl" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="crawl">Web Crawling</TabsTrigger>
          <TabsTrigger value="upload">Document Upload</TabsTrigger>
          <TabsTrigger value="sources">Knowledge Sources</TabsTrigger>
          <TabsTrigger value="test">Test AI</TabsTrigger>
        </TabsList>

        {/* Web Crawling Tab */}
        <TabsContent value="crawl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Website Crawling
              </CardTitle>
              <CardDescription>Add website content to your chatbot's knowledge base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crawl-url">Website URL</Label>
                  <Input
                    id="crawl-url"
                    placeholder="https://example.com"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="crawl-type">Crawl Type</Label>
                  <Select value={crawlType} onValueChange={(value: 'SINGLE' | 'MULTI') => setCrawlType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single Page Crawl</SelectItem>
                      <SelectItem value="MULTI">Multiple Page Crawl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {crawlType === 'MULTI' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <Label htmlFor="max-pages">Max Pages</Label>
                    <Input
                      id="max-pages"
                      type="number"
                      value={maxPages}
                      onChange={(e) => setMaxPages(parseInt(e.target.value))}
                      min={1}
                      max={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="crawl-depth">Crawl Depth</Label>
                    <Input
                      id="crawl-depth"
                      type="number"
                      value={crawlDepth}
                      onChange={(e) => setCrawlDepth(parseInt(e.target.value))}
                      min={1}
                      max={5}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="include-subdomains"
                      checked={includeSubdomains}
                      onChange={(e) => setIncludeSubdomains(e.target.checked)}
                    />
                    <Label htmlFor="include-subdomains">Include Subdomains</Label>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCrawlWebsite} 
                disabled={!crawlUrl || crawlLoading}
                className="w-full"
                size="lg"
              >
                {crawlLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Crawling Website...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Start {crawlType === 'SINGLE' ? 'Single Page' : 'Multi Page'} Crawl
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2 text-green-600" />
                Document Upload
              </CardTitle>
              <CardDescription>Upload documents to train your chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-medium text-blue-600 hover:text-blue-500">
                      Click to upload files
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.md,.html,.ppt,.pptx,.xls,.xlsx"
                    disabled={uploadLoading}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supports: PDF, DOC, DOCX, TXT, MD, HTML, PPT, PPTX, XLS, XLSX (Max 50MB)
                </p>
                {uploadLoading && (
                  <div className="mt-4 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Uploading and processing...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Sources Tab */}
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Sources</CardTitle>
              <CardDescription>View and manage your crawled websites and uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Web Pages Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    Crawled Websites ({webPages.length})
                  </h3>
                  {webPages.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No websites crawled yet</p>
                      <p className="text-sm text-gray-400">Use the Web Crawling tab to add website content</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {webPages.map((page) => (
                        <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{page.title}</h4>
                              <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                                <span className="flex items-center">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  {page.url}
                                </span>
                                <span>Type: {page.crawl_type}</span>
                                <span>Chunks: {page.total_chunks}</span>
                                <span>Crawled: {formatDate(page.created_at)}</span>
                              </div>
                              {page.error_message && (
                                <p className="text-red-600 text-sm mt-1">{page.error_message}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(page.status)}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteWebPage(page.id, page.title)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Uploaded Documents ({documents.length})
                  </h3>
                  {documents.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                      <p className="text-sm text-gray-400">Use the Document Upload tab to add files</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{doc.filename}</h4>
                              <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                                <span>Type: {doc.file_type}</span>
                                <span>Size: {formatFileSize(doc.file_size)}</span>
                                <span>Chunks: {doc.total_chunks}</span>
                                <span>Uploaded: {formatDate(doc.created_at)}</span>
                              </div>
                              {doc.error_message && (
                                <p className="text-red-600 text-sm mt-1">{doc.error_message}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(doc.status)}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id, doc.filename)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test AI Tab - Updated to show both separate testing and preview integration */}
        <TabsContent value="test">
          <div className="space-y-6">
            {/* Test in Chatbot Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-green-600" />
                  Test in Live Preview
                </CardTitle>
                <CardDescription>The live preview now works exactly like your embedded chatbot - test with real knowledge base integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center">
                    <p className="text-slate-600 mb-4">
                      The live preview on the right side now works exactly like the embedded chatbot will work on your website.
                      It uses your actual knowledge base and AI agent - no switching needed!
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <strong className="text-blue-800">Web Content:</strong>
                        <p className="text-blue-700 mt-1">{webPages.length} pages crawled</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <strong className="text-green-800">Documents:</strong>
                        <p className="text-green-700 mt-1">{documents.length} documents uploaded</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Preview = Embedded Version:</strong> What you see in the preview is exactly how your chatbot will work when embedded on websites using the generated snippet!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Separate Test Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  Separate Test Chat
                </CardTitle>
                <CardDescription>Test your chatbot with the current knowledge base in a dedicated chat interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-16">
                        <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p>Test your AI agent with questions about your knowledge base</p>
                        <p className="text-sm text-gray-400 mt-2">Try asking about content from crawled websites or uploaded documents</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className="space-y-2">
                            {/* User Message */}
                            <div className="flex justify-end">
                              <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[80%]">
                                {msg.message}
                              </div>
                            </div>
                            
                            {/* AI Response */}
                            <div className="flex justify-start">
                              <div className="bg-white border p-3 rounded-lg max-w-[80%]">
                                <p className="mb-2">{msg.response}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  {msg.knowledge_used ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                      ✅ Used {msg.chunks_used} knowledge chunks
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">No knowledge used</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about your crawled websites or uploaded documents..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                      disabled={chatLoading}
                    />
                    <Button 
                      onClick={handleChatMessage} 
                      disabled={!currentMessage.trim() || chatLoading}
                    >
                      {chatLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick test suggestions */}
                  <div className="flex flex-wrap gap-2">
                    <p className="text-sm text-gray-600 w-full mb-2">Quick test questions:</p>
                    {[
                      "What services do you offer?",
                      "Tell me about AI solutions",
                      "What programming languages do you use?",
                      "How can I contact you?"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMessage(question)}
                        disabled={chatLoading}
                        className="text-xs"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeOptions;
