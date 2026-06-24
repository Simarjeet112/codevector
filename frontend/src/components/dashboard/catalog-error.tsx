import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CatalogErrorProps {
  message: string;
  onRetry: () => void;
}

export function CatalogError({ message, onRetry }: CatalogErrorProps) {
  return (
    <Card className="border-rose-400/20 bg-rose-500/8 p-8">
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-400/12 text-rose-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-2xl text-white">The catalog stream stalled.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-100/80">{message}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </Card>
  );
}