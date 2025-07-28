
import React from 'react';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Bot, Users, MessageSquare, TrendingUp, Activity, Zap } from 'lucide-react';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's an overview of your chatbots.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Chatbots"
            value={5}
            icon={Bot}
            change="+2 this month"
            color="green"
          />
          <StatsCard
            title="Total Conversations"
            value="12.5K"
            icon={MessageSquare}
            change="+15.3%"
            color="blue"
          />
          <StatsCard
            title="Users Engaged"
            value="3,247"
            icon={Users}
            change="+8.2%"
            color="purple"
          />
          <StatsCard
            title="Success Rate"
            value="94.2%"
            icon={TrendingUp}
            change="+2.1%"
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[
                { action: 'New conversation started', bot: 'Customer Support Bot', time: '2 minutes ago' },
                { action: 'Bot configuration updated', bot: 'Sales Assistant', time: '1 hour ago' },
                { action: 'Knowledge base updated', bot: 'FAQ Bot', time: '3 hours ago' },
                { action: 'New integration added', bot: 'Lead Generation Bot', time: '5 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{activity.action}</p>
                    <p className="text-slate-600 text-sm">{activity.bot}</p>
                  </div>
                  <span className="text-slate-400 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200">
                <Bot className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Create New Chatbot</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">View Analytics</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 border border-purple-200">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700 font-medium">Upgrade Plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Performance Overview</h2>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
