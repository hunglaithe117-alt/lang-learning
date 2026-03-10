import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => (
        <input
            type={type}
            className={cn(
                'flex h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm',
                'text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-colors',
                className,
            )}
            ref={ref}
            {...props}
        />
    ),
);
Input.displayName = 'Input';

export { Input };
