
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Mail, Phone, Calendar, ExternalLink, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Leads = () => {
  const { user } = useAuth();
  const [selectedChatbot, setSelectedChatbot] = useState<string>('all');

  const mockChatbots = [
    { id: '1', name: 'Customer Support Bot' },
    { id: '2', name: 'Sales Assistant' },
    { id: '3', name: 'FAQ Bot' }
  ];

  const mockLeads = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      chatbotName: 'Customer Support Bot',
      chatbotId: '1',
      message: 'I need help with my account settings and password reset.',
      status: 'new',
      createdAt: '2024-01-15T10:30:00Z',
      source: 'Website Chat'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      phone: '+1 (555) 987-6543',
      chatbotName: 'Sales Assistant',
      chatbotId: '2',
      message: 'Interested in enterprise pricing and features. Would like to schedule a demo.',
      status: 'contacted',
      createdAt: '2024-01-14T15:45:00Z',
      source: 'Product Page'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@startup.io',
      phone: '+1 (555) 456-7890',
      chatbotName: 'FAQ Bot',
      chatbotId: '3',
      message: 'Questions about API integration and documentation.',
      status: 'qualified',
      createdAt: '2024-01-13T09:15:00Z',
      source: 'Documentation'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@business.com',
      phone: '+1 (555) 321-0987',
      chatbotName: 'Customer Support Bot',
      chatbotId: '1',
      message: 'Having trouble with billing and subscription management.',
      status: 'new',
      createdAt: '2024-01-12T14:20:00Z',
      source: 'Support Portal'
    }
  ];

  const filteredLeads = selectedChatbot === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.chatbotId === selectedChatbot);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
            <p className="text-slate-600 mt-2">Manage leads generated from your chatbots</p>
          </div>

          {/* Filter Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filter by Chatbot:</span>
              </div>
              <Select value={selectedChatbot} onValueChange={setSelectedChatbot}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a chatbot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chatbots</SelectItem>
                  {mockChatbots.map((chatbot) => (
                    <SelectItem key={chatbot.id} value={chatbot.id}>
                      {chatbot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="ml-auto">
                {filteredLeads.length} leads
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lead.name}</CardTitle>
                        <CardDescription>From {lead.chatbotName}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-slate-500">{lead.source}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700">{lead.message}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Conversation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No leads found</h3>
                <p className="text-slate-600">
                  {selectedChatbot === 'all' 
                    ? 'No leads have been generated yet.' 
                    : 'No leads found for the selected chatbot.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leads;
