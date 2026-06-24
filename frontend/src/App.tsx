import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Database, LineChart, PackageSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CatalogControls } from '@/components/dashboard/catalog-controls';
import { CatalogEmpty } from '@/components/dashboard/catalog-empty';
import { CatalogError } from '@/components/dashboard/catalog-error';
import { AnalyticsPanel } from '@/components/dashboard/analytics-panel';
import { HeroScene } from '@/components/dashboard/hero-scene';
import { ProductGrid } from '@/components/dashboard/product-grid';
import { ProductGridSkeleton, ProductTableSkeleton } from '@/components/dashboard/product-skeletons';
import { ProductTable } from '@/components/dashboard/product-table';
import { useCatalog } from '@/hooks/useCatalog';
import { formatCompactNumber, formatCurrency, formatRelativeTime } from '@/lib/utils';

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </Card>
  );
}

export default function App() {
  const {
    categories,
    category,
    setCategory,
    search,
    setSearch,
    viewMode,
    setViewMode,
    products,
    filteredProducts,
    loadingInitial,
    loadingMore,
    isLoading,
    error,
    retry,
    sentinelRef,
    lastSyncedAt,
    averagePrice,
    maxPrice,
    categoryBreakdown,
    priceTrail,
  } = useCatalog();

  const visibleCategories = useMemo(() => categoryBreakdown.filter((item) => item.value > 0).length, [categoryBreakdown]);

  const decoratedCategories = useMemo(
    () =>
      categoryBreakdown.map((entry, index) => ({
        ...entry,
        color: ['#67e8f9', '#60a5fa', '#a78bfa', '#34d399', '#f59e0b', '#f97316'][index % 6],
      })),
    [categoryBreakdown]
  );

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-aurora opacity-80" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-4 shadow-glass backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-sky-500 text-slate-950 shadow-glow">
              <PackageSearch className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-white">CodeVector</p>
              <p className="text-sm text-slate-400">Premium product catalog dashboard</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Badge variant="success">PostgreSQL live</Badge>
            <Badge variant="accent">Cursor pagination</Badge>
            <Badge variant="muted">200k+ seeded products</Badge>
          </div>

          <Button variant="secondary" className="hidden sm:inline-flex">
            YC-grade experience
          </Button>
        </header>

        <main className="mt-6 grid flex-1 gap-6 lg:mt-8">
          <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 shadow-glass backdrop-blur-2xl sm:p-8 lg:p-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100">
                Live inventory intelligence
              </div>
              <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl xl:text-6xl">
                A premium catalog workspace for teams that ship at serious scale.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Built on the existing cursor-paginated backend, this dashboard delivers a luxury SaaS feel with smooth animations, glassmorphism, fast filters, and live browsing across a 200k+ row catalog.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore catalog
                </Button>
                <Button variant="outline" size="lg" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                  Jump to table
                </Button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard label="Rows loaded" value={formatCompactNumber(products.length)} detail="Progressive cursor-backed hydration." />
                <StatCard label="Categories" value={formatCompactNumber(visibleCategories)} detail="Balanced product mix across the stream." />
                <StatCard label="Pricing range" value={formatCurrency(maxPrice)} detail="Highest price in the current slice." />
              </div>
            </motion.div>

            <HeroScene />
          </section>

          <section>
            <AnalyticsPanel
              totalLoaded={products.length}
              averagePrice={averagePrice}
              maxPrice={maxPrice}
              categoryBreakdown={decoratedCategories}
              priceTrail={priceTrail}
            />
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader>
                <CardTitle>Responsive command center</CardTitle>
                <CardDescription>Tailored for desktop analytics and mobile browsing without changing the backend contract.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-cyan-200" />
                Dark glass surfaces, motion accents, and a premium SaaS aesthetic.
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader>
                <CardTitle>Category-aware browsing</CardTitle>
                <CardDescription>Filters replay the existing category-aware cursor pagination endpoint.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3 text-sm text-slate-300">
                <Database className="h-4 w-4 text-cyan-200" />
                Category selection stays server-driven, search is instant on the loaded rows.
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader>
                <CardTitle>Motion-first UI</CardTitle>
                <CardDescription>Every major surface uses Framer Motion to keep the experience alive.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3 text-sm text-slate-300">
                <LineChart className="h-4 w-4 text-cyan-200" />
                Charts, cards, table rows, and hero sections all animate with intent.
              </CardContent>
            </Card>
          </section>

          <section id="catalog" className="space-y-5">
            <CatalogControls
              categories={categories}
              category={category}
              onCategoryChange={setCategory}
              search={search}
              onSearchChange={setSearch}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalLoaded={products.length}
              visibleCount={filteredProducts.length}
            />

            {error ? <CatalogError message={error} onRetry={retry} /> : null}

            {isLoading ? (
              viewMode === 'grid' ? <ProductGridSkeleton /> : <ProductTableSkeleton />
            ) : filteredProducts.length === 0 ? (
              <CatalogEmpty
                title={search ? 'No products matched your search.' : 'No products available in this category yet.'}
                description={
                  search
                    ? 'Try a broader query or clear the search field. New rows continue loading as you browse.'
                    : 'Switch categories or wait for the first page of the live stream to load.'
                }
                actionLabel={search ? 'Clear search' : 'Reset filters'}
                onAction={() => {
                  setSearch('');
                  setCategory('All');
                }}
              />
            ) : (
              <div className="space-y-5">
                {viewMode === 'grid' ? <ProductGrid products={filteredProducts} /> : <ProductTable products={filteredProducts} />}
                <div ref={sentinelRef} className="flex items-center justify-center py-10">
                  {loadingMore ? (
                    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
                      Loading the next cursor page
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Scroll to continue the live stream.</p>
                  )}
                </div>
              </div>
            )}
          </section>

          <footer className="pb-4 pt-2 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
            Synced {lastSyncedAt ? formatRelativeTime(lastSyncedAt) : 'just now'}
          </footer>
        </main>
      </div>
    </div>
  );
}
