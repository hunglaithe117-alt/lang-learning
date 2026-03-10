import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm',
                ghost: 'bg-transparent text-[var(--color-muted)] border border-[var(--color-border)] hover:bg-white/5 hover:text-[var(--color-foreground)]',
                outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] hover:bg-white/5',
                secondary: 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)]',
                destructive: 'bg-[var(--color-error)] text-white hover:bg-red-600',
                link: 'text-[var(--color-primary-light)] underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-11 px-6 text-base',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
