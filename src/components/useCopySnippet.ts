import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CopySnippetOptions {
  chatbotId: string;
  chatbotType?: 'FLOATING_WIDGET' | 'EMBEDDED_WINDOW';
  appUrl?: string;
  position?: string;
  size?: string;
  headerColor?: string;
  userBubbleColor?: string;
  botBubbleColor?: string;
  backgroundColor?: string;
}

export const useCopySnippet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSnippet = useCallback(({
    chatbotId,
    chatbotType = 'FLOATING_WIDGET',
    appUrl = typeof window !== 'undefined' ? window.location.origin : '',
    position = 'bottom-right',
    size = 'medium',
    headerColor = '#10B981',
    userBubbleColor = '#3B82F6',
    botBubbleColor = '#F3F4F6',
    backgroundColor = '#FFFFFF'
  }: CopySnippetOptions): string => {
    const containerId = chatbotType === 'FLOATING_WIDGET' ? 'agentive_floating' : 'agentive_embedded';
    const widgetType = chatbotType === 'FLOATING_WIDGET' ? 'floating' : 'embedded';
    
    return `<!-- Chatbot Integration -->
<div id="${containerId}" 
     data-chatbot-id="${chatbotId}" 
     data-widget-type="${widgetType}"
     data-position="${position}"
     data-size="${size}">
</div>
<script async src="${appUrl}/embed/v1/aiq-chat-widget.js"></script>

<style>
  /* Custom styling for your chatbot */
  #${containerId} {
    --chatbot-primary-color: ${headerColor};
    --chatbot-user-color: ${userBubbleColor};
    --chatbot-bot-color: ${botBubbleColor};
    --chatbot-background: ${backgroundColor};
  }
</style>`;
  }, []);

  const generateReactSnippet = useCallback(({
    chatbotId,
    chatbotType = 'FLOATING_WIDGET',
    appUrl = typeof window !== 'undefined' ? window.location.origin : '',
    position = 'bottom-right',
    size = 'medium',
    headerColor = '#10B981',
    userBubbleColor = '#3B82F6',
    botBubbleColor = '#F3F4F6',
    backgroundColor = '#FFFFFF'
  }: CopySnippetOptions): string => {
    const containerId = chatbotType === 'FLOATING_WIDGET' ? 'agentive_floating' : 'agentive_embedded';
    const widgetType = chatbotType === 'FLOATING_WIDGET' ? 'floating' : 'embedded';

    return `import { useEffect } from 'react';

interface ChatbotWidgetProps {
  chatbotId?: string;
  position?: string;
  size?: string;
}

function ChatbotWidget({ 
  chatbotId = "${chatbotId}",
  position = "${position}",
  size = "${size}"
}: ChatbotWidgetProps) {
  useEffect(() => {
    // Load the chatbot script
    const script = document.createElement('script');
    script.src = '${appUrl}/embed/v1/aiq-chat-widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Apply custom CSS variables
    const style = document.createElement('style');
    style.innerHTML = \`
      #${containerId} {
        --chatbot-primary-color: ${headerColor};
        --chatbot-user-color: ${userBubbleColor};
        --chatbot-bot-color: ${botBubbleColor};
        --chatbot-background: ${backgroundColor};
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
  }, []);

  const copyToClipboard = useCallback(async (text: string, type: string = 'Code'): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      toast({
        title: `${type} copied!`,
        description: "The integration code has been copied to your clipboard.",
      });
      
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy failed",
        description: "Please copy the code manually.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const copySnippet = useCallback(async (options: CopySnippetOptions): Promise<boolean> => {
    const snippet = generateSnippet(options);
    return await copyToClipboard(snippet, 'HTML snippet');
  }, [generateSnippet, copyToClipboard]);

  const copyReactSnippet = useCallback(async (options: CopySnippetOptions): Promise<boolean> => {
    const snippet = generateReactSnippet(options);
    return await copyToClipboard(snippet, 'React component');
  }, [generateReactSnippet, copyToClipboard]);

  return {
    copySnippet,
    copyReactSnippet,
    generateSnippet,
    generateReactSnippet,
    copyToClipboard,
    isLoading
  };
}; 