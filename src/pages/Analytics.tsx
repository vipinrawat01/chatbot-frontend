import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-600 mt-2">Track your chatbot performance and user interactions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,543</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">-0.3s from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Trends</CardTitle>
                <CardDescription>Daily conversation volume over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500">
                  Chart placeholder - Integration with analytics service needed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
                <CardDescription>Most frequently discussed topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { topic: 'Product Information', count: 456, percentage: 45 },
                    { topic: 'Support Issues', count: 324, percentage: 32 },
                    { topic: 'Pricing Questions', count: 234, percentage: 23 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.topic}</span>
                        <span className="text-xs text-slate-500">{item.count} conversations</span>
                      </div>
                      <div className="text-sm text-slate-600">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
