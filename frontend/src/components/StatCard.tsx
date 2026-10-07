import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'text-teal'
}) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-surface-alt flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-navy-light font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg bg-surface ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-navy">{value}</span>
        {subtitle && <span className="text-sm text-navy-light">{subtitle}</span>}
      </div>
      {trend && (
        <div className="mt-auto pt-4 border-t border-surface flex items-center text-sm">
          <span className={`font-medium ${trend.value >= 0 ? 'text-success' : 'text-error'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-navy-light ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
