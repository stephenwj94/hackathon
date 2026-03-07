import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

export default function TopBar({ onMenuToggle }) {
  return (
    <div>
      <div className="stripe-motif h-1.5" />

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-permira-card border-b border-permira-border px-4 md:px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 md:gap-4">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-permira-text-secondary hover:text-permira-text"
            onClick={onMenuToggle}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
              <path d="M30 8 L36 22 L30 18 L24 22 Z" fill="#F5620F" />
              <path d="M30 4 L38 24 L30 19 L22 24 Z" fill="#F5620F" opacity="0.7" />
            </svg>
            <span className="text-lg font-bold tracking-[0.1em]">PERMIRA</span>
          </div>
          <span className="hidden sm:inline-flex">
            <Badge variant="orange">Technology Portfolio</Badge>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-permira-text-secondary uppercase tracking-widest hidden sm:block">
            Updated as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </motion.header>
    </div>
  );
}
