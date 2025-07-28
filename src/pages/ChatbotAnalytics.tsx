
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Bot, MessageSquare, Users, TrendingUp } from 'lucide-react';

const ChatbotAnalytics = () => {
  const { id } = useParams();
  
  // Mock data for the specific chatbot
  const chatbotData = {
    '1': { name: 'Customer Support Bot', description: 'Handles general customer inquiries' },
    '2': { name: 'Sales Assistant', description: 'Helps with product recommendations' },
    '3': { name: 'FAQ Bot', description: 'Answers frequently asked questions' }
  };

  const mockConversationData = [
    { date: 'Jan 1', conversations: 45, resolved: 38 },
    { date: 'Jan 2', conversations: 52, resolved: 45 },
    { date: 'Jan 3', conversations: 38, resolved: 32 },
    { date: 'Jan 4', conversations: 67, resolved: 58 },
    { date: 'Jan 5', conversations: 74, resolved: 65 },
    { date: 'Jan 6', conversations: 85, resolved: 78 },
    { date: 'Jan 7', conversations: 92, resolved: 85 }
  ];

  const mockTopicsData = [
    { topic: 'Account Issues', count: 45 },
    { topic: 'Billing', count: 32 },
    { topic: 'Technical Support', count: 28 },
    { topic: 'Product Info', count: 24 },
    { topic: 'General Inquiry', count: 18 }
  ];

  const currentBot = chatbotData[id as keyof typeof chatbotData] || { name: 'Unknown Bot', description: 'Bot not found' };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Bot className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-slate-900">{currentBot.name}</h1>
            </div>
            <p className="text-slate-600">{currentBot.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">453</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+3% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">324</div>
                <p className="text-xs text-muted-foreground">+8% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">-0.3s from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Trends</CardTitle>
                <CardDescription>Daily conversations and resolution rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockConversationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="conversations" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="resolved" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Discussion Topics</CardTitle>
                <CardDescription>Most common conversation topics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockTopicsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotAnalytics;
