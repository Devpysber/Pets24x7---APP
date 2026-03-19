import React, { memo } from 'react';
import { Button } from './Button';
import { ChevronRight } from 'lucide-react';
import { cn } from '../utils/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  className?: string;
  showSeeAll?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = memo(({ 
  title, 
  subtitle, 
  onSeeAll, 
  className,
  showSeeAll = true
}) => {
  return (
    <div className={cn("flex items-center justify-between mb-4 px-1", className)}>
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>
      {showSeeAll && onSeeAll && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSeeAll}
          className="text-indigo-600 font-bold hover:bg-indigo-50 p-0 h-auto flex items-center gap-1"
        >
          See All
          <ChevronRight size={14} />
        </Button>
      )}
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';
