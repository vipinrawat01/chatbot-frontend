"use client";

import React, { useState } from 'react';
import { getApiUrl } from '../lib/config';
import { Copy, Check, X, Code, ExternalLink, Globe, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ChatbotEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatbotData: {
    id: string;
    name: string;
    type: 'FLOATING_WIDGET' | 'EMBEDDED_WINDOW';
    headerText?: string;
    headerColor?: string;
    userBubbleColor?: string;
    botBubbleColor?: string;
    backgroundColor?: string;
    position?: string;
    size?: string;
    settings?: any;
  } | null;
  appUrl?: string;
}

export default function ChatbotEmbedModal({ 
  isOpen, 
  onClose, 
  chatbotData,
      appUrl = getApiUrl('')
}: ChatbotEmbedModalProps) {
  const [selectedTab, setSelectedTab] = useState<'html' | 'react' | 'wordpress' | 'nextjs'>('html');
  const { toast } = useToast();

  if (!chatbotData) return null;

  const containerId = chatbotData.type === 'FLOATING_WIDGET' ? 'agentive_floating' : 'agentive_embedded';
  const widgetType = chatbotData.type === 'FLOATING_WIDGET' ? 'floating' : 'embedded';
  
  const htmlSnippet = `<!-- ${chatbotData.name} Integration -->
<div id="${containerId}" 
     data-chatbot-id="${chatbotData.id}" 
     data-widget-type="${widgetType}"
     data-position="${chatbotData.position || 'bottom-right'}"
     data-size="${chatbotData.size || 'medium'}">
</div>
<script async src="${appUrl}/embed/v1/aiq-chat-widget.js"></script>

<style>
  /* Custom styling for your chatbot */
  #${containerId} {
    --chatbot-primary-color: ${chatbotData.headerColor || '#10B981'};
    --chatbot-user-color: ${chatbotData.userBubbleColor || '#3B82F6'};
    --chatbot-bot-color: ${chatbotData.botBubbleColor || '#F3F4F6'};
    --chatbot-background: ${chatbotData.backgroundColor || '#FFFFFF'};
  }
</style>`;

  const reactSnippet = `import { useEffect } from 'react';

interface ChatbotWidgetProps {
  chatbotId?: string;
  position?: string;
  size?: string;
}

function ChatbotWidget({ 
  chatbotId = "${chatbotData.id}",
  position = "${chatbotData.position || 'bottom-right'}",
  size = "${chatbotData.size || 'medium'}"
}: ChatbotWidgetProps) {
  useEffect(() => {
    // Load the chatbot script
    const script = document.createElement('script');
    script.src = '${appUrl}/embed/v1/aiq-chat-widget.js';
    script.async = true;
    
    // Add script to head
    document.head.appendChild(script);

    // Apply custom CSS variables
    const style = document.createElement('style');
    style.innerHTML = \`
      #${containerId} {
        --chatbot-primary-color: ${chatbotData.headerColor || '#10B981'};
        --chatbot-user-color: ${chatbotData.userBubbleColor || '#3B82F6'};
        --chatbot-bot-color: ${chatbotData.botBubbleColor || '#F3F4F6'};
        --chatbot-background: ${chatbotData.backgroundColor || '#FFFFFF'};
      }
    \`;
    document.head.appendChild(style);

    return () => {
      // Cleanup when component unmounts
      const existingScript = document.querySelector('script[src="${appUrl}/embed/v1/aiq-chat-widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [chatbotId, position, size]);

  return (
    <div 
      id="${containerId}" 
      data-chatbot-id={chatbotId} 
      data-widget-type="${widgetType}"
      data-position={position}
      data-size={size}
    />
  );
}

export default ChatbotWidget;`;

  const wordpressSnippet = `<?php
/**
 * Add ${chatbotData.name} to WordPress
 * Add this code to your theme's functions.php file
 */
function add_chatbot_widget() {
    ?>
    <div id="${containerId}" 
         data-chatbot-id="${chatbotData.id}" 
         data-widget-type="${widgetType}"
         data-position="${chatbotData.position || 'bottom-right'}"
         data-size="${chatbotData.size || 'medium'}">
    </div>
    <script async src="${appUrl}/embed/v1/aiq-chat-widget.js"></script>
    
    <style>
      #${containerId} {
        --chatbot-primary-color: ${chatbotData.headerColor || '#10B981'};
        --chatbot-user-color: ${chatbotData.userBubbleColor || '#3B82F6'};
        --chatbot-bot-color: ${chatbotData.botBubbleColor || '#F3F4F6'};
        --chatbot-background: ${chatbotData.backgroundColor || '#FFFFFF'};
      }
    </style>
    <?php
}
add_action('wp_footer', 'add_chatbot_widget');

/**
 * Alternative: Use as shortcode [chatbot]
 */
function chatbot_shortcode($atts) {
    $atts = shortcode_atts(array(
        'id' => '${chatbotData.id}',
        'type' => '${widgetType}',
        'position' => '${chatbotData.position || 'bottom-right'}',
        'size' => '${chatbotData.size || 'medium'}'
    ), $atts);
    
    return '<div id="${containerId}" data-chatbot-id="' . $atts['id'] . '" data-widget-type="' . $atts['type'] . '" data-position="' . $atts['position'] . '" data-size="' . $atts['size'] . '"></div>';
}
add_shortcode('chatbot', 'chatbot_shortcode');
?>`;

  const nextjsSnippet = `'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface ChatbotWidgetProps {
  chatbotId?: string;
  position?: string;
  size?: string;
}

export default function ChatbotWidget({ 
  chatbotId = "${chatbotData.id}",
  position = "${chatbotData.position || 'bottom-right'}",
  size = "${chatbotData.size || 'medium'}"
}: ChatbotWidgetProps) {
  useEffect(() => {
    // Apply custom CSS variables
    const style = document.createElement('style');
    style.innerHTML = \`
      #${containerId} {
        --chatbot-primary-color: ${chatbotData.headerColor || '#10B981'};
        --chatbot-user-color: ${chatbotData.userBubbleColor || '#3B82F6'};
        --chatbot-bot-color: ${chatbotData.botBubbleColor || '#F3F4F6'};
        --chatbot-background: ${chatbotData.backgroundColor || '#FFFFFF'};
      }
    \`;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <>
      <div 
        id="${containerId}" 
        data-chatbot-id={chatbotId} 
        data-widget-type="${widgetType}"
        data-position={position}
        data-size={size}
      />
      <Script 
        src="${appUrl}/embed/v1/aiq-chat-widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}`;

  const snippets = {
    html: htmlSnippet,
    react: reactSnippet,
    wordpress: wordpressSnippet,
    nextjs: nextjsSnippet
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippets[selectedTab]);
      toast({
        title: "Code copied!",
        description: `${selectedTab.toUpperCase()} integration code has been copied to your clipboard.`,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = snippets[selectedTab];
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({
        title: "Code copied!",
        description: `${selectedTab.toUpperCase()} integration code has been copied to your clipboard.`,
      });
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'html': return <Globe className="w-4 h-4" />;
      case 'react': return <Code className="w-4 h-4" />;
      case 'wordpress': return <FileText className="w-4 h-4" />;
      case 'nextjs': return <Zap className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getInstructions = (tab: string) => {
    switch (tab) {
      case 'html':
        return (
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
            <li>Copy the code above</li>
            <li>Paste it into your HTML file before the closing <code className="bg-slate-100 px-1 rounded text-xs">&lt;/body&gt;</code> tag</li>
            <li>Save and refresh your website</li>
            <li>The chatbot will appear automatically</li>
          </ol>
        );
      case 'react':
        return (
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
            <li>Create a new component file (e.g., <code className="bg-slate-100 px-1 rounded text-xs">ChatbotWidget.tsx</code>)</li>
            <li>Copy and paste the code above</li>
            <li>Import and use the component: <code className="bg-slate-100 px-1 rounded text-xs">&lt;ChatbotWidget /&gt;</code></li>
            <li>The chatbot will load when the component mounts</li>
          </ol>
        );
      case 'wordpress':
        return (
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
            <li>Go to your WordPress admin dashboard</li>
            <li>Navigate to <strong>Appearance → Theme Editor</strong></li>
            <li>Open your theme's <code className="bg-slate-100 px-1 rounded text-xs">functions.php</code> file</li>
            <li>Add the code above at the end of the file</li>
            <li>Save changes. You can also use the shortcode <code className="bg-slate-100 px-1 rounded text-xs">[chatbot]</code> in posts/pages</li>
          </ol>
        );
      case 'nextjs':
        return (
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
            <li>Create a new component file in your components folder</li>
            <li>Copy and paste the code above</li>
            <li>Import and use the component in your pages</li>
            <li>The Next.js Script component will load the widget optimally</li>
          </ol>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Embed Your Chatbot</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span className="font-medium">{chatbotData.name}</span>
                <Badge variant="outline">{chatbotData.type.replace('_', ' ')}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Integration Tabs */}
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              {(['html', 'react', 'wordpress', 'nextjs'] as const).map((tab) => (
                <TabsTrigger key={tab} value={tab} className="flex items-center gap-2">
                  {getTabIcon(tab)}
                  <span className="capitalize">{tab === 'nextjs' ? 'Next.js' : tab}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">
                    {selectedTab === 'nextjs' ? 'Next.js' : selectedTab.toUpperCase()} Integration Code
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    Ready to deploy
                  </Badge>
                </div>
                <Button onClick={handleCopySnippet} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>

              <div className="relative">
                <textarea
                  value={snippets[selectedTab]}
                  readOnly
                  rows={selectedTab === 'react' || selectedTab === 'nextjs' ? 14 : selectedTab === 'wordpress' ? 12 : 8}
                  className="w-full p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800"
                />
              </div>

              {/* Instructions Card */}
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {getTabIcon(selectedTab)}
                    <CardTitle className="text-base">Integration Instructions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {getInstructions(selectedTab)}
                </CardContent>
              </Card>
            </div>
          </Tabs>

          {/* Configuration Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chatbot Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">ID:</span>
                  <div className="font-mono text-slate-900 mt-1 bg-slate-50 px-2 py-1 rounded text-xs">
                    {chatbotData.id}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Type:</span>
                  <div className="mt-1">
                    <Badge variant="outline">{chatbotData.type.replace('_', ' ')}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Position:</span>
                  <div className="text-slate-900 mt-1 capitalize">
                    {chatbotData.position || 'bottom-right'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Size:</span>
                  <div className="text-slate-900 mt-1 capitalize">
                    {chatbotData.size || 'medium'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Colors:</span>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded border border-slate-200" 
                      style={{ backgroundColor: chatbotData.headerColor || '#10B981' }}
                      title="Header Color"
                    />
                    <div 
                      className="w-4 h-4 rounded border border-slate-200" 
                      style={{ backgroundColor: chatbotData.userBubbleColor || '#3B82F6' }}
                      title="User Bubble Color"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="mt-1">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              Need help? Check our{' '}
              <a href="#" className="text-green-600 hover:text-green-700 underline">
                documentation
              </a>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleCopySnippet} className="bg-green-600 hover:bg-green-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 