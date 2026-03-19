import React from 'react';
import { Badge } from './Badge';
import { Crown } from 'lucide-react';
import { cn } from '../utils/theme';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ className, size = 'sm' }) => {
  return (
    <Badge 
      variant="featured" 
      className={cn(
        "shadow-md bg-gradient-to-r from-amber-500 to-amber-600 border-none text-white font-black uppercase tracking-widest flex items-center gap-1",
        size === 'sm' ? "text-[8px] px-2 py-0.5" : "text-[10px] px-3 py-1",
        className
      )}
    >
      <Crown className={cn(size === 'sm' ? "w-2 h-2" : "w-3 h-3", "fill-current")} />
      Featured
    </Badge>
  );
};
