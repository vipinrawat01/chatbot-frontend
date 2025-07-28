
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import ChatbotCreate from "./pages/ChatbotCreate";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import Chatbots from "./pages/Chatbots";
import CodeSnippets from "./pages/CodeSnippets";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";
import AdminChatbots from "./pages/AdminChatbots";
import AdminAgents from "./pages/AdminAgents";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import ChatbotAnalytics from "./pages/ChatbotAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<ChatbotCreate />} />
            <Route path="/chatbots" element={<Chatbots />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/snippets" element={<CodeSnippets />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chatbot-analytics/:id" element={<ChatbotAnalytics />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/chatbots" element={<AdminChatbots />} />
            <Route path="/admin/agents" element={<AdminAgents />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
