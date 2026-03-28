import React from 'react';
import { cn } from '../utils/theme';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm',
    outline: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl',
    lg: 'px-6 py-3 text-base font-bold rounded-2xl',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  );
};
