import React from 'react';
import { cn } from '../utils/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'featured' | 'lost' | 'found';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    secondary: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    accent: 'bg-amber-50 text-amber-700 border-amber-100',
    featured: 'bg-violet-50 text-violet-700 border-violet-100',
    lost: 'bg-red-50 text-red-700 border-red-100',
    found: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
