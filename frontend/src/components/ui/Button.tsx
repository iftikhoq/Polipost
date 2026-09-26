import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-lg';

  const variants = {
    primary:
      'bg-primary hover:bg-primary-soft text-white focus:ring-primary shadow-sm hover:shadow active:scale-[0.98]',
    accent:
      'bg-accent hover:bg-accent-soft text-accent-on focus:ring-accent shadow-sm hover:shadow active:scale-[0.98]',
    gold:
      'bg-gold hover:bg-gold-soft text-slate-950 font-semibold focus:ring-gold shadow-sm hover:shadow active:scale-[0.98]',
    outline:
      'border border-border-strong hover:bg-surface-subtle text-text-primary focus:ring-primary',
    ghost:
      'text-text-muted hover:text-text-primary hover:bg-surface-subtle focus:ring-primary',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-3 gap-2.5 h-12',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
