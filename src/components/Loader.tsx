import React from 'react';
import { cn } from '../utils/theme';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} />
  );
};

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
};
