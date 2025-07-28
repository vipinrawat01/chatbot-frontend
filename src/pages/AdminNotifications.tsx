import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertCircle, CheckCircle, Info, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminNotifications = () => {
  const { user } = useAuth();

  const notifications = [
    {
      id: '1',
      type: 'alert',
      title: 'High Server Load Detected',
      message: 'Server response time increased by 40% in the last hour',
      timestamp: '5 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'info',
      title: 'New User Registration',
      message: 'John Doe (john@example.com) has created a new account',
      timestamp: '2 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: '3',
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily database backup completed successfully',
      timestamp: '6 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Payment Failed',
      message: 'Payment failed for user jane@example.com - subscription suspended',
      timestamp: '1 day ago',
      read: false,
      priority: 'high'
    },
    {
      id: '5',
      type: 'info',
      title: 'Feature Update',
      message: 'New chatbot customization options are now available',
      timestamp: '2 days ago',
      read: true,
      priority: 'medium'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
              <p className="text-slate-600 mt-2">System alerts and important updates</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                Notification Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-slate-600">Unread Alerts</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">5</div>
                  <div className="text-sm text-slate-600">High Priority</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-slate-600">Today</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">45</div>
                  <div className="text-sm text-slate-600">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                <Button variant="outline" size="sm">
                  Mark All as Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read ? 'bg-slate-50' : 'bg-white border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                              {notification.title}
                            </h3>
                            <Badge variant={getBadgeVariant(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {notification.read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminNotifications;
