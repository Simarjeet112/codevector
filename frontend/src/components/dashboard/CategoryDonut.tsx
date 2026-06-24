import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Slice = {
  label: string;
  value: number;
  color: string;
};

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

export function CategoryDonut({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((accumulator, slice) => accumulator + slice.value, 0);
  let currentAngle = 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Category mix</CardTitle>
        <CardDescription>Current breakdown of loaded rows by category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="relative mx-auto aspect-square w-full max-w-[220px]">
            <svg viewBox="0 0 220 220" className="h-full w-full drop-shadow-[0_18px_44px_rgba(8,15,26,0.44)]">
              <circle cx="110" cy="110" r="84" fill="rgba(255,255,255,0.04)" />
              {slices.map((slice) => {
                const sliceAngle = total === 0 ? 0 : (slice.value / total) * 360;
                const path = describeArc(110, 110, 84, currentAngle + 0.75, currentAngle + sliceAngle - 0.75);
                currentAngle += sliceAngle;
                return <path key={slice.label} d={path} fill="none" stroke={slice.color} strokeWidth="24" strokeLinecap="round" />;
              })}
              <circle cx="110" cy="110" r="58" fill="#07111c" stroke="rgba(255,255,255,0.08)" />
              <text x="110" y="102" textAnchor="middle" className="fill-white text-[18px] font-bold">
                {total.toLocaleString()}
              </text>
              <text x="110" y="124" textAnchor="middle" className="fill-slate-400 text-[9px] uppercase tracking-[0.3em]">
                loaded rows
              </text>
            </svg>
          </div>

          <div className="space-y-3">
            {slices.map((slice) => (
              <div key={slice.label} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: slice.color }} />
                    <span className="text-sm font-medium text-white">{slice.label}</span>
                  </div>
                  <span className="text-sm text-slate-300">{slice.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
