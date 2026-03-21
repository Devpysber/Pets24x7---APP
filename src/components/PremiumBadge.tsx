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
        "shadow-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border-none text-white font-black uppercase tracking-[0.15em] flex items-center gap-1.5 animate-pulse-slow",
        size === 'sm' ? "text-[7px] px-2 py-1 rounded-lg" : "text-[9px] px-3 py-1.5 rounded-xl",
        className
      )}
    >
      <Crown className={cn(size === 'sm' ? "w-2.5 h-2.5" : "w-3.5 h-3.5", "fill-white")} />
      Premium
    </Badge>
  );
};
