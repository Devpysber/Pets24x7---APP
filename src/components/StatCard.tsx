import React from 'react';
import { Card } from './Card';
import { cn } from '../utils/theme';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  color = 'bg-indigo-50 text-indigo-600',
  className,
  onClick
}) => {
  return (
    <Card 
      className={cn("p-4 flex items-center gap-4 cursor-pointer transition-all active:scale-95", className)}
      onClick={onClick}
    >
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-xl font-black text-gray-900">{value}</h4>
          {trend && (
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
              trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
