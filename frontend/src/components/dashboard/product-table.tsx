import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/[0.02] text-xs uppercase tracking-[0.24em] text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.015, 0.18) }}
                className="transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-400">Product #{product.id}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="muted" className="w-fit">
                    {product.category}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-white">{formatCurrency(product.price)}</td>
                <td className="px-5 py-4 text-sm text-slate-300">{formatDateTime(product.updated_at)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}