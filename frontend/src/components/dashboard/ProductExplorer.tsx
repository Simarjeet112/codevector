import type { RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid3X3, List, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CategoryOption, Product, ViewMode } from '@/lib/types';
import { EmptyState } from './EmptyState';
import { ProductListSkeleton } from './LoadingStates';

interface ProductExplorerProps {
  category: CategoryOption;
  categories: readonly CategoryOption[];
  error: string | null;
  filteredProducts: Product[];
  lastSyncedAt: string | null;
  loadingInitial: boolean;
  loadingMore: boolean;
  nextCursor: string | null;
  onCategoryChange: (value: CategoryOption) => void;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  search: string;
  sentinelRef: RefObject<HTMLDivElement>;
  summary: {
    total: number;
  };
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
}

function formatPrice(value: string) {
  const price = Number.parseFloat(value);
  return Number.isFinite(price) ? `$${price.toFixed(2)}` : value;
}

function relativeStamp(value: string | null) {
  if (!value) {
    return 'Waiting for sync';
  }

  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff)) {
    return 'Waiting for sync';
  }

  const minutes = Math.max(0, Math.round(diff / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 minute ago';
  return `${minutes} minutes ago`;
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence initial={false} mode="popLayout">
        {products.map((product, index) => (
          <motion.article
            key={product.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, delay: Math.min(index * 0.02, 0.16) }}
            whileHover={{ y: -5 }}
            className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <Badge variant="accent">#{product.id}</Badge>
              <span className="text-sm text-emerald-200">{formatPrice(product.price)}</span>
            </div>
            <h3 className="mt-4 line-clamp-2 font-display text-2xl tracking-tight text-white">{product.name}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.26em] text-slate-400">{product.category}</p>
            <div className="mt-5 rounded-[1.25rem] border border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 text-sm leading-6 text-slate-300">
              {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(
                new Date(product.created_at)
              )}
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/8 text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.24em] text-slate-400">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            <AnimatePresence initial={false}>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.24, delay: Math.min(index * 0.012, 0.16) }}
                  className="group bg-transparent text-slate-200 transition hover:bg-white/4"
                >
                  <td className="px-6 py-4 font-mono text-xs text-cyan-100">{product.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{new Date(product.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">{product.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-emerald-200">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(product.updated_at).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProductExplorer({
  category,
  categories,
  error,
  filteredProducts,
  lastSyncedAt,
  loadingInitial,
  loadingMore,
  nextCursor,
  onCategoryChange,
  onRefresh,
  onSearchChange,
  search,
  sentinelRef,
  summary,
  viewMode,
  onViewModeChange,
}: ProductExplorerProps) {
  const hasResults = filteredProducts.length > 0;

  return (
    <section className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle>Product catalog</CardTitle>
              <CardDescription>
                Scroll to stream more rows. Search filters the loaded catalog, and category changes replay the cursor endpoint.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'secondary'} size="sm" onClick={() => onViewModeChange('grid')}>
                <Grid3X3 className="h-4 w-4" />
                Grid
              </Button>
              <Button variant={viewMode === 'table' ? 'default' : 'secondary'} size="sm" onClick={() => onViewModeChange('table')}>
                <List className="h-4 w-4" />
                Table
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 xl:grid-cols-[1.6fr_0.9fr_0.9fr_auto]">
            <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search products, ids, or categories" />
            <Select value={category} onChange={(event) => onCategoryChange(event.target.value as CategoryOption)}>
              {categories.map((option) => (
                <option key={option} value={option} className="bg-[#0b1727] text-white">
                  {option}
                </option>
              ))}
            </Select>
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-300">
              {summary.total.toLocaleString()} loaded
            </div>
            <Button variant="secondary" onClick={onRefresh}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span>{nextCursor ? 'Infinite pagination is active' : 'You reached the end of the stream'}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-flex" />
              <span>Synced {relativeStamp(lastSyncedAt)}</span>
            </div>
            {search ? <span>{hasResults ? `${filteredProducts.length.toLocaleString()} results in view` : 'No matches in the loaded dataset yet'}</span> : null}
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card className="border-rose-400/20 bg-rose-500/10">
          <CardContent className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-xl text-white">The catalog stream is paused</p>
              <p className="mt-2 text-sm leading-7 text-rose-100/80">{error}</p>
            </div>
            <Button variant="outline" onClick={onRefresh}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loadingInitial ? (
        <ProductListSkeleton viewMode={viewMode} />
      ) : hasResults ? (
        <motion.div layout className="space-y-4">
          {viewMode === 'grid' ? <ProductGrid products={filteredProducts} /> : <ProductTable products={filteredProducts} />}
          <div ref={sentinelRef} className="flex min-h-16 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/4 text-sm text-slate-500">
            {loadingMore ? 'Loading more rows...' : nextCursor ? 'Scroll to load the next cursor page' : 'No more rows to stream'}
          </div>
        </motion.div>
      ) : (
        <EmptyState
          title={search ? 'No products matched the current search' : 'No products loaded yet'}
          description={
            search
              ? 'Try a different term or clear the search. Search currently filters the products already loaded into the dashboard.'
              : 'The backend may still be warming up, or the current category filter returned no rows.'
          }
          actionLabel={search ? 'Clear search' : undefined}
          onAction={search ? () => onSearchChange('') : undefined}
        />
      )}
    </section>
  );
}
