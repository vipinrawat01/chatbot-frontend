
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, isLoading } = useAuth();

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, render without sidebar (this shouldn't normally happen as routes should be protected)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100">
        <main className="w-full overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  // Normal layout with sidebar for authenticated users
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
