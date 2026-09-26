import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-text-primary tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-subtle transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
              error && 'border-status-danger focus:ring-status-danger',
              className
            )
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-status-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-subtle">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
