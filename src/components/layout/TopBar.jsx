import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

export default function TopBar() {
  return (
    <div>
      {/* Stripe band */}
      <div className="stripe-motif h-1.5" />

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-permira-card border-b border-permira-border px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
              <path d="M30 8 L36 22 L30 18 L24 22 Z" fill="#F5620F" />
              <path d="M30 4 L38 24 L30 19 L22 24 Z" fill="#F5620F" opacity="0.7" />
            </svg>
            <span className="text-lg font-bold tracking-[0.1em]">PERMIRA</span>
          </div>
          <Badge variant="orange">Technology Portfolio</Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-permira-text-secondary uppercase tracking-widest">
            Updated as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </motion.header>
    </div>
  );
}
