import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Database, Mail, Server } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Settings</h1>
            <p className="text-slate-600 mt-2">Configure system-wide settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2 text-blue-600" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  General system settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Application Name</Label>
                    <Input id="app-name" defaultValue="ChatBot Pro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" type="email" defaultValue="support@chatbotpro.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-description">Application Description</Label>
                  <Input id="app-description" defaultValue="Advanced AI-powered chatbot platform" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-slate-600">Enable to show maintenance page to users</p>
                  </div>
                  <Switch />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Control user registration and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow User Registration</Label>
                    <p className="text-sm text-slate-600">Enable new users to create accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification Required</Label>
                    <p className="text-sm text-slate-600">Require email verification for new accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Approval Required</Label>
                    <p className="text-sm text-slate-600">New accounts need admin approval</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-chatbots">Max Chatbots per User</Label>
                  <Input id="max-chatbots" type="number" defaultValue="5" />
                </div>
              </CardContent>
            </Card>

            {/* Email Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-purple-600" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure SMTP settings for system emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" type="number" defaultValue="587" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Use TLS/SSL</Label>
                    <p className="text-sm text-slate-600">Enable secure email transmission</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline">Test Email Configuration</Button>
              </CardContent>
            </Card>

            {/* Database Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-indigo-600" />
                  Database & Storage
                </CardTitle>
                <CardDescription>
                  Database maintenance and storage settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-slate-600">Automatically backup database daily</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="retention-days">Data Retention (Days)</Label>
                  <Input id="retention-days" type="number" defaultValue="365" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-file-size">Max File Upload Size (MB)</Label>
                  <Input id="max-file-size" type="number" defaultValue="10" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Run Backup Now</Button>
                  <Button variant="outline">Optimize Database</Button>
                </div>
              </CardContent>
            </Card>

            {/* API Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-orange-600" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  API limits and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                  <Input id="rate-limit" type="number" defaultValue="100" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable API Key Authentication</Label>
                    <p className="text-sm text-slate-600">Require API keys for external access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable CORS</Label>
                    <p className="text-sm text-slate-600">Allow cross-origin requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button>Save API Settings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSettings;
