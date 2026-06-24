import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroScene } from './HeroScene';

export function HeroSection() {
  return (
    <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur">
          <Sparkles className="h-4 w-4" />
          Cursor-paginated catalog at startup polish
        </div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl font-display text-5xl leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            A premium product command center for teams that ship fast.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
            className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            Explore 200k+ products with infinite scrolling, category filters, search, live analytics, and a deep glassmorphism interface built for a YC-style SaaS brand.
          </motion.p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button className="group" onClick={() => window.scrollTo({ top: 920, behavior: 'smooth' })}>
            Open catalog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Badge variant="accent">React + Vite + TypeScript</Badge>
          <Badge variant="default">Three.js + Framer Motion</Badge>
          <Badge variant="success">Cursor API ready</Badge>
        </div>
      </div>

      <HeroScene />
    </section>
  );
}
