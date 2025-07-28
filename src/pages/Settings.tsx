import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, CreditCard, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-2">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your company name" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-slate-600">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Conversations</Label>
                    <p className="text-sm text-slate-600">Notify when chatbot receives messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-slate-600">Get weekly analytics summary</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button variant="outline">Update Password</Button>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-purple-600" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage your API keys for integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-slate-600">ck_prod_••••••••••••••••</p>
                  </div>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                  Billing
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-slate-600">Pro Plan - $29/month</p>
                    </div>
                    <Button variant="outline">Upgrade</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Next Billing Date</p>
                      <p className="text-sm text-slate-600">March 15, 2024</p>
                    </div>
                    <Button variant="outline">View Invoices</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
