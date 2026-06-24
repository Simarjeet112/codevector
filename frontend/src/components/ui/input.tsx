import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors" />
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-11 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-300/20',
          className
        )}
        {...props}
      />
    </div>
  )
);

Input.displayName = 'Input';
