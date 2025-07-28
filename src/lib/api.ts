// API configuration and functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://chatbot-npll.onrender.com';

// Knowledge Management API functions
export const knowledgeApi = {
  // Get knowledge base for a chatbot
  getKnowledgeBase: async (chatbotId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/knowledge-base/`);
    if (!response.ok) throw new Error('Failed to fetch knowledge base');
    return response.json();
  },

  // Get web pages for a chatbot
  getWebPages: async (chatbotId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/webpages/`);
    if (!response.ok) throw new Error('Failed to fetch web pages');
    return response.json();
  },

  // Get documents for a chatbot
  getDocuments: async (chatbotId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/documents/`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  // Crawl a website
  crawlWebsite: async (chatbotId: string, crawlData: {
    url: string;
    crawl_type: 'SINGLE' | 'MULTI';
    max_pages?: number;
    crawl_depth?: number;
    include_subdomains?: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/crawl/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crawlData),
    });
    if (!response.ok) throw new Error('Failed to crawl website');
    return response.json();
  },

  // Upload document
  uploadDocument: async (chatbotId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/documents/upload/`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  },

  // Chat with knowledge
  chatWithKnowledge: async (chatbotId: string, message: string, sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });
    if (!response.ok) throw new Error('Failed to send chat message');
    return response.json();
  },

  // Delete document
  deleteDocument: async (chatbotId: string, documentId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/documents/${documentId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete document');
    return response.json();
  },

  // Delete web page
  deleteWebPage: async (chatbotId: string, webpageId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/webpages/${webpageId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete web page');
    return response.json();
  },
};

// Existing chatbot API functions (if any)
export const chatbotApi = {
  // Get all chatbots
  getChatbots: async () => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/`);
    if (!response.ok) throw new Error('Failed to fetch chatbots');
    return response.json();
  },

  // Get specific chatbot
  getChatbot: async (chatbotId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/`);
    if (!response.ok) throw new Error('Failed to fetch chatbot');
    return response.json();
  },

  // Create chatbot
  createChatbot: async (chatbotData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatbotData),
    });
    if (!response.ok) throw new Error('Failed to create chatbot');
    return response.json();
  },

  // Update chatbot
  updateChatbot: async (chatbotId: string, chatbotData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot-instances/${chatbotId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatbotData),
    });
    if (!response.ok) throw new Error('Failed to update chatbot');
    return response.json();
  },
}; 