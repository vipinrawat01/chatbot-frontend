
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ViewToggle = () => {
  const { user, currentView, toggleView } = useAuth();

  // Only show toggle for admin users
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 px-4 py-3 border-b border-slate-800">
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-slate-400" />
        <Label htmlFor="view-toggle" className="text-sm text-slate-300">
          User View
        </Label>
      </div>
      
      <Switch
        id="view-toggle"
        checked={currentView === 'admin'}
        onCheckedChange={toggleView}
        className="data-[state=checked]:bg-green-500"
      />
      
      <div className="flex items-center space-x-2">
        <Shield className="w-4 h-4 text-slate-400" />
        <Label htmlFor="view-toggle" className="text-sm text-slate-300">
          Admin View
        </Label>
      </div>
    </div>
  );
};

export default ViewToggle;
