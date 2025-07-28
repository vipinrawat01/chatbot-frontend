import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../lib/config';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Edit2, Trash2, Bot, Users, MessageSquare, Sparkles } from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  description: string;
  category: string;
  category_display: string;
  system_prompt: string;
  greeting_message: string;
  specializations: string[];
  tone: string;
  tone_display: string;
  is_active: boolean;
  chatbots_using: number;
  total_conversations: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface AgentCategory {
  value: string;
  label: string;
}

interface AgentTone {
  value: string;
  label: string;
}

const AdminAgents: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [categories, setCategories] = useState<AgentCategory[]>([]);
  const [tones, setTones] = useState<AgentTone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    system_prompt: '',
    greeting_message: 'Hello! How can I help you today?',
    specializations: '',
    tone: 'professional'
  });

  useEffect(() => {
    if (user?.is_superuser) {
      // First verify authentication works
      verifyAuthAndFetchAgents();
    }
  }, [user]);

  const verifyAuthAndFetchAgents = async () => {
    try {
      // First check if we're authenticated
      const authResponse = await fetch(getApiUrl('/api/auth/current-user/'), {
        credentials: 'include'
      });
      
      const authData = await authResponse.json();
      console.log('Auth verification:', authData);
      
      if (authData.authenticated && authData.user.is_superuser) {
        // If authenticated, proceed to fetch all data
        await Promise.all([
          fetchAgents(),
          fetchCategories(), 
          fetchTones()
        ]);
      } else {
        // If not authenticated, try to get fresh session
        console.warn('User not authenticated for agents API, redirecting to login');
        toast({
          title: "Session Expired",
          description: "Please log in again to access the agents management.",
          variant: "destructive",
        });
        
        // Don't break the UI, just show empty state
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch(getApiUrl('/api/agents/'), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      // Check if response is not ok
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin.');
        } else if (response.status === 403) {
          throw new Error('Admin privileges required to access agents.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const data = await response.json();
      if (data.success) {
        setAgents(data.data || []); // Ensure we always set an array
      } else {
        throw new Error(data.error || 'Failed to fetch agents');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      
      // Show specific error messages
      let errorMessage = 'Failed to load agents';
      if (error.message.includes('Authentication required')) {
        errorMessage = 'Session expired. Please refresh the page and log in again.';
      } else if (error.message.includes('Admin privileges required')) {
        errorMessage = 'Admin privileges required to access this page';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Set empty agents instead of letting the component crash
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(getApiUrl('/api/agents/categories/'));
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []); // Ensure we always set an array
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const fetchTones = async () => {
    try {
      const response = await fetch(getApiUrl('/api/agents/tones/'));
      const data = await response.json();
      if (data.success) {
        setTones(data.data || []); // Ensure we always set an array
      }
    } catch (error) {
      console.error('Error fetching tones:', error);
      setTones([]); // Set empty array on error
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        category: 'general', // Default category
        tone: 'professional', // Default tone  
        greeting_message: 'Hello! How can I help you today?', // Default greeting
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s)
      };

      const response = await fetch(getApiUrl('/api/agents/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Agent created successfully",
        });
        setIsCreateModalOpen(false);
        resetForm();
        fetchAgents();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create agent",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    }
  };

  const handleEditAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    try {
      const payload = {
        ...formData,
        // Preserve existing values for removed fields during edit
        category: selectedAgent.category,
        tone: selectedAgent.tone,  
        greeting_message: selectedAgent.greeting_message,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s)
      };

              const response = await fetch(getApiUrl(`/api/agents/${selectedAgent.id}/`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Agent updated successfully",
        });
        setIsEditModalOpen(false);
        setSelectedAgent(null);
        resetForm();
        fetchAgents();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update agent",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAgent = async (agent: Agent) => {
    try {
              const response = await fetch(getApiUrl(`/api/agents/${agent.id}/`), {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchAgents();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete agent",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  const createDefaultAgents = async () => {
    try {
              const response = await fetch(getApiUrl('/api/agents/create-defaults/'), {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchAgents();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create default agents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating default agents:', error);
      toast({
        title: "Error",
        description: "Failed to create default agents",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      description: agent.description,
      category: agent.category,
      system_prompt: agent.system_prompt,
      greeting_message: agent.greeting_message,
      specializations: (agent.specializations && Array.isArray(agent.specializations)) ? agent.specializations.join(', ') : '',
      tone: agent.tone
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general', // Set default
      system_prompt: '',
      greeting_message: '', // Set empty default
      specializations: '',
      tone: 'professional' // Set default
    });
  };

  const getToneColor = (tone: string) => {
    const colors: Record<string, string> = {
      professional: 'bg-blue-100 text-blue-800',
      friendly: 'bg-green-100 text-green-800',
      casual: 'bg-yellow-100 text-yellow-800',
      expert: 'bg-purple-100 text-purple-800',
      supportive: 'bg-pink-100 text-pink-800',
      energetic: 'bg-orange-100 text-orange-800'
    };
    return colors[tone] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      ecommerce: 'bg-green-100 text-green-800',
      realestate: 'bg-blue-100 text-blue-800',
      healthcare: 'bg-red-100 text-red-800',
      education: 'bg-indigo-100 text-indigo-800',
      finance: 'bg-emerald-100 text-emerald-800',
      technology: 'bg-violet-100 text-violet-800',
      legal: 'bg-slate-100 text-slate-800',
      travel: 'bg-cyan-100 text-cyan-800',
      custom: 'bg-amber-100 text-amber-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (!user?.is_superuser) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Bot className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600 mb-4">
                You need admin privileges to access the AI Agents management page.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Current User:</strong> {user?.username || 'Not logged in'}</p>
                <p><strong>Admin Status:</strong> {user?.is_superuser ? 'Yes' : 'No'}</p>
                <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
              </div>
              {!user && (
                <p className="text-blue-600 mt-4">
                  Please log in with an admin account to continue.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
            <p className="text-gray-600 mt-2">
              Create and manage specialized AI agents with different personas and expertise areas.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={createDefaultAgents}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Create Defaults
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Agent</DialogTitle>
                  <DialogDescription>
                    Create a specialized AI agent with a unique persona and expertise area.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateAgent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Agent Name*</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., E-commerce Expert"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of what this agent specializes in"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specializations">Specializations</Label>
                    <Input
                      id="specializations"
                      value={formData.specializations}
                      onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                      placeholder="Comma-separated list (e.g., sales, support, analytics)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="system_prompt">Agent Persona & Instructions*</Label>
                    <Textarea
                      id="system_prompt"
                      value={formData.system_prompt}
                      onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                      placeholder="Define the agent's personality, expertise, and how it should behave. This will be combined with the base knowledge system prompt."
                      rows={6}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      This prompt defines your agent's personality and expertise. It will be combined with the base system prompt that handles knowledge base integration.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Agent</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{agents?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{agents?.filter(a => a.is_active).length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Use</p>
                  <p className="text-2xl font-bold text-gray-900">{agents?.reduce((sum, a) => sum + a.chatbots_using, 0) || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{agents ? new Set(agents.map(a => a.category)).size : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents && agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {agent.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {agent.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(agent)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{agent.name}"? 
                            {agent.chatbots_using > 0 && (
                              <span className="text-orange-600 font-medium">
                                {' '}This agent is currently being used by {agent.chatbots_using} chatbot(s) and will be deactivated instead of deleted.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAgent(agent)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {agent.chatbots_using > 0 ? 'Deactivate' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(agent.category)}>
                      {agent.category_display}
                    </Badge>
                    <Badge className={getToneColor(agent.tone)}>
                      {agent.tone_display}
                    </Badge>
                  </div>
                  
                  {agent.specializations && agent.specializations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Specializations:</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.specializations.slice(0, 3).map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {agent.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Used by {agent.chatbots_using} chatbots</span>
                    <span>{agent.total_conversations} conversations</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created by {agent.created_by} • {new Date(agent.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {agents.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Agents Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first AI agent to get started with specialized chatbot personas.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Agent
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Agent</DialogTitle>
              <DialogDescription>
                Update the agent's configuration and persona.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditAgent} className="space-y-4">
              {/* Same form fields as create modal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Agent Name*</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., E-commerce Expert"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this agent specializes in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-specializations">Specializations</Label>
                <Input
                  id="edit-specializations"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  placeholder="Comma-separated list (e.g., sales, support, analytics)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-system_prompt">Agent Persona & Instructions*</Label>
                <Textarea
                  id="edit-system_prompt"
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  placeholder="Define the agent's personality, expertise, and how it should behave."
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">
                  This prompt defines your agent's personality and expertise. It will be combined with the base system prompt.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedAgent(null); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit">Update Agent</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminAgents; 