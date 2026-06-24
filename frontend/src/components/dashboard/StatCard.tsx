import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  tone?: 'accent' | 'success' | 'warning' | 'default';
  detail?: string;
};

export function StatCard({ label, value, delta, tone = 'default', detail }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
              <h4 className="mt-2 font-display text-3xl tracking-tight text-white">{value}</h4>
            </div>
            {delta ? <Badge variant={tone}>{delta}</Badge> : null}
          </div>
          {detail ? <p className="text-sm leading-6 text-slate-400">{detail}</p> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
