import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          'h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 pr-11 text-sm font-medium text-slate-100 outline-none transition-colors focus:border-cyan-300/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-300/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
