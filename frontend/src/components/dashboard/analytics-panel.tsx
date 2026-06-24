import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';

interface AnalyticsPanelProps {
  totalLoaded: number;
  averagePrice: number;
  maxPrice: number;
  categoryBreakdown: Array<{ label: string; value: number; color: string }>;
  priceTrail: number[];
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) {
    return <div className="h-24 rounded-2xl border border-dashed border-white/10 bg-white/[0.03]" />;
  }

  const width = 220;
  const height = 96;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full">
      <defs>
        <linearGradient id="sparklineFill" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#sparklineFill)"
        stroke="none"
      />
      <polyline points={points} fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function DonutChart({ items }: { items: Array<{ label: string; value: number; color: string }> }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0 -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
        {items.map((item) => {
          const length = total === 0 ? 0 : (item.value / total) * circumference;
          const circle = (
            <circle
              key={item.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="16"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );

          offset += length;
          return circle;
        })}
      </svg>

      <div className="min-w-0 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
            <span className="font-semibold text-white">{formatCompactNumber(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPanel({ totalLoaded, averagePrice, maxPrice, categoryBreakdown, priceTrail }: AnalyticsPanelProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr_1fr]">
      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle>Price momentum</CardTitle>
          <CardDescription>Short-term pricing movement from the currently loaded slice.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Average price</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(averagePrice)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Peak price</p>
                <p className="mt-2 text-xl font-semibold text-cyan-200">{formatCurrency(maxPrice)}</p>
              </div>
            </div>
            <Sparkline values={priceTrail} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle>Category mix</CardTitle>
          <CardDescription>Loaded rows grouped into the primary catalog categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <DonutChart items={categoryBreakdown} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle>Stream health</CardTitle>
          <CardDescription>Current local view of the live inventory stream.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/45 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Loaded products</span>
              <span className="text-lg font-semibold text-white">{formatCompactNumber(totalLoaded)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Coverage</span>
              <span className="text-lg font-semibold text-emerald-100">Cursor paging</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-slate-400">Freshness</p>
                <p className="mt-1 font-semibold text-white">Real-time</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-slate-400">Scope</p>
                <p className="mt-1 font-semibold text-white">200k+ rows</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}