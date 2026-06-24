import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CatalogEmptyProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CatalogEmpty({ title, description, actionLabel, onAction }: CatalogEmptyProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-200">
        <SearchX className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-2xl text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-6">
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}