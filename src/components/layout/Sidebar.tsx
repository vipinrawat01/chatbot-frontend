
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  BarChart3, 
  Settings, 
  Code, 
  Users,
  Database,
  Bell,
  HelpCircle,
  LogOut,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ViewToggle from './ViewToggle';

const Sidebar = () => {
  const { user, currentView, logout } = useAuth();
  const location = useLocation();

  // If no user, don't render sidebar
  if (!user) {
    return null;
  }

  const userMenuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'My Chatbots', icon: Bot, path: '/chatbots' },
    { title: 'Create Chatbot', icon: Bot, path: '/create' },
    { title: 'Analytics', icon: BarChart3, path: '/analytics' },
    { title: 'Leads', icon: UserCheck, path: '/leads' },
    { title: 'Code Snippets', icon: Code, path: '/snippets' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  const adminMenuItems = [
    { title: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin' },
    { title: 'All Chatbots', icon: Bot, path: '/admin/chatbots' },
    { title: 'AI Agents', icon: Sparkles, path: '/admin/agents' },
    { title: 'Users Management', icon: Users, path: '/admin/users' },
    { title: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { title: 'Knowledge Base', icon: Database, path: '/admin/knowledge' },
    { title: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const menuItems = currentView === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">ChatBot Pro</h1>
            <p className="text-slate-400 text-sm">
              {currentView === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle for Admin */}
      <div className="flex-shrink-0">
        <ViewToggle />
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-green-500 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Always visible */}
      <div className="p-4 border-t border-slate-800 flex-shrink-0">
        <button className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200 w-full mb-2">
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
