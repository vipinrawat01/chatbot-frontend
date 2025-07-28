import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, MoreHorizontal, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminUsers = () => {
  const { user } = useAuth();

  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      chatbots: 3,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
      chatbots: 5,
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      status: 'active',
      chatbots: 0,
      lastActive: 'Currently online'
    },
    {
      id: '4',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'user',
      status: 'inactive',
      chatbots: 1,
      lastActive: '2 weeks ago'
    }
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
              <p className="text-slate-600 mt-2">Manage user accounts and permissions</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                User Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-slate-600">Total Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">10</div>
                  <div className="text-sm text-slate-600">Active Users</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-slate-600">Inactive Users</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-slate-600">Admins</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input placeholder="Search users..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Chatbots</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Last Active</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-600">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{user.chatbots}</td>
                        <td className="py-4 px-4 text-slate-600">{user.lastActive}</td>
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

export default AdminUsers;
