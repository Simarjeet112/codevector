import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { CatalogCategory, CatalogViewMode } from '@/lib/types';

interface CatalogControlsProps {
  categories: readonly string[];
  category: CatalogCategory;
  onCategoryChange: (value: CatalogCategory) => void;
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: CatalogViewMode;
  onViewModeChange: (value: CatalogViewMode) => void;
  totalLoaded: number;
  visibleCount: number;
}

export function CatalogControls({
  categories,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalLoaded,
  visibleCount,
}: CatalogControlsProps) {
  return (
    <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-glass backdrop-blur-xl lg:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">Catalog controls</p>
          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Stream, filter, and inspect the live inventory.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Cursor pagination keeps deep browsing fast. Search is applied across the loaded stream while more records continue to hydrate in the background.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="muted">{totalLoaded.toLocaleString()} loaded</Badge>
          <Badge variant="accent">{visibleCount.toLocaleString()} visible</Badge>
          <Badge variant="success">Live filtering</Badge>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.72fr)_auto]">
        <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search product names, categories, or ids" />

        <Select value={category} onChange={(event) => onCategoryChange(event.target.value as CatalogCategory)}>
          {categories.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-1.5">
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => onViewModeChange('grid')}>
            Grid
          </Button>
          <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => onViewModeChange('table')}>
            Table
          </Button>
        </div>
      </div>
    </div>
  );
}