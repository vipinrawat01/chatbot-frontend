import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bot, Search, MoreHorizontal, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminChatbots = () => {
  const { user } = useAuth();

  const mockChatbots = [
    {
      id: '1',
      name: 'Customer Support Bot',
      owner: 'John Doe',
      status: 'active',
      conversations: 1234,
      created: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Sales Assistant',
      owner: 'Jane Smith',
      status: 'active',
      conversations: 856,
      created: '2024-01-20',
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'FAQ Bot',
      owner: 'Jane Smith',
      status: 'paused',
      conversations: 432,
      created: '2024-02-01',
      lastActive: '3 days ago'
    },
    {
      id: '4',
      name: 'Product Helper',
      owner: 'Bob Wilson',
      status: 'inactive',
      conversations: 123,
      created: '2024-02-10',
      lastActive: '2 weeks ago'
    }
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">All Chatbots</h1>
            <p className="text-slate-600 mt-2">Monitor and manage all chatbots across the platform</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-green-600" />
                Chatbot Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">24</div>
                  <div className="text-sm text-slate-600">Total Chatbots</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">18</div>
                  <div className="text-sm text-slate-600">Active</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">4</div>
                  <div className="text-sm text-slate-600">Paused</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-slate-600">Inactive</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Chatbots</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input placeholder="Search chatbots..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Chatbot</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Owner</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Conversations</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Last Active</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockChatbots.map((chatbot) => (
                      <tr key={chatbot.id} className="border-b hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Bot className="w-5 h-5 mr-2 text-green-600" />
                            <div className="font-medium text-slate-900">{chatbot.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-slate-600">{chatbot.owner}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={
                              chatbot.status === 'active' ? 'default' : 
                              chatbot.status === 'paused' ? 'secondary' : 'destructive'
                            }
                          >
                            {chatbot.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{chatbot.conversations.toLocaleString()}</td>
                        <td className="py-4 px-4 text-slate-600">{chatbot.created}</td>
                        <td className="py-4 px-4 text-slate-600">{chatbot.lastActive}</td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminChatbots;
