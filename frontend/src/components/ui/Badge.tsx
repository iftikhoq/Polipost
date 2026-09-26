import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'gold' | 'neutral' | 'success' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-subtle text-primary border-primary/20',
    accent: 'bg-status-danger-bg text-accent border-accent/20',
    gold: 'bg-gold-subtle text-gold border-gold/30',
    neutral: 'bg-surface-subtle text-text-muted border-border',
    success: 'bg-status-success-bg text-status-success border-status-success/20',
    warning: 'bg-status-warning-bg text-status-warning border-status-warning/20',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
