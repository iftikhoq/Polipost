import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-surface border border-border rounded-xl p-5 shadow-sm transition-all duration-200',
          hoverable && 'hover:shadow-md hover:border-border-strong hover:-translate-y-0.5 cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
