import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <Card className="group h-full overflow-hidden border-white/10 bg-white/[0.04]">
        <div className="h-1 bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 opacity-70 transition-opacity group-hover:opacity-100" />
        <div className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-white">{product.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">ID {product.id}</p>
            </div>
            <Badge variant="accent">{product.category}</Badge>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Price</p>
              <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(product.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Updated</p>
              <p className="mt-1 text-sm text-slate-200">{formatDateTime(product.updated_at)}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}