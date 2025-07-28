
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'increase' | 'decrease';
  color?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'increase',
  color = 'green' 
}: StatsCardProps) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? '↗' : '↘'} {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
