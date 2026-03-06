import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating square particle component (4px squares, drifting upward)
function FloatingSquare({ delay, startX, startY }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: 4,
        height: 4,
        backgroundColor: 'rgba(245,98,15,0.15)',
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.4, 0.2, 0.4, 0],
        y: [0, -80, -160, -240, -320],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// Animated dot grid with pulsing opacity
function DotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(245,98,15,0.12) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
    </div>
  );
}

// Scanline effect — repeating horizontal lines
function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
      }}
    />
  );
}

// Scanning beam effect
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(245,98,15,0.3) 20%, rgba(245,98,15,0.6) 50%, rgba(245,98,15,0.3) 80%, transparent 100%)',
        boxShadow: '0 0 20px rgba(245,98,15,0.3), 0 0 60px rgba(245,98,15,0.1)',
      }}
      initial={{ top: '-5%' }}
      animate={{ top: '105%' }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'linear',
        repeatDelay: 2,
      }}
    />
  );
}

// Corner bracket decorations
function CornerBrackets() {
  const bracketStyle = "absolute w-8 h-8 border-permira-orange/30";
  return (
    <>
      <motion.div
        className={`${bracketStyle} top-4 left-4 border-t-2 border-l-2`}
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6, ease: 'easeOut' }}
      />
      <motion.div
        className={`${bracketStyle} top-4 right-4 border-t-2 border-r-2`}
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.9, duration: 0.6, ease: 'easeOut' }}
      />
      <motion.div
        className={`${bracketStyle} bottom-4 left-4 border-b-2 border-l-2`}
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6, ease: 'easeOut' }}
      />
      <motion.div
        className={`${bracketStyle} bottom-4 right-4 border-b-2 border-r-2`}
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.1, duration: 0.6, ease: 'easeOut' }}
      />
    </>
  );
}

export default function PasswordGate({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
      setAccessGranted(true);
      // Brief "ACCESS GRANTED" flash before transitioning
      setTimeout(() => {
        // Auth state already set by onLogin, framer-motion exit handles transition
      }, 1200);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-permira-dark flex items-center justify-center z-50 overflow-hidden"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Background layers */}
      <DotGrid />
      <ScanlineOverlay />
      <ScanLine />
      <CornerBrackets />

      {/* Radial glow behind the card */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(245,98,15,0.08) 0%, rgba(13,31,60,0.05) 40%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.5, ease: 'easeOut' }}
      />

      {/* Orbiting ring */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full border border-permira-orange/10 pointer-events-none"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 360 }}
        transition={{
          scale: { delay: 0.5, duration: 1, ease: 'easeOut' },
          opacity: { delay: 0.5, duration: 1 },
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
        }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-permira-orange/40 shadow-[0_0_12px_rgba(245,98,15,0.4)]" />
      </motion.div>

      {/* Second orbiting ring (counter-rotate) */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full border border-permira-orange/5 pointer-events-none"
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

      {/* Floating square particles (6-8 small squares, 4px) */}
      {Array.from({ length: 8 }, (_, i) => (
        <FloatingSquare
          key={`sq-${i}`}
          delay={1.5 + i * 0.8 + Math.random() * 2}
          startX={20 + Math.random() * 60}
          startY={60 + Math.random() * 30}
        />
      ))}

      {/* ACCESS GRANTED overlay */}
      <AnimatePresence>
        {accessGranted && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-permira-dark/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              <div
                className="text-4xl font-bold font-mono tracking-[0.3em] text-green-400"
                style={{ textShadow: '0 0 30px rgba(74,222,128,0.6), 0 0 60px rgba(74,222,128,0.3)' }}
              >
                ACCESS GRANTED
              </div>
              <motion.div
                className="h-0.5 bg-green-400 mt-3 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ boxShadow: '0 0 10px rgba(74,222,128,0.5)' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN CARD ===== */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* Flame icon — drops in from above */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -120, scale: 0.3, rotate: -20 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.9, type: 'spring', damping: 12, stiffness: 100 }}
        >
          <div className="relative">
            {/* Glow behind flame */}
            <motion.div
              className="absolute inset-0 blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(245,98,15,0.4) 0%, transparent 70%)' }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="relative">
              <motion.path
                d="M36 6 L44 26 L36 20 L28 26 Z"
                fill="#F5620F"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
              <motion.path
                d="M36 2 L46 28 L36 21 L26 28 Z"
                fill="#F5620F"
                opacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              />
              <motion.path
                d="M36 10 L41 24 L36 20 L31 24 Z"
                fill="#FF8844"
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* "PERMIRA" — flies in from the left, with glow */}
        <motion.h1
          className="text-center text-4xl font-bold tracking-[0.2em] text-white mb-1"
          style={{ textShadow: '0 0 20px rgba(245, 98, 15, 0.4)' }}
          initial={{ opacity: 0, x: -200, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.7, duration: 0.8, type: 'spring', damping: 15 }}
        >
          PERMIRA
        </motion.h1>

        {/* "PORTFOLIO INTELLIGENCE" — flies in from the right */}
        <motion.p
          className="text-center text-sm tracking-[0.25em] text-permira-orange/80 mb-4 uppercase"
          initial={{ opacity: 0, x: 200, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.9, duration: 0.8, type: 'spring', damping: 15 }}
        >
          Portfolio Intelligence
        </motion.p>

        {/* SECURE ACCESS PORTAL label */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <motion.span
            className="text-[11px] uppercase font-mono text-permira-orange font-medium"
            initial={{ letterSpacing: '0.05em' }}
            animate={{ letterSpacing: '0.3em' }}
            transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
          >
            Secure Access Portal
          </motion.span>
        </motion.div>

        {/* Decorative divider lines — expand from center */}
        <motion.div
          className="flex items-center gap-3 mb-8 px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div
            className="flex-1 h-px bg-gradient-to-r from-transparent to-permira-orange/40"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: 'right' }}
          />
          <motion.div
            className="w-2 h-2 rotate-45 border border-permira-orange/40"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ delay: 1.4, duration: 0.4, type: 'spring' }}
          />
          <motion.div
            className="flex-1 h-px bg-gradient-to-l from-transparent to-permira-orange/40"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Card container — scales up from center */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, type: 'spring', damping: 14 }}
        >
          {/* Card border glow */}
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(245,98,15,0.2) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.1) 100%)',
            }}
            animate={{
              background: [
                'linear-gradient(135deg, rgba(245,98,15,0.2) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.1) 100%)',
                'linear-gradient(225deg, rgba(245,98,15,0.2) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.1) 100%)',
                'linear-gradient(315deg, rgba(245,98,15,0.2) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.1) 100%)',
                'linear-gradient(45deg, rgba(245,98,15,0.2) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.1) 100%)',
                'linear-gradient(135deg, rgba(245,98,15,0.2) 0%, transparent 40%, transparent 60%, rgba(245,98,15,0.1) 100%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative bg-permira-card/90 backdrop-blur-xl border border-permira-border/50 rounded-2xl overflow-hidden">
            {/* Stripe band — wipes in */}
            <motion.div
              className="stripe-motif h-1.5"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.6, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />

            <div className="p-8 pt-6">
              {/* Security badge — fades in from above */}
              <motion.div
                className="flex justify-center mb-5"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-permira-orange/10 border border-permira-orange/20">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-permira-orange"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-permira-orange font-medium">
                    Secure Access
                  </span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit}>
                {/* Label — fades in from left */}
                <motion.label
                  className="block text-xs uppercase tracking-[0.1em] text-permira-text-secondary mb-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  Enter Password
                </motion.label>

                {/* Input — rises from below */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.6, type: 'spring', damping: 14 }}
                >
                  <motion.div
                    animate={error ? {
                      x: [0, -12, 12, -12, 12, -6, 6, 0],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-permira-dark/80 border rounded-xl text-permira-text font-mono text-lg focus:outline-none focus:ring-2 transition-all caret-permira-orange ${
                        error
                          ? 'border-permira-danger focus:ring-permira-danger shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                          : 'border-permira-border/50 focus:ring-permira-orange/50 focus:border-permira-orange/50 shadow-[0_0_20px_rgba(245,98,15,0.05)]'
                      }`}
                      placeholder="••••••••••"
                      autoFocus
                      style={{ caretColor: '#F5620F' }}
                    />
                  </motion.div>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -5, height: 0 }}
                      className="text-permira-danger text-sm mt-2 flex items-center gap-1.5"
                    >
                      <span className="inline-block w-1 h-1 rounded-full bg-permira-danger" />
                      Access denied. Try again.
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Button — rises from below with delay */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.6, type: 'spring', dampen: 14 }}
                >
                  <button
                    type="submit"
                    disabled={accessGranted}
                    className="relative w-full mt-5 py-3.5 bg-gradient-to-r from-permira-orange to-[#E04D00] hover:from-[#FF6E1A] hover:to-permira-orange text-white font-semibold rounded-xl transition-all duration-300 overflow-hidden group disabled:opacity-50"
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      initial={{ x: '-200%' }}
                      animate={{ x: '200%' }}
                      transition={{ delay: 2.5, duration: 1.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                    />
                    <span className="relative tracking-wide">Access Dashboard</span>
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Bottom status text — fades in last */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-permira-text-secondary/40">
            <motion.div
              className="w-1 h-1 rounded-full bg-permira-success/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            System Online
            <span className="mx-1">·</span>
            Encrypted Connection
            <span className="mx-1">·</span>
            v2.4.1
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
