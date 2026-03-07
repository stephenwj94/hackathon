import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════
// WAR ROOM — Password Gate with Robot SVG & Cyan Scanner
// ═══════════════════════════════════════════════════════

const SCAN_DUR = 3;
const SCAN_PAUSE = 1.5;
const CYCLE = SCAN_DUR + SCAN_PAUSE;

function prng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ─── CSS KEYFRAMES ──────────────────────────────────────
const keyframes = `
@keyframes nodeGlow {
  0% { opacity: 0.04; transform: scale(1); }
  5% { opacity: 1; transform: scale(3); box-shadow: 0 0 10px 3px rgba(0,212,255,0.8); }
  18% { opacity: 0.25; transform: scale(1.4); box-shadow: 0 0 4px 1px rgba(0,212,255,0.2); }
  35%, 100% { opacity: 0.04; transform: scale(1); box-shadow: none; }
}
@keyframes lineGlow {
  0% { opacity: 0.02; }
  5% { opacity: 0.5; stroke: #00d4ff; filter: drop-shadow(0 0 4px rgba(0,212,255,0.6)); }
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
@keyframes hexPulse {
  0%, 100% { opacity: 0.02; stroke: rgba(0,212,255,0.08); }
  50% { opacity: 0.15; stroke: rgba(0,212,255,0.3); }
}
@keyframes robotVisorPulse {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(0,212,255,0.4)); }
  50% { filter: drop-shadow(0 0 20px rgba(0,212,255,0.8)); }
}
`;

// ─── HEXAGONAL GRID BACKGROUND ──────────────────────
function HexGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.05 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexPattern" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
            <path d="M28 2 L50 18 L50 50 L28 66 L6 50 L6 18 Z" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" />
            <path d="M28 34 L50 50 L50 82 L28 98 L6 82 L6 50 Z" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
    </div>
  );
}

// ─── NODE GRID ──────────────────────────────────────
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
            stroke="rgba(0,212,255,0.06)" strokeWidth="0.5"
            style={{ animation: `lineGlow ${CYCLE}s ease-out infinite`, animationDelay: `${e.delay}s` }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            backgroundColor: 'rgba(0,212,255,0.6)',
            left: `${n.x}%`, top: `${n.y}%`, width: n.size, height: n.size,
            opacity: 0.04, animation: `nodeGlow ${CYCLE}s ease-out infinite`, animationDelay: `${n.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── DATA RAIN ──────────────────────────────────────
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
        <div key={i} className="absolute font-mono whitespace-pre leading-tight"
          style={{
            left: `${c.x}%`, fontSize: c.size, opacity: c.opacity,
            color: 'rgba(0,212,255,0.6)',
            animation: `dataRain ${c.speed}s linear ${c.delay}s infinite`,
          }}
        >{c.text}</div>
      ))}
    </div>
  );
}

// ─── REVEALED LAYER ─────────────────────────────────
function RevealedLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ animation: `revealWipe ${CYCLE}s linear infinite` }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.06) 0%, rgba(0,212,255,0.02) 35%, transparent 65%)',
      }} />
    </div>
  );
}

// ─── ROBOT SVG ──────────────────────────────────────
function RobotSVG() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 2 }}>
      <svg width="320" height="480" viewBox="0 0 320 480" fill="none" style={{ maxHeight: '60vh' }}>
        {/* Head */}
        <rect x="110" y="30" width="100" height="80" rx="16" fill="#1a1a2e" stroke="#2d3561" strokeWidth="2" />
        {/* Visor */}
        <rect x="125" y="52" width="70" height="20" rx="8" fill="#00d4ff" opacity="0.7"
          style={{ animation: 'robotVisorPulse 3s ease-in-out infinite' }} />
        <rect x="130" y="56" width="12" height="12" rx="3" fill="#0A0E1A" opacity="0.5" />
        <rect x="150" y="56" width="12" height="12" rx="3" fill="#0A0E1A" opacity="0.5" />
        <rect x="178" y="56" width="12" height="12" rx="3" fill="#0A0E1A" opacity="0.5" />
        {/* Antenna */}
        <line x1="160" y1="30" x2="160" y2="10" stroke="#2d3561" strokeWidth="2" />
        <circle cx="160" cy="8" r="4" fill="#F5620F" opacity="0.8" />
        {/* Neck */}
        <rect x="145" y="110" width="30" height="20" rx="4" fill="#2d3561" />
        {/* Torso */}
        <path d="M90 130 L230 130 L240 280 L220 310 L100 310 L80 280 Z" fill="#1a1a2e" stroke="#2d3561" strokeWidth="2" />
        {/* Chest plate */}
        <rect x="120" y="150" width="80" height="60" rx="8" fill="#2d3561" opacity="0.5" />
        {/* Chest reactor */}
        <circle cx="160" cy="180" r="18" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5" />
        <circle cx="160" cy="180" r="10" fill="#00d4ff" opacity="0.15" />
        <circle cx="160" cy="180" r="5" fill="#F5620F" opacity="0.6" />
        {/* Chest lines */}
        <line x1="120" y1="220" x2="200" y2="220" stroke="#2d3561" strokeWidth="1" />
        <line x1="125" y1="235" x2="195" y2="235" stroke="#2d3561" strokeWidth="1" />
        <line x1="130" y1="250" x2="190" y2="250" stroke="#2d3561" strokeWidth="1" />
        {/* Shoulders */}
        <ellipse cx="75" cy="145" rx="25" ry="18" fill="#1a1a2e" stroke="#2d3561" strokeWidth="1.5" />
        <ellipse cx="245" cy="145" rx="25" ry="18" fill="#1a1a2e" stroke="#2d3561" strokeWidth="1.5" />
        {/* Shoulder accents */}
        <circle cx="75" cy="145" r="6" fill="#F5620F" opacity="0.3" />
        <circle cx="245" cy="145" r="6" fill="#F5620F" opacity="0.3" />
        {/* Arms */}
        <rect x="45" y="163" width="22" height="100" rx="10" fill="#1a1a2e" stroke="#2d3561" strokeWidth="1.5" />
        <rect x="253" y="163" width="22" height="100" rx="10" fill="#1a1a2e" stroke="#2d3561" strokeWidth="1.5" />
        {/* Forearms */}
        <rect x="48" y="270" width="18" height="70" rx="8" fill="#2d3561" opacity="0.6" />
        <rect x="256" y="270" width="18" height="70" rx="8" fill="#2d3561" opacity="0.6" />
        {/* Waist */}
        <rect x="105" y="310" width="110" height="25" rx="6" fill="#2d3561" />
        {/* Hips */}
        <path d="M100 335 L220 335 L230 370 L200 400 L120 400 L90 370 Z" fill="#1a1a2e" stroke="#2d3561" strokeWidth="1.5" />
        {/* Legs upper */}
        <rect x="115" y="400" width="30" height="50" rx="8" fill="#1a1a2e" stroke="#2d3561" strokeWidth="1" />
        <rect x="175" y="400" width="30" height="50" rx="8" fill="#1a1a2e" stroke="#2d3561" strokeWidth="1" />
        {/* Legs lower */}
        <rect x="118" y="450" width="25" height="30" rx="6" fill="#2d3561" opacity="0.6" />
        <rect x="178" y="450" width="25" height="30" rx="6" fill="#2d3561" opacity="0.6" />
        {/* Glow effects on joints */}
        <circle cx="56" cy="263" r="4" fill="#00d4ff" opacity="0.3" />
        <circle cx="264" cy="263" r="4" fill="#00d4ff" opacity="0.3" />
        <circle cx="130" cy="400" r="3" fill="#F5620F" opacity="0.3" />
        <circle cx="190" cy="400" r="3" fill="#F5620F" opacity="0.3" />
      </svg>
    </div>
  );
}

// ─── SCANNER BEAM (CYAN) ────────────────────────────
function CyanScanner() {
  return (
    <>
      {/* Trailing glow */}
      <motion.div className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 80, zIndex: 3,
          background: 'linear-gradient(to top, transparent 0%, rgba(0,212,255,0.03) 20%, rgba(0,212,255,0.06) 100%)',
        }}
        initial={{ top: '-15%' }} animate={{ top: '105%' }}
        transition={{ duration: SCAN_DUR, repeat: Infinity, ease: 'linear', repeatDelay: SCAN_PAUSE }}
      />
      {/* Bright beam line */}
      <motion.div className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 2, zIndex: 3,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.5) 10%, rgba(0,212,255,0.8) 50%, rgba(0,212,255,0.5) 90%, transparent 100%)',
          boxShadow: '0 0 40px 15px rgba(0,212,255,0.15), 0 0 80px 30px rgba(0,212,255,0.06), 0 -5px 20px 5px rgba(0,212,255,0.08)',
        }}
        initial={{ top: '-5%' }} animate={{ top: '105%' }}
        transition={{ duration: SCAN_DUR, repeat: Infinity, ease: 'linear', repeatDelay: SCAN_PAUSE }}
      />
    </>
  );
}

// ─── FLOATING PARTICLES ─────────────────────────────
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
          style={{ width: p.size, height: p.size, backgroundColor: 'rgba(0,212,255,0.1)', left: `${p.x}%`, top: `${p.y}%` }}
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

// ─── CORNER BRACKETS ────────────────────────────────
function CornerBrackets() {
  const b = 'absolute w-10 h-10';
  return (
    <>
      <motion.div className={`${b} top-4 left-4 border-t-2 border-l-2`}
        style={{ borderColor: 'rgba(0,212,255,0.3)' }}
        initial={{ opacity: 0, x: -20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }} />
      <motion.div className={`${b} top-4 right-4 border-t-2 border-r-2`}
        style={{ borderColor: 'rgba(0,212,255,0.3)' }}
        initial={{ opacity: 0, x: 20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.9, duration: 0.6 }} />
      <motion.div className={`${b} bottom-4 left-4 border-b-2 border-l-2`}
        style={{ borderColor: 'rgba(0,212,255,0.3)' }}
        initial={{ opacity: 0, x: -20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }} />
      <motion.div className={`${b} bottom-4 right-4 border-b-2 border-r-2`}
        style={{ borderColor: 'rgba(0,212,255,0.3)' }}
        initial={{ opacity: 0, x: 20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.1, duration: 0.6 }} />
    </>
  );
}

// ─── TECH READOUTS ──────────────────────────────────
function TechReadouts() {
  const lines = useMemo(() => {
    const rng = prng(55);
    const texts = [
      'SYS.AUTH.INIT ▸ OK', 'PROTO://SEC.4096-BIT', 'MESH_NODES: 216 ACTIVE',
      'ENCRYPT: AES-256-GCM', 'SCAN: BIOMETRIC ACTIVE', 'PORT: 8443/TLS1.3',
      'HASH: SHA-512', 'LATENCY: 3ms', 'CLUSTER: WAR-ROOM-01',
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
        <div key={i} className="absolute font-mono"
          style={{
            color: 'rgba(0,212,255,0.3)',
            [l.left ? 'left' : 'right']: '2%',
            top: `${l.y}%`, fontSize: 8, letterSpacing: '0.06em',
            animation: `techReveal ${l.duration}s ease-out ${l.delay}s infinite`,
          }}
        >{l.text}</div>
      ))}
    </div>
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
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{ backgroundColor: '#0A0E1A' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <style>{keyframes}</style>

      {/* ═══ BACKGROUND LAYERS ═══ */}

      {/* 1. Hexagonal grid */}
      <HexGrid />

      {/* 2. Scanline texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
      }} />

      {/* 3. Revealed layer */}
      <RevealedLayer />

      {/* 4. Node grid */}
      <NodeGrid />

      {/* 5. Data rain */}
      <DataRain />

      {/* 6. Tech readouts */}
      <TechReadouts />

      {/* 7. Floating particles */}
      <FloatingParticles />

      {/* 8. Corner brackets */}
      <CornerBrackets />

      {/* 9. Robot SVG (z-index 2) */}
      <RobotSVG />

      {/* 10. Scanner beam (z-index 3) */}
      <CyanScanner />

      {/* ═══ ACCESS GRANTED OVERLAY ═══ */}
      <AnimatePresence>
        {accessGranted && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="absolute inset-0 bg-green-500/10"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.6 }}
            />
            <motion.div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,14,26,0.8)' }} />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center relative"
            >
              <div className="text-5xl font-bold font-mono tracking-[0.3em] text-green-400"
                style={{ textShadow: '0 0 40px rgba(74,222,128,0.7), 0 0 80px rgba(74,222,128,0.3)' }}
              >ACCESS GRANTED</div>
              <motion.div className="h-0.5 bg-green-400 mt-4 mx-auto"
                initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ boxShadow: '0 0 15px rgba(74,222,128,0.6)' }}
              />
              <motion.p className="text-green-400/60 text-xs font-mono mt-3 tracking-widest uppercase"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              >Initializing war room...</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CARD (z-index 10 — foreground) ═══ */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* "WAR ROOM" title */}
        <motion.div className="relative"
          initial={{ opacity: 0, y: -40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring', damping: 15 }}
        >
          <h1 className="text-center font-bold text-white mb-1"
            style={{
              fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(64px, 12vw, 120px)',
              letterSpacing: '0.05em',
              WebkitTextStroke: '1px #000',
              textShadow: '4px 4px 0px #000, 6px 6px 0px rgba(0,0,0,0.5), 0 0 40px rgba(245,98,15,0.6), 0 0 80px rgba(245,98,15,0.3)',
              animation: 'glitchFlicker 8s ease-in-out infinite',
              lineHeight: 1,
            }}
          >WAR ROOM</h1>
        </motion.div>

        {/* "PERMIRA PORTFOLIO INTELLIGENCE" subtitle */}
        <motion.p className="text-center uppercase mb-6"
          style={{
            fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
            fontWeight: 400,
            fontSize: '24px',
            letterSpacing: '0.15em',
            color: '#F5620F',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >Permira Portfolio Intelligence</motion.p>

        {/* Divider */}
        <motion.div className="flex items-center gap-3 mb-6 px-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.5 }}
        >
          <motion.div className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.4))' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }} />
          <motion.div className="w-2 h-2 rotate-45 border"
            style={{ borderColor: 'rgba(0,212,255,0.4)' }}
            initial={{ scale: 0 }} animate={{ scale: 1, rotate: 45 }}
            transition={{ delay: 1.2, duration: 0.4, type: 'spring' }} />
          <motion.div className="flex-1 h-px"
            style={{ background: 'linear-gradient(to left, transparent, rgba(0,212,255,0.4))' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }} />
        </motion.div>

        {/* Card */}
        <motion.div className="relative"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, type: 'spring', damping: 14 }}
        >
          {/* Card border glow */}
          <motion.div className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.25) 0%, transparent 40%, transparent 60%, rgba(0,212,255,0.12) 100%)' }}
            animate={{
              background: [
                'linear-gradient(135deg, rgba(0,212,255,0.25) 0%, transparent 40%, transparent 60%, rgba(0,212,255,0.12) 100%)',
                'linear-gradient(225deg, rgba(0,212,255,0.25) 0%, transparent 40%, transparent 60%, rgba(0,212,255,0.12) 100%)',
                'linear-gradient(315deg, rgba(0,212,255,0.25) 0%, transparent 40%, transparent 60%, rgba(0,212,255,0.12) 100%)',
                'linear-gradient(45deg, rgba(0,212,255,0.25) 0%, transparent 40%, transparent 60%, rgba(0,212,255,0.12) 100%)',
                'linear-gradient(135deg, rgba(0,212,255,0.25) 0%, transparent 40%, transparent 60%, rgba(0,212,255,0.12) 100%)',
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(10,14,26,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,212,255,0.3)',
            }}
          >
            {/* Top accent line */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #00d4ff, #F5620F, #00d4ff)' }} />

            <div className="p-8 pt-6">
              {/* SECURE ACCESS PORTAL label */}
              <motion.div className="flex justify-center mb-5"
                initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
                >
                  <motion.div className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#00d4ff' }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <span className="text-[10px] uppercase tracking-[0.15em] font-mono font-medium"
                    style={{ color: '#00d4ff' }}
                  >Secure Access Portal</span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit}>
                <motion.label className="block text-xs uppercase tracking-[0.1em] text-permira-text-secondary mb-2 font-mono"
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >Enter Password</motion.label>

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6, type: 'spring', damping: 14 }}
                >
                  <motion.div animate={error ? { x: [0, -12, 12, -12, 12, -6, 6, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <input type="password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl text-permira-text font-mono text-lg focus:outline-none focus:ring-2 transition-all ${
                        error
                          ? 'border-permira-danger focus:ring-permira-danger shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                          : 'focus:ring-[rgba(0,212,255,0.5)]'
                      }`}
                      style={{
                        backgroundColor: 'rgba(10,14,26,0.8)',
                        border: error ? '1px solid rgb(239,68,68)' : '1px solid rgba(0,212,255,0.3)',
                        caretColor: '#00d4ff',
                        boxShadow: error ? undefined : '0 0 20px rgba(0,212,255,0.05)',
                      }}
                      placeholder="••••••••••" autoFocus
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
                  transition={{ delay: 1.6, duration: 0.6, type: 'spring', damping: 14 }}
                >
                  <button type="submit" disabled={accessGranted}
                    className="relative w-full mt-5 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 overflow-hidden group disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(90deg, #F5620F, #E04D00)',
                    }}
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      initial={{ x: '-200%' }} animate={{ x: '200%' }}
                      transition={{ delay: 2.2, duration: 1.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                    />
                    <span className="relative tracking-wide">Access War Room</span>
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Bottom status */}
        <motion.div className="text-center mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-permira-text-secondary/40">
            <motion.div className="w-1 h-1 rounded-full bg-permira-success/60"
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
            System Online <span className="mx-1">·</span> Encrypted Connection <span className="mx-1">·</span> v3.0.0
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
