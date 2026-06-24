import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TrendPoint = {
  label: string;
  value: number;
};

function buildPath(points: TrendPoint[]) {
  if (points.length === 0) {
    return '';
  }

  const max = Math.max(...points.map((point) => point.value), 1);
  const min = Math.min(...points.map((point) => point.value), 0);
  const width = 540;
  const height = 180;
  const gap = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = index * gap;
      const normalized = (point.value - min) / (max - min || 1);
      const y = height - normalized * (height - 24) - 12;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export function TrendChart({ points }: { points: TrendPoint[] }) {
  const path = buildPath(points);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live momentum</CardTitle>
        <CardDescription>Recent loaded product values rendered as a smooth mini-trend.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4">
          <svg viewBox="0 0 540 180" className="h-48 w-full">
            <defs>
              <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,211,238,0.55)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0.02)" />
              </linearGradient>
              <linearGradient id="trendStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#5eead4" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            {path ? (
              <>
                <path d={`${path} L 540 180 L 0 180 Z`} fill="url(#trendFill)" />
                <path d={path} fill="none" stroke="url(#trendStroke)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </>
            ) : null}
          </svg>
          <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
            <span>Newest</span>
            <span>Loaded catalog</span>
            <span>Oldest</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
