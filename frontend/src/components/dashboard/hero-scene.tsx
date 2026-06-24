import { Canvas } from '@react-three/fiber';
import { Environment, Float, Sparkles } from '@react-three/drei';

function HeroGeometry() {
  return (
    <group>
      <Float speed={1.2} rotationIntensity={1.1} floatIntensity={1.4}>
        <mesh position={[-1.15, 0.1, 0]} rotation={[0.4, 0.2, 0.1]}>
          <torusKnotGeometry args={[0.95, 0.28, 220, 28]} />
          <meshStandardMaterial
            color="#67e8f9"
            roughness={0.12}
            metalness={0.82}
            emissive="#164e63"
            emissiveIntensity={0.28}
          />
        </mesh>

        <mesh position={[1.3, -0.7, -0.7]} rotation={[0.9, 0.5, 0.2]}>
          <icosahedronGeometry args={[0.88, 2]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.22} metalness={0.7} />
        </mesh>

        <mesh position={[0.8, 1, -1.2]} rotation={[0.2, -0.2, 0.4]}>
          <dodecahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial color="#22c55e" roughness={0.28} metalness={0.55} />
        </mesh>
      </Float>

      <Sparkles count={120} scale={6} size={2.1} speed={0.35} color="#9be7ff" />
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0a1425] via-[#09111f] to-[#060c17] shadow-glass">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(96,165,250,0.2),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.14),transparent_24%)]" />
      <div className="absolute inset-0 animate-sheen bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-30" />
      <Canvas camera={{ position: [0, 0, 6.8], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 6]} intensity={1.7} color="#d9f9ff" />
        <directionalLight position={[-4, -2, 4]} intensity={1.1} color="#4f46e5" />
        <HeroGeometry />
        <Environment preset="night" />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-3xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Live catalog</p>
            <p className="mt-2 font-display text-2xl text-white">Cursor-safe browsing at scale.</p>
          </div>
          <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-100 sm:block">
            200k+ rows streaming
          </div>
        </div>
      </div>
    </div>
  );
}