import { Canvas } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, OrbitControls, Stars } from '@react-three/drei';

function Core() {
  return (
    <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.8}>
      <mesh>
        <icosahedronGeometry args={[1.65, 2]} />
        <MeshDistortMaterial
          color="#5fd4ff"
          attach="material"
          distort={0.28}
          speed={1.8}
          roughness={0.18}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

function Ring({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <Float speed={2.2} rotationIntensity={2.4} floatIntensity={1.1}>
      <mesh position={position} scale={scale} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.16, 24, 80]} />
        <meshStandardMaterial color="#a5f3fc" emissive="#0ea5e9" emissiveIntensity={0.6} roughness={0.24} metalness={0.88} />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0b1320] via-[#091520] to-[#03111d] shadow-glass lg:h-[460px]">
      <div className="absolute inset-0 bg-aurora opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
      <Canvas camera={{ position: [0, 0, 7.2], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 6]} intensity={2.4} color="#7dd3fc" />
        <directionalLight position={[-5, -2, 4]} intensity={1.2} color="#38bdf8" />
        <Core />
        <Ring position={[-2.7, -1.25, -0.8]} scale={0.75} />
        <Ring position={[2.4, 1.35, -1.5]} scale={0.56} />
        <Ring position={[0.9, -2.0, -1.25]} scale={0.42} />
        <Stars radius={12} depth={40} count={1200} factor={3.2} saturation={0.2} fade speed={0.6} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.55} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_18%,transparent_74%,rgba(5,10,18,0.7))]" />
    </div>
  );
}
