import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
    <p className="text-sm font-medium text-gray-500">{message}</p>
  </div>
);

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-4">
    <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-red-500" />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-900">Something went wrong</p>
      <p className="text-xs text-gray-500 max-w-[200px] mx-auto">{message}</p>
    </div>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);
