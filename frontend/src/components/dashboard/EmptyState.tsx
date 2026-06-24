import { AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="rounded-full border border-white/10 bg-white/6 p-4 text-cyan-100">
          {actionLabel ? <Search className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
        </div>
        <div className="max-w-lg space-y-2">
          <h3 className="font-display text-2xl text-white">{title}</h3>
          <p className="text-sm leading-7 text-slate-400">{description}</p>
        </div>
        {actionLabel && onAction ? (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
