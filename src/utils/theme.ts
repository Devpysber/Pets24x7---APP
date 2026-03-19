import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const THEME = {
  colors: {
    primary: '#4F46E5', // Indigo 600
    secondary: '#10B981', // Emerald 500
    accent: '#F59E0B', // Amber 500
    background: '#F9FAFB', // Gray 50
    surface: '#FFFFFF',
    text: {
      primary: '#111827', // Gray 900
      secondary: '#4B5563', // Gray 600
      muted: '#9CA3AF', // Gray 400
    },
    status: {
      lost: '#EF4444', // Red 500
      found: '#10B981', // Emerald 500
      featured: '#8B5CF6', // Violet 500
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  }
};
