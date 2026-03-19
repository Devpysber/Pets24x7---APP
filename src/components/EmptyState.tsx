import React from 'react';
import { LucideIcon, Search, Inbox, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/theme';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500",
      className
    )}>
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-8">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold px-8"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const NoLeadsState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState 
    icon={MessageSquare}
    title="No Leads Yet"
    description="You haven't received any inquiries yet. Complete your profile to attract more customers!"
    actionLabel="Complete Profile"
    onAction={onAction}
  />
);

export const NoResultsState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState 
    icon={Search}
    title="No Results Found"
    description="We couldn't find any services matching your search. Try adjusting your filters or location."
    actionLabel="Clear Filters"
    onAction={onAction}
  />
);

export const NoPostsState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState 
    icon={AlertCircle}
    title="No Posts Found"
    description="Be the first to share a tip, story, or adoption post with the community!"
    actionLabel="Create Post"
    onAction={onAction}
  />
);
