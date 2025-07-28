import React from 'react';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Bot, Users, MessageSquare, TrendingUp, Server, Globe, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitor and manage your chatbot platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value="1,247"
            icon={Users}
            change="+12.5%"
            color="blue"
          />
          <StatsCard
            title="Active Chatbots"
            value="3,456"
            icon={Bot}
            change="+18.3%"
            color="green"
          />
          <StatsCard
            title="Total Messages"
            value="125.4K"
            icon={MessageSquare}
            change="+25.1%"
            color="purple"
          />
          <StatsCard
            title="Success Rate"
            value="96.8%"
            icon={TrendingUp}
            change="+2.4%"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">API Status</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Database</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">CDN</span>
                <Badge className="bg-yellow-100 text-yellow-800">Slow</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Webhooks</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Bots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Top Performing Bots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'E-commerce Assistant', messages: '15.2K', success: '98%' },
                { name: 'Support Bot Pro', messages: '12.8K', success: '95%' },
                { name: 'Lead Generator', messages: '9.5K', success: '92%' },
                { name: 'FAQ Helper', messages: '7.2K', success: '96%' },
              ].map((bot, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{bot.name}</p>
                    <p className="text-sm text-slate-600">{bot.messages} messages</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{bot.success}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'John Smith', email: 'john@company.com', plan: 'Pro', status: 'Active' },
                { name: 'Sarah Johnson', email: 'sarah@startup.io', plan: 'Basic', status: 'Active' },
                { name: 'Mike Chen', email: 'mike@tech.co', plan: 'Enterprise', status: 'Trial' },
                { name: 'Emma Davis', email: 'emma@shop.com', plan: 'Pro', status: 'Active' },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{user.plan}</Badge>
                    <p className="text-xs text-slate-500 mt-1">{user.status}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Advanced analytics chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
