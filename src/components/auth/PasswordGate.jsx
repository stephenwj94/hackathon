import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════
// FUTURISTIC PASSWORD GATE — Scanner-Reactive Background
// ═══════════════════════════════════════════════════════

const SCAN_DUR = 4;   // seconds for scanner to sweep top→bottom
const SCAN_PAUSE = 2;  // seconds pause between sweeps
const CYCLE = SCAN_DUR + SCAN_PAUSE;

// Deterministic pseudo-random for stable layouts across renders
function prng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ─── CSS KEYFRAMES ──────────────────────────────────────
const keyframes = `
@keyframes nodeGlow {
  0% { opacity: 0.04; transform: scale(1); }
  5% { opacity: 1; transform: scale(3); box-shadow: 0 0 10px 3px rgba(245,98,15,0.8); }
  18% { opacity: 0.25; transform: scale(1.4); box-shadow: 0 0 4px 1px rgba(245,98,15,0.2); }
  35%, 100% { opacity: 0.04; transform: scale(1); box-shadow: none; }
}
@keyframes lineGlow {
  0% { opacity: 0.02; }
  5% { opacity: 0.5; stroke: #F5620F; filter: drop-shadow(0 0 4px rgba(245,98,15,0.6)); }
  22% { opacity: 0.08; filter: none; }
  35%, 100% { opacity: 0.02; filter: none; }
}
@keyframes dataRain {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes revealWipe {
  0% { clip-path: inset(0 0 102% 0); }
  ${((SCAN_DUR / CYCLE) * 100).toFixed(1)}% { clip-path: inset(0 0 -5% 0); }
  ${(((SCAN_DUR + 1) / CYCLE) * 100).toFixed(1)}% { clip-path: inset(0 0 -5% 0); }
  100% { clip-path: inset(0 0 102% 0); }
}
@keyframes glitchFlicker {
  0%, 88%, 100% { transform: translate(0); filter: none; clip-path: inset(0); }
  89% { transform: translate(-4px, 2px) skewX(-3deg); filter: hue-rotate(90deg) saturate(3); clip-path: inset(8% 0 75% 0); }
  91% { transform: translate(5px, -2px) skewX(2deg); filter: hue-rotate(-60deg) brightness(1.5); clip-path: inset(35% 0 40% 0); }
  93% { transform: translate(-3px, 0) skewX(-1deg); filter: hue-rotate(45deg); clip-path: inset(65% 0 15% 0); }
  95% { transform: translate(2px, 1px); filter: brightness(2); clip-path: inset(0); }
  96% { transform: translate(0); filter: none; clip-path: inset(0); }
}
@keyframes pulseRing {
  0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
}
@keyframes techReveal {
  0% { opacity: 0; transform: translateX(-8px); }
  8% { opacity: 0.6; transform: translateX(0); }
  75% { opacity: 0.5; }
  100% { opacity: 0; }
}
@keyframes rotateShape {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes breathe {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.09; }
}
@keyframes traceElectricity {
  0% { stroke-dashoffset: 20; opacity: 0.08; }
  50% { stroke-dashoffset: 0; opacity: 0.4; }
  100% { stroke-dashoffset: -20; opacity: 0.08; }
}
@keyframes hexPulse {
  0%, 100% { opacity: 0.02; stroke: rgba(245,98,15,0.08); }
  50% { opacity: 0.15; stroke: rgba(245,98,15,0.3); }
}
`;

// ─── NODE GRID — dots + connection lines that light up with scanner ──
function NodeGrid() {
  const { nodes, edges } = useMemo(() => {
    const rng = prng(42);
    const cols = 14, rows = 10;
    const ns = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ns.push({
          x: (c / (cols - 1)) * 100 + (rng() - 0.5) * 3,
          y: (r / (rows - 1)) * 100 + (rng() - 0.5) * 2,
          delay: (r / (rows - 1)) * SCAN_DUR,
          size: 1.5 + rng() * 1.5,
        });
      }
    }
    const es = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (c < cols - 1 && rng() > 0.35) es.push({ a: idx, b: idx + 1, delay: ns[idx].delay });
        if (r < rows - 1 && rng() > 0.55) es.push({ a: idx, b: idx + cols, delay: ns[idx].delay });
        // Occasional diagonal
        if (c < cols - 1 && r < rows - 1 && rng() > 0.85) es.push({ a: idx, b: idx + cols + 1, delay: ns[idx].delay });
      }
    }
    return { nodes: ns, edges: es };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {edges.map((e, i) => (
          <line key={i}
            x1={`${nodes[e.a].x}%`} y1={`${nodes[e.a].y}%`}
            x2={`${nodes[e.b].x}%`} y2={`${nodes[e.b].y}%`}
            stroke="rgba(245,98,15,0.06)" strokeWidth="0.5"
            style={{ animation: `lineGlow ${CYCLE}s ease-out infinite`, animationDelay: `${e.delay}s` }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <div key={i} className="absolute rounded-full bg-permira-orange"
          style={{
            left: `${n.x}%`, top: `${n.y}%`, width: n.size, height: n.size,
            opacity: 0.04, animation: `nodeGlow ${CYCLE}s ease-out infinite`, animationDelay: `${n.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── CIRCUIT TRACES — right-angle PCB-like paths ────────────────────
function CircuitTraces() {
  const paths = useMemo(() => {
    const rng = prng(77);
    return Array.from({ length: 10 }, () => {
      let x = rng() * 100, y = rng() * 100;
      let d = `M ${x} ${y}`;
      for (let j = 0; j < 4 + Math.floor(rng() * 4); j++) {
        const horiz = rng() > 0.5;
        const dist = 4 + rng() * 18;
        if (horiz) x = Math.max(0, Math.min(100, x + (rng() > 0.5 ? dist : -dist)));
        else y = Math.max(0, Math.min(100, y + (rng() > 0.5 ? dist : -dist)));
        d += ` L ${x} ${y}`;
      }
      return { d, delay: (y / 100) * SCAN_DUR, endX: x, endY: y };
    });
  }, []);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="rgba(245,98,15,0.06)" strokeWidth="0.4"
            strokeDasharray="2 1.5" strokeLinecap="round"
            style={{ animation: `lineGlow ${CYCLE}s ease-out infinite`, animationDelay: `${p.delay}s` }}
          />
          <circle cx={p.endX} cy={p.endY} r="0.6" fill="rgba(245,98,15,0.12)"
            style={{ animation: `nodeGlow ${CYCLE}s ease-out infinite`, animationDelay: `${p.delay + 0.3}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

// ─── DATA RAIN — Matrix-style falling hex columns ───────────────────
function DataRain() {
  const columns = useMemo(() => {
    const rng = prng(99);
    const hex = '0123456789ABCDEF₀₁₂₃⟨⟩⌐░▒'.split('');
    return Array.from({ length: 12 }, () => ({
      x: rng() * 100,
      speed: 10 + rng() * 15,
      delay: rng() * 8,
      opacity: 0.03 + rng() * 0.06,
      text: Array.from({ length: 40 }, () => hex[Math.floor(rng() * hex.length)]).join('\n'),
      size: 7 + rng() * 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {columns.map((c, i) => (
        <div key={i} className="absolute font-mono text-permira-orange whitespace-pre leading-tight"
          style={{
            left: `${c.x}%`, fontSize: c.size, opacity: c.opacity,
            animation: `dataRain ${c.speed}s linear ${c.delay}s infinite`,
          }}
        >{c.text}</div>
      ))}
    </div>
  );
}

// ─── REVEALED LAYER — warm glow that follows scanner via clip-path ──
function RevealedLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ animation: `revealWipe ${CYCLE}s linear infinite` }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(245,98,15,0.06) 0%, rgba(245,98,15,0.02) 35%, transparent 65%)',
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(245,98,15,0.2) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(245,98,15,0.035) 3px, rgba(245,98,15,0.035) 4px)',
      }} />
    </div>
  );
}

// ─── WIREFRAME HEXAGONS — rotating geometric shapes ─────────────────
function WireframeHex() {
  const rings = [0.45, 0.7, 1.0];
  return (
    <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ animation: 'breathe 10s ease-in-out infinite' }}>
      <div style={{ animation: 'rotateShape 50s linear infinite' }}>
        <svg width="500" height="500" viewBox="-250 -250 500 500" className="opacity-[0.06]">
          {rings.map((scale, ri) => {
            const r = 200 * scale;
            const pts = Array.from({ length: 6 }, (_, i) => {
              const a = (i * 60 - 30) * Math.PI / 180;
              return `${r * Math.cos(a)},${r * Math.sin(a)}`;
            }).join(' ');
            return <polygon key={ri} points={pts} fill="none" stroke="#F5620F" strokeWidth="0.6"
              style={{ animation: `hexPulse ${4 + ri * 2}s ease-in-out ${ri * 0.5}s infinite` }} />;
          })}
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * 60 - 30) * Math.PI / 180;
            return <line key={i} x1={200 * 0.45 * Math.cos(a)} y1={200 * 0.45 * Math.sin(a)}
              x2={200 * Math.cos(a)} y2={200 * Math.sin(a)} stroke="#F5620F" strokeWidth="0.3" />;
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── SECOND WIREFRAME — counter-rotating triangle ───────────────────
function WireframeTriangle() {
  return (
    <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ animation: 'breathe 12s ease-in-out 3s infinite' }}>
      <div style={{ animation: 'rotateShape 70s linear reverse infinite' }}>
        <svg width="600" height="600" viewBox="-300 -300 600 600" className="opacity-[0.04]">
          {[0.5, 0.75, 1.0].map((scale, i) => {
            const r = 250 * scale;
            const pts = Array.from({ length: 3 }, (_, j) => {
              const a = (j * 120 - 90) * Math.PI / 180;
              return `${r * Math.cos(a)},${r * Math.sin(a)}`;
            }).join(' ');
            return <polygon key={i} points={pts} fill="none" stroke="#F5620F" strokeWidth="0.4" />;
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── PULSE RINGS — sonar/radar from center ──────────────────────────
function PulseRings() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[0, 2.5, 5].map(d => (
        <div key={d} className="absolute left-1/2 top-1/2 w-[180px] h-[180px] rounded-full border border-permira-orange/25"
          style={{ animation: `pulseRing 7s ease-out ${d}s infinite` }} />
      ))}
    </div>
  );
}

// ─── TECH READOUTS — edge system text ───────────────────────────────
function TechReadouts() {
  const lines = useMemo(() => {
    const rng = prng(55);
    const texts = [
      'SYS.AUTH.INIT ▸ OK', 'PROTO://SEC.4096-BIT', 'MESH_NODES: 216 ACTIVE',
      'ENCRYPT: AES-256-GCM', 'SCAN: BIOMETRIC ACTIVE', 'PORT: 8443/TLS1.3',
      'HASH: SHA-512', 'LATENCY: 3ms', 'CLUSTER: PERMIRA-EU-1',
      'MEM_ALLOC: 512GB', 'NET: 10Gbps FIBER', 'UPTIME: 99.997%',
      'DB: REPLICATED ×3', 'AUTH_LEVEL: RESTRICTED', 'FIREWALL: ENGAGED',
      'CERT: VALID 2026-12', 'REGION: EU-WEST', 'AUDIT: LOGGING',
    ];
    return texts.map((text, i) => ({
      text,
      left: rng() > 0.5,
      y: 3 + (i / texts.length) * 90,
      delay: 1.5 + rng() * 10,
      duration: 6 + rng() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {lines.map((l, i) => (
        <div key={i} className="absolute font-mono text-permira-orange/30"
          style={{
            [l.left ? 'left' : 'right']: '2%',
            top: `${l.y}%`, fontSize: 8, letterSpacing: '0.06em',
            animation: `techReveal ${l.duration}s ease-out ${l.delay}s infinite`,
          }}
        >{l.text}</div>
      ))}
    </div>
  );
}

// ─── CROSSHAIR — faint rotating tick ring ───────────────────────────
function Crosshair() {
  return (
    <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ animation: 'rotateShape 90s linear infinite' }}>
      <svg width="340" height="340" viewBox="-170 -170 340 340" className="opacity-[0.06]">
        <circle cx="0" cy="0" r="160" fill="none" stroke="#F5620F" strokeWidth="0.4" />
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5) * Math.PI / 180;
          const inner = i % 18 === 0 ? 145 : i % 6 === 0 ? 152 : 156;
          return <line key={i} x1={inner * Math.cos(a)} y1={inner * Math.sin(a)}
            x2={160 * Math.cos(a)} y2={160 * Math.sin(a)} stroke="#F5620F" strokeWidth="0.4" />;
        })}
        {/* Cardinal crosshair lines */}
        {[0, 90, 180, 270].map(deg => {
          const a = deg * Math.PI / 180;
          return <line key={deg} x1={130 * Math.cos(a)} y1={130 * Math.sin(a)}
            x2={140 * Math.cos(a)} y2={140 * Math.sin(a)} stroke="#F5620F" strokeWidth="0.8" />;
        })}
      </svg>
    </div>
  );
}

// ─── ENHANCED SCANNER — beam + trailing glow ────────────────────────
function EnhancedScanner() {
  return (
    <>
      {/* Wide trailing glow */}
      <motion.div className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 150,
          background: 'linear-gradient(to top, transparent 0%, rgba(245,98,15,0.03) 20%, rgba(245,98,15,0.07) 100%)',
        }}
        initial={{ top: '-20%' }} animate={{ top: '105%' }}
        transition={{ duration: SCAN_DUR, repeat: Infinity, ease: 'linear', repeatDelay: SCAN_PAUSE }}
      />
      {/* Bright beam */}
      <motion.div className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 3,
          background: 'linear-gradient(90deg, transparent 0%, rgba(245,98,15,0.5) 10%, rgba(245,98,15,1) 50%, rgba(245,98,15,0.5) 90%, transparent 100%)',
          boxShadow: '0 0 40px 15px rgba(245,98,15,0.2), 0 0 80px 30px rgba(245,98,15,0.08), 0 -5px 15px 5px rgba(245,98,15,0.1)',
        }}
        initial={{ top: '-5%' }} animate={{ top: '105%' }}
        transition={{ duration: SCAN_DUR, repeat: Infinity, ease: 'linear', repeatDelay: SCAN_PAUSE }}
      />
      {/* Narrow bright trail */}
      <motion.div className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 30,
          background: 'linear-gradient(to top, transparent 0%, rgba(245,98,15,0.12) 100%)',
        }}
        initial={{ top: '-8%' }} animate={{ top: '105%' }}
        transition={{ duration: SCAN_DUR, repeat: Infinity, ease: 'linear', repeatDelay: SCAN_PAUSE }}
      />
    </>
  );
}

// ─── FLOATING PARTICLES ─────────────────────────────────────────────
function FloatingParticles() {
  const particles = useMemo(() => {
    const rng = prng(33);
    return Array.from({ length: 14 }, () => ({
      x: 8 + rng() * 84, y: 30 + rng() * 60,
      size: 2 + rng() * 5, dur: 7 + rng() * 10, delay: rng() * 8,
      square: rng() > 0.5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div key={i}
          className={`absolute ${p.square ? '' : 'rounded-full'}`}
          style={{ width: p.size, height: p.size, backgroundColor: 'rgba(245,98,15,0.1)', left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -80, -180, -300, -420],
            x: [0, 15, -10, 20, -5],
            opacity: [0, 0.35, 0.25, 0.1, 0],
            rotate: p.square ? [0, 90, 180, 270, 360] : [0, 0, 0, 0, 0],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ─── CORNER BRACKETS ────────────────────────────────────────────────
function CornerBrackets() {
  const b = 'absolute w-10 h-10 border-permira-orange/30';
  return (
    <>
      <motion.div className={`${b} top-4 left-4 border-t-2 border-l-2`}
        initial={{ opacity: 0, x: -20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }} />
      <motion.div className={`${b} top-4 right-4 border-t-2 border-r-2`}
        initial={{ opacity: 0, x: 20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.9, duration: 0.6 }} />
      <motion.div className={`${b} bottom-4 left-4 border-b-2 border-l-2`}
        initial={{ opacity: 0, x: -20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }} />
      <motion.div className={`${b} bottom-4 right-4 border-b-2 border-r-2`}
        initial={{ opacity: 0, x: 20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.1, duration: 0.6 }} />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function PasswordGate({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
      setAccessGranted(true);
      setTimeout(() => {}, 1200);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#060a14] flex items-center justify-center z-50 overflow-hidden"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <style>{keyframes}</style>

      {/* ═══ BACKGROUND LAYERS (bottom → top) ═══ */}

      {/* 1. Base dim dot grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(245,98,15,0.035) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      {/* 2. Scanline texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
      }} />

      {/* 3. Revealed warm layer — follows scanner */}
      <RevealedLayer />

      {/* 4. Wireframe shapes */}
      <WireframeHex />
      <WireframeTriangle />

      {/* 5. Circuit board traces */}
      <CircuitTraces />

      {/* 6. Node grid + connections */}
      <NodeGrid />

      {/* 7. Data rain */}
      <DataRain />

      {/* 8. Radar pulse rings */}
      <PulseRings />

      {/* 9. Crosshair */}
      <Crosshair />

      {/* 10. Tech readouts */}
      <TechReadouts />

      {/* 11. Floating particles */}
      <FloatingParticles />

      {/* 12. Corner brackets */}
      <CornerBrackets />

      {/* 13. Scanner beam (on top of background) */}
      <EnhancedScanner />

      {/* Radial glow behind card */}
      <motion.div className="absolute pointer-events-none"
        style={{ width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(245,98,15,0.1) 0%, rgba(13,31,60,0.06) 35%, transparent 65%)',
        }}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.5, ease: 'easeOut' }}
      />

      {/* Orbiting ring */}
      <motion.div
        className="absolute w-[520px] h-[520px] rounded-full border border-permira-orange/10 pointer-events-none"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 360 }}
        transition={{
          scale: { delay: 0.5, duration: 1, ease: 'easeOut' },
          opacity: { delay: 0.5, duration: 1 },
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
        }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-permira-orange/50 shadow-[0_0_16px_rgba(245,98,15,0.5)]" />
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-permira-orange/25" />
      </motion.div>

      {/* Second orbiting ring (counter) */}
      <motion.div
        className="absolute w-[440px] h-[440px] rounded-full border border-permira-orange/[0.06] pointer-events-none"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: -360 }}
        transition={{
          scale: { delay: 0.7, duration: 1, ease: 'easeOut' },
          opacity: { delay: 0.7, duration: 1 },
          rotate: { duration: 45, repeat: Infinity, ease: 'linear' },
        }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-permira-orange/30" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-permira-orange/20" />
      </motion.div>

      {/* ═══ ACCESS GRANTED OVERLAY ═══ */}
      <AnimatePresence>
        {accessGranted && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Full screen flash */}
            <motion.div className="absolute inset-0 bg-green-500/10"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.6 }}
            />
            <motion.div className="absolute inset-0 bg-permira-dark/80" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center relative"
            >
              <div className="text-5xl font-bold font-mono tracking-[0.3em] text-green-400"
                style={{ textShadow: '0 0 40px rgba(74,222,128,0.7), 0 0 80px rgba(74,222,128,0.3), 0 0 120px rgba(74,222,128,0.15)' }}
              >ACCESS GRANTED</div>
              <motion.div className="h-0.5 bg-green-400 mt-4 mx-auto"
                initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ boxShadow: '0 0 15px rgba(74,222,128,0.6)' }}
              />
              <motion.p className="text-green-400/60 text-xs font-mono mt-3 tracking-widest uppercase"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              >Initializing dashboard...</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CARD ═══ */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* Flame icon */}
        <motion.div className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -120, scale: 0.3, rotate: -20 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.9, type: 'spring', damping: 12, stiffness: 100 }}
        >
          <div className="relative">
            <motion.div className="absolute inset-0 blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(245,98,15,0.5) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="relative">
              <motion.path d="M36 6 L44 26 L36 20 L28 26 Z" fill="#F5620F"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
              <motion.path d="M36 2 L46 28 L36 21 L26 28 Z" fill="#F5620F" opacity="0.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.0, duration: 0.6 }} />
              <motion.path d="M36 10 L41 24 L36 20 L31 24 Z" fill="#FF8844" opacity="0.7"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.4 }} />
            </svg>
          </div>
        </motion.div>

        {/* "PERMIRA" with glitch effect */}
        <motion.div className="relative"
          initial={{ opacity: 0, x: -200, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.7, duration: 0.8, type: 'spring', damping: 15 }}
        >
          <h1 className="text-center text-4xl font-bold tracking-[0.2em] text-white mb-1"
            style={{
              textShadow: '0 0 20px rgba(245,98,15,0.4), 0 0 60px rgba(245,98,15,0.15)',
              animation: 'glitchFlicker 8s ease-in-out infinite',
            }}
          >PERMIRA</h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p className="text-center text-sm tracking-[0.25em] text-permira-orange/80 mb-4 uppercase"
          initial={{ opacity: 0, x: 200, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.9, duration: 0.8, type: 'spring', damping: 15 }}
        >Portfolio Intelligence</motion.p>

        {/* SECURE ACCESS PORTAL */}
        <motion.div className="flex justify-center mb-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }}
        >
          <motion.span className="text-[11px] uppercase font-mono text-permira-orange font-medium"
            initial={{ letterSpacing: '0.05em' }} animate={{ letterSpacing: '0.3em' }}
            transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
          >Secure Access Portal</motion.span>
        </motion.div>

        {/* Divider */}
        <motion.div className="flex items-center gap-3 mb-8 px-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div className="flex-1 h-px bg-gradient-to-r from-transparent to-permira-orange/40"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }} style={{ transformOrigin: 'right' }} />
          <motion.div className="w-2 h-2 rotate-45 border border-permira-orange/40"
            initial={{ scale: 0 }} animate={{ scale: 1, rotate: 45 }}
            transition={{ delay: 1.4, duration: 0.4, type: 'spring' }} />
          <motion.div className="flex-1 h-px bg-gradient-to-l from-transparent to-permira-orange/40"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }} style={{ transformOrigin: 'left' }} />
        </motion.div>

        {/* Card */}
        <motion.div className="relative"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, type: 'spring', damping: 14 }}
        >
          {/* Card border glow */}
          <motion.div className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(245,98,15,0.25) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.12) 100%)' }}
            animate={{
              background: [
                'linear-gradient(135deg, rgba(245,98,15,0.25) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.12) 100%)',
                'linear-gradient(225deg, rgba(245,98,15,0.25) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.12) 100%)',
                'linear-gradient(315deg, rgba(245,98,15,0.25) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.12) 100%)',
                'linear-gradient(45deg, rgba(245,98,15,0.25) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.12) 100%)',
                'linear-gradient(135deg, rgba(245,98,15,0.25) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.12) 100%)',
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative bg-permira-card/90 backdrop-blur-xl border border-permira-border/50 rounded-2xl overflow-hidden">
            <motion.div className="stripe-motif h-1.5"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }} style={{ transformOrigin: 'left' }} />

            <div className="p-8 pt-6">
              {/* Security badge */}
              <motion.div className="flex justify-center mb-5"
                initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-permira-orange/10 border border-permira-orange/20">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-permira-orange"
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-permira-orange font-medium">Secure Access</span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit}>
                <motion.label className="block text-xs uppercase tracking-[0.1em] text-permira-text-secondary mb-2"
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >Enter Password</motion.label>

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.6, type: 'spring', damping: 14 }}
                >
                  <motion.div animate={error ? { x: [0, -12, 12, -12, 12, -6, 6, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <input type="password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-permira-dark/80 border rounded-xl text-permira-text font-mono text-lg focus:outline-none focus:ring-2 transition-all caret-permira-orange ${
                        error
                          ? 'border-permira-danger focus:ring-permira-danger shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                          : 'border-permira-border/50 focus:ring-permira-orange/50 focus:border-permira-orange/50 shadow-[0_0_20px_rgba(245,98,15,0.05)]'
                      }`}
                      placeholder="••••••••••" autoFocus style={{ caretColor: '#F5620F' }}
                    />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -5, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -5, height: 0 }}
                      className="text-permira-danger text-sm mt-2 flex items-center gap-1.5"
                    >
                      <span className="inline-block w-1 h-1 rounded-full bg-permira-danger" />
                      Access denied. Try again.
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.6, type: 'spring', damping: 14 }}
                >
                  <button type="submit" disabled={accessGranted}
                    className="relative w-full mt-5 py-3.5 bg-gradient-to-r from-permira-orange to-[#E04D00] hover:from-[#FF6E1A] hover:to-permira-orange text-white font-semibold rounded-xl transition-all duration-300 overflow-hidden group disabled:opacity-50"
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      initial={{ x: '-200%' }} animate={{ x: '200%' }}
                      transition={{ delay: 2.5, duration: 1.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                    />
                    <span className="relative tracking-wide">Access Dashboard</span>
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Bottom status */}
        <motion.div className="text-center mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-permira-text-secondary/40">
            <motion.div className="w-1 h-1 rounded-full bg-permira-success/60"
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
            System Online <span className="mx-1">·</span> Encrypted Connection <span className="mx-1">·</span> v2.4.1
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
