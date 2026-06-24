import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors', {
  variants: {
    variant: {
      default: 'border-transparent bg-white/10 text-slate-100',
      accent: 'border-cyan-300/30 bg-cyan-300/12 text-cyan-100',
      success: 'border-emerald-400/30 bg-emerald-400/12 text-emerald-100',
      warning: 'border-amber-400/30 bg-amber-400/12 text-amber-100',
      muted: 'border-white/10 bg-white/5 text-slate-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
