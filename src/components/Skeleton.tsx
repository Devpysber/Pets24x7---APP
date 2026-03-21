import React from 'react';
import { cn } from '../utils/theme';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "animate-pulse bg-slate-200 rounded-md",
        className
      )} 
    />
  );
};

export const ListingSkeleton: React.FC<{ viewType?: 'grid' | 'list', isPremium?: boolean }> = ({ viewType = 'grid', isPremium = false }) => {
  if (viewType === 'list') {
    return (
      <div className={cn(
        "flex gap-4 p-3 rounded-3xl border transition-all",
        isPremium ? "bg-amber-50/30 border-amber-200 shadow-sm" : "bg-white border-black/5"
      )}>
        <Skeleton className={cn(
          "shrink-0",
          isPremium ? "h-32 w-32 rounded-2xl bg-amber-100" : "h-28 w-28 rounded-xl bg-slate-200"
        )} />
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <Skeleton className={cn("h-3 w-16 mb-2", isPremium ? "bg-amber-200" : "bg-slate-200")} />
            <Skeleton className={cn("h-5 w-3/4 mb-2", isPremium ? "bg-amber-200" : "bg-slate-200")} />
            <Skeleton className={cn("h-3 w-1/2", isPremium ? "bg-amber-200" : "bg-slate-200")} />
          </div>
          <div className="flex gap-2">
            <Skeleton className={cn("h-8 flex-1 rounded-lg", isPremium ? "bg-amber-200" : "bg-slate-200")} />
            <Skeleton className={cn("h-8 flex-1 rounded-lg", isPremium ? "bg-amber-200" : "bg-slate-200")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col rounded-3xl border overflow-hidden transition-all",
      isPremium ? "bg-amber-50/30 border-amber-200 shadow-sm" : "bg-white border-black/5"
    )}>
      <Skeleton className={cn(
        "w-full",
        isPremium ? "h-48 bg-amber-100" : "h-40 bg-slate-200"
      )} />
      <div className="p-3">
        <Skeleton className={cn("h-3 w-16 mb-2", isPremium ? "bg-amber-200" : "bg-slate-200")} />
        <Skeleton className={cn("h-5 w-3/4 mb-2", isPremium ? "bg-amber-200" : "bg-slate-200")} />
        <Skeleton className={cn("h-3 w-1/2 mb-4", isPremium ? "bg-amber-200" : "bg-slate-200")} />
        <div className="flex gap-2">
          <Skeleton className={cn("h-8 flex-1 rounded-lg", isPremium ? "bg-amber-200" : "bg-slate-200")} />
          <Skeleton className={cn("h-8 flex-1 rounded-lg", isPremium ? "bg-amber-200" : "bg-slate-200")} />
        </div>
      </div>
    </div>
  );
};

export const PostSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl border border-black/5 p-4 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-48 w-full rounded-2xl" />
    <div className="flex gap-4">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);
